'use client'

import React, { useEffect, useRef } from 'react'

const jsonData = [
  {
    on_event: 'vault_created',
    do: [
      {
        start_timer: {
          duration: '72h',
          event: 'timeout',
        },
      },
    ],
  },
  {
    on_event: 'vault_claimed',
    do: [
      { set_status: 'claimed' },
      { log: 'User claimed vault' },
    ],
  },
  {
    on_event: 'timeout',
    if: "vault.status != 'claimed'",
    do: [
      { call: 'dao_reclaim()' },
      { set_status: 'reclaimed' },
    ],
  },
  {
    on_event: 'manual_override',
    do: [
      { call: 'force_close()' },
      { set_status: 'closed' },
    ],
  },
]

const JSONCrackEditor = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const jsonString = JSON.stringify(jsonData, null, 2)

    const message = {
      json: jsonString,
      options: {
        theme: 'light', // or 'dark'
        direction: 'RIGHT', // or 'DOWN', 'LEFT', 'UP'
      },
    }

    const timeout = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(message, 'https://jsoncrack.com')
    }, 800) // Wait for iframe to fully load

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div style={{ height: '600px', border: '1px solid #ccc', borderRadius: '6px' }}>
      <iframe
        ref={iframeRef}
        src="https://jsoncrack.com/widget"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        title="JSONCrack Embed"
      />
    </div>
  )
}

export default JSONCrackEditor
