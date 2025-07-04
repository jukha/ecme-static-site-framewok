'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import * as yaml from 'js-yaml'
import useDebounce from '@/utils/hooks/useDebounce'
import useTheme from '@/utils/hooks/useTheme'
import { MODE_DARK } from '@/constants/theme.constant'
import Loading from '@/components/shared/Loading'

// Dynamically import Monaco editor, but don't render it immediately
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const DEFAULT_YAML = `initial_status: '#Locked_WaitingPin'
declared_events:
  - '@enter_pin'
  - '@wrong_pin'
  - '@too_many_failures'
  - '@timeout'
  - '@unlock'
  - '@reopen'
  - '@force_expire'
  - '@vault_created'
  - '@set_status'
declared_statuses:
  - '#Locked_WaitingPin'
  - '#Locked_TooManyAttempts'
  - '#Unlocked'
  - '#Expired'
  - '#Closed'
rules:
  - on_event: '@enter_pin'
    if: "vault.state == '#Locked_WaitingPin' && is_correct_pin() && !is_expired()"
    do:
      - call: 'extract_pin()'
      - call: 'log_pin_attempt()'
      - call: 'record_successful_access()'
      - set_status: '#Unlocked'
`

const minimalJson = { message: 'Loading JSONCrack...' }

const YamlToJsonCrackOptimized = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const parsedJsonRef = useRef<object | null>(null)

  const [yamlText, setYamlText] = useState(DEFAULT_YAML)
  const [iframeReady, setIframeReady] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false) // defer editor render

  const mode = useTheme((state) => state.mode)
  const isDark = mode === MODE_DARK

  // Parse YAML only once on mount for initial default yaml and store in ref
  useEffect(() => {
    try {
      parsedJsonRef.current = yaml.load(DEFAULT_YAML) as object
    } catch {
      parsedJsonRef.current = null
    }
  }, [])

  // Debounced YAML parser
  const parseYaml = useCallback((value: string) => {
    try {
      parsedJsonRef.current = yaml.load(value) as object
    } catch {
      parsedJsonRef.current = null
    }
  }, [])

  const debouncedParseYaml = useDebounce(parseYaml, 500)

  // Handle editor changes: update text + parse YAML debounced + show loading
  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      if (value !== undefined) {
        setYamlText(value)
        setLoading(true)
        debouncedParseYaml(value)
      }
    },
    [debouncedParseYaml],
  )

  // Send data to iframe when ready and on YAML changes (using parsedJsonRef to avoid extra renders)
  useEffect(() => {
    if (!iframeReady) return

    // Send minimal JSON first to prime iframe immediately
    iframeRef.current?.contentWindow?.postMessage(
      {
        json: JSON.stringify(minimalJson, null, 2),
        options: { theme: isDark ? 'dark' : 'light', direction: 'RIGHT' },
      },
      'https://jsoncrack.com',
    )
    setLoading(true)

    // Send actual JSON after short delay
    const timer = setTimeout(() => {
      if (parsedJsonRef.current) {
        iframeRef.current?.contentWindow?.postMessage(
          {
            json: JSON.stringify(parsedJsonRef.current, null, 2),
            options: { theme: isDark ? 'dark' : 'light', direction: 'RIGHT' },
          },
          'https://jsoncrack.com',
        )
        setLoading(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [iframeReady, isDark, yamlText])

  // After iframe is ready, defer editor rendering by 500ms to speed initial load UI
  useEffect(() => {
    if (iframeReady) {
      const timer = setTimeout(() => {
        setShowEditor(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [iframeReady])

  const toggleFullScreen = () => setIsFullScreen((v) => !v)

  const handleDownload = () => {
    if (!parsedJsonRef.current) return
    const blob = new Blob([JSON.stringify(parsedJsonRef.current, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'parsed.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      className={`flex flex-col h-screen w-full bg-white dark:bg-zinc-900 ${
        isFullScreen ? 'fixed inset-0 z-50 bg-white dark:bg-zinc-900' : ''
      }`}
    >
      {/* Toolbar */}
      <div className="flex justify-between items-center px-4 py-2 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-300 dark:border-zinc-700">
        <div className="text-sm font-semibold text-zinc-800 dark:text-white">
          YAML → JSONCrack Viewer
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="text-xs px-2 py-1 border border-zinc-400 dark:border-zinc-600 rounded bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white"
            title="Export JSON"
          >
            ⬇️ Export JSON
          </button>
          <button
            onClick={toggleFullScreen}
            className="text-xs px-2 py-1 border border-zinc-400 dark:border-zinc-600 rounded bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white"
            title={isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullScreen ? '🡸 Exit Fullscreen' : '🡺 Fullscreen'}
          </button>
        </div>
      </div>

      {/* Split View */}
      <div className="flex flex-1 overflow-hidden">
        {/* YAML Editor (deferred) */}
        <div className="w-[35%] border-r border-zinc-200 dark:border-zinc-700">
          {showEditor ? (
            <MonacoEditor
              height="100%"
              defaultLanguage="yaml"
              value={yamlText}
              theme={isDark ? 'vs-dark' : 'light'}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
              }}
            />
          ) : (
            // lightweight placeholder box while editor loads
            <div className="flex items-center justify-center h-full text-zinc-500">
              Loading Editor...
            </div>
          )}
        </div>

        {/* JSONCrack Viewer with Loader */}
        <div className="w-[65%] h-full relative">
          {loading && (
            <div className="absolute inset-0 z-10 bg-white/80 dark:bg-zinc-900/80 flex items-center justify-center">
              <Loading loading={true} />
            </div>
          )}
          <iframe
            ref={iframeRef}
            onLoad={() => setIframeReady(true)}
            src="https://jsoncrack.com/widget"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            title="JSONCrack Viewer"
          />
        </div>
      </div>
    </div>
  )
}

export default YamlToJsonCrackOptimized
