'use client'; 

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

const MonacoEditorDemo: React.FC = () => {
  const [code, setCode] = useState('// Type your code here\nconsole.log("Hello, Monaco!");');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark'); // or 'light', 'hc-black'

  function handleEditorDidMount(editor: any, monaco: any) {
    // Here you can access the editor instance and the monaco instance
    // You can perform operations like setting initial content, adding commands, etc.
    console.log('Editor mounted:', editor);
    console.log('Monaco instance:', monaco);
  }

  function handleEditorChange(value: string | undefined) {
    if (value !== undefined) {
      setCode(value);
    }
  }

  return (
    <div style={{ height: '500px', width: '100%', border: '1px solid #ccc', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px', borderBottom: '1px solid #eee', display: 'flex', gap: '10px', backgroundColor: '#f0f0f0' }}>
        <label>
          Language:
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ marginLeft: '5px' }}>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="json">JSON</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="python">Python</option>
          </select>
        </label>
        <label>
          Theme:
          <select value={theme} onChange={(e) => setTheme(e.target.value)} style={{ marginLeft: '5px' }}>
            <option value="vs-dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </label>
      </div>
      <div style={{ flexGrow: 1 }}> {/* Ensures editor takes remaining height */}
        <Editor
          height="100%" // Set height to 100% of parent div
          language={language}
          theme={theme}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false }, // Disable minimap for cleaner look
            fontSize: 14,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true, // Crucial for responsive resizing
          }}
        />
      </div>
    </div>
  );
};

export default MonacoEditorDemo;