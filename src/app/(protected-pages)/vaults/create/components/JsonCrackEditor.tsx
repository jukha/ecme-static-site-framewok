'use client'

import React, { useEffect, useState } from 'react'

interface JSONCrackDemoProps {
    initialJson?: string | object
    height?: string
}

const JSONCrackEditor: React.FC<JSONCrackDemoProps> = ({
    initialJson = {},
    height = '600px',
}) => {
    const [jsonString, setJsonString] = useState('')

    useEffect(() => {
        let formattedJson = ''
        try {
            if (typeof initialJson === 'object' && initialJson !== null) {
                formattedJson = JSON.stringify(initialJson, null, 2)
            } else if (typeof initialJson === 'string') {
                formattedJson = JSON.stringify(JSON.parse(initialJson), null, 2)
            }
        } catch (e) {
            console.error('Invalid JSON provided to JSONCrackDemo:', e)
            formattedJson = String(initialJson)
        }
        setJsonString(formattedJson)
    }, [initialJson])

    const jsonCrackUrl = `https://jsoncrack.com/editor?json=${encodeURIComponent(jsonString)}`

    return (
        <div
            style={{
                width: '100%',
                height: height,
                border: '1px solid #ccc',
                borderRadius: '4px',
                overflow: 'hidden',
            }}
        >
            <iframe
                src={jsonCrackUrl}
                title="JSON Crack Editor"
                style={{ width: '100%', height: '100%', border: 'none' }}
                allowFullScreen
            ></iframe>
            {jsonString === '' && (
                <div
                    style={{
                        padding: '20px',
                        textAlign: 'center',
                        color: '#666',
                    }}
                >
                    Loading JSON Crack... or no JSON provided.
                </div>
            )}
        </div>
    )
}

export default JSONCrackEditor
