'use client'

import React, { useEffect, useRef } from 'react'

const jsonData = {
    initial_status: '#Locked_WaitingPin',
    declared_events: [
        '@enter_pin',
        '@wrong_pin',
        '@too_many_failures',
        '@timeout',
        '@unlock',
        '@reopen',
        '@force_expire',
        '@vault_created',
        '@set_status',
    ],
    declared_statuses: [
        '#Locked_WaitingPin',
        '#Locked_TooManyAttempts',
        '#Unlocked',
        '#Expired',
        '#Closed',
    ],
    rules: [
        {
            on_event: '@enter_pin',
            if: "vault.state == '#Locked_WaitingPin' && is_correct_pin() && !is_expired()",
            do: [
                { call: 'extract_pin()' },
                { call: 'log_pin_attempt()' },
                { call: 'record_successful_access()' },
                { set_status: '#Unlocked' },
            ],
        },
        {
            on_event: '@wrong_pin',
            if: "vault.state == '#Locked_WaitingPin' && has_attempts_left()",
            do: [
                { call: 'increment_attempts()' },
                { set_status: '#Locked_WaitingPin' },
            ],
        },
        {
            on_event: '@too_many_failures',
            if: "vault.state == '#Locked_WaitingPin'",
            do: [
                { call: 'log_lockout()' },
                { set_status: '#Locked_TooManyAttempts' },
            ],
        },
        {
            on_event: '@timeout',
            if: "vault.state == '#Locked_WaitingPin'",
            do: [{ call: 'log_timeout()' }, { set_status: '#Expired' }],
        },
        {
            on_event: '@unlock',
            if: "vault.state == '#Unlocked'",
            do: [
                { call: 'finalize_access()' },
                { call: 'log_closure()' },
                { set_status: '#Closed' },
            ],
        },
        {
            on_event: '@reopen',
            if: "vault.state == '#Closed'",
            do: [
                { call: 'reset_locker_state()' },
                { set_status: '#Locked_WaitingPin' },
            ],
        },
        {
            on_event: '@force_expire',
            do: [{ call: 'force_expiration()' }, { set_status: '#Expired' }],
        },
        {
            on_event: '@vault_created',
            do: [
                { set_status: '#Locked_WaitingPin' },
                { call: 'set_locked_indicator()' },
                { call: 'start_attempt_timer()' },
            ],
        },
        {
            on_event: '@set_status',
            if: "vault.state == '#Unlocked'",
            do: [{ call: 'open_safe()' }],
        },
        {
            on_event: '@set_status',
            if: "vault.state == '#Closed'",
            do: [{ call: 'archive_locker()' }],
        },
        {
            on_event: '@set_status',
            if: "vault.state == '#Expired'",
            do: [{ call: 'mark' }],
        },
    ],
}

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
            iframeRef.current?.contentWindow?.postMessage(
                message,
                'https://jsoncrack.com',
            )
        }, 800) // Wait for iframe to fully load

        return () => clearTimeout(timeout)
    }, [])

    return (
        <div
            style={{
                height: '600px',
                border: '1px solid #ccc',
                borderRadius: '6px',
            }}
        >
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
