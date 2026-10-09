import React, { useState, useEffect, useRef } from 'react';
import { 
  LuPlus, 
  LuChevronDown, 
  LuMic, 
  LuArrowUp, 
  LuFileCode, 
  LuRefreshCw, 
  LuExternalLink, 
  LuTerminal
} from 'react-icons/lu';
import './HeroSection.css';

interface FileSystem {
  [fileName: string]: string;
}

interface GenerationResult {
  files: FileSystem;
  activeFile: string;
  isError?: boolean;
}

const API_URL = 'https://euv1-0.onrender.com';
const API_KEY = '96fd6333c1305c283760466c22c149aae7f868b1dbf6ada2aae78a1444e3cc4c';

export const Hero: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        const fileNames = Object.keys(data);
        const defaultActive = fileNames.find(f => f.toLowerCase().includes('app')) || fileNames[0];

        setResult({
          files: data,
          activeFile: defaultActive,
          isError: false,
        });
      } else {
        throw new Error("No valid JSON files map returned.");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown connection error';
      setResult({
        files: {
          'App.jsx': `import React from 'react';\n\nexport default function ErrorApp() {\n  return (\n    <div style={{ padding: '20px', color: '#991b1b', background: '#fef2f2', borderRadius: '8px' }}>\n      <h3>Failed to Connect</h3>\n      <p>Could not reach backend at ${API_URL}. Details: ${errorMessage}</p>\n    </div>\n  );\n}`,
          'styles.css': `body { margin: 0; padding: 20px; font-family: sans-serif; background: #fff; }`
        },
        activeFile: 'App.jsx',
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (newCode: string) => {
    if (!result) return;
    setResult({
      ...result,
      files: {
        ...result.files,
        [result.activeFile]: newCode,
      },
    });
  };

  const handleOpenInSandbox = async () => {
    if (!result) return;

    const parameters = {
      files: {
        'package.json': {
          content: {
            dependencies: {
              react: '^18.0.0',
              'react-dom': '^18.0.0',
              'react-scripts': '^5.0.0',
            },
          },
        },
        ...Object.keys(result.files).reduce((acc: Record<string, { content: string }>, fileName) => {
          acc[fileName] = { content: result.files[fileName] };
          return acc;
        }, {}),
        'index.js': {
          content: `import React from "react";\nimport { createRoot } from "react-dom/client";\nimport App from "./App";\n\nconst root = createRoot(document.getElementById("root"));\nroot.render(<App />);`,
        },
      },
    };

    try {
      const response = await fetch('https://codesandbox.io/api/v1/sandboxes/define?json=1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(parameters),
      });

      const data = await response.json();
      if (data.sandbox_id) {
        window.open(`https://codesandbox.io/s/${data.sandbox_id}?file=/${result.activeFile}`, '_blank');
      }
    } catch (err) {
      console.error('Failed to export to CodeSandbox:', err);
    }
  };

  // حماية المعاينة المباشرة وتجنب انهيار المتصفح
  useEffect(() => {
    if (!result || !iframeRef.current) return;

    const timer = setTimeout(() => {
      try {
        const iframeDoc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
        if (!iframeDoc) return;

        const fileKeys = Object.keys(result.files);
        
        const cssCode = fileKeys
          .filter((fileName) => fileName.endsWith('.css'))
          .map((fileName) => result.files[fileName])
          .join('\n');

        const componentCodes = fileKeys
          .filter((fileName) => fileName.endsWith('.js') || fileName.endsWith('.jsx') || fileName.endsWith('.tsx'))
          .filter((fileName) => !fileName.toLowerCase().includes('app'))
          .map((fileName) => {
            const code = result.files[fileName];
            return code
              .replace(/import\s+['"].*?['"];?/g, '')
              .replace(/export\s+default\s+[A-Za-z0-9_]+;?/g, '')
              .replace(/export\s+default\s+/g, '');
          })
          .join('\n\n');

        const mainFileKey = fileKeys.find(k => k.toLowerCase().includes('app')) || fileKeys[0];
        const fullMainCode = result.files[mainFileKey] || '';

        let componentName = 'App';
        const match = fullMainCode.match(/export\s+default\s+(?:function\s+)?([A-Za-z0-9_]+)/);
        if (match && match[1]) {
          componentName = match[1];
        }

        const cleanedMainCode = fullMainCode
          .replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, '')
          .replace(/import\s+['"].*?\.css['"];?/g, '')
          .replace(/export\s+default\s+function\s+/g, 'function ')
          .replace(/export\s+default\s+class\s+/g, 'class ')
          .replace(/export\s+default\s+[A-Za-z0-9_]+;?/g, '');

        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { margin: 0; padding: 16px; font-family: sans-serif; background: #ffffff; color: #000000; }
                ${cssCode}
              </style>
              <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
              <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
              <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            </head>
            <body>
              <div id="root"></div>
              <script type="text/babel">
                try {
                  const { useState, useEffect, useRef, useMemo, useCallback } = React;

                  ${componentCodes}

                  ${cleanedMainCode}

                  const TargetComponent = typeof ${componentName} !== 'undefined' 
                    ? ${componentName} 
                    : (typeof App !== 'undefined' ? App : null);

                  if (TargetComponent) {
                    const root = ReactDOM.createRoot(document.getElementById('root'));
                    root.render(<TargetComponent />);
                  } else {
                    document.getElementById('root').innerHTML = \`
                      <div style="color: red; padding: 10px;">
                        Component undefined. Check export name.
                      </div>
                    \`;
                  }
                } catch (err) {
                  document.getElementById('root').innerHTML = \`
                    <div style="color: #991b1b; padding: 12px; border: 1px solid #fecdd3; background: #fef2f2; border-radius: 6px; font-family: monospace;">
                      <strong>Render Error:</strong>
                      <pre style="white-space: pre-wrap; font-size: 12px; margin-top: 6px;">\${err.message}</pre>
                    </div>
                  \`;
                }
              </script>
            </body>
          </html>
        `;

        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
      } catch (e) {
        console.error("Iframe rendering error:", e);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [result?.files]);

  return (
    <section className="hero-section">
      <div className="hero-container">
        <h1 className="hero-title">What do you want to create?</h1>

        <form className="hero-input-card" onSubmit={handleSubmit}>
          <div className="input-row">
            <textarea
              className="hero-textarea"
              placeholder="Ask MohamedAI to build..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              disabled={loading}
            />
          </div>

          <div className="input-toolbar">
            <div className="toolbar-left">
              <button type="button" className="action-icon-btn" title="Add attachment">
                <LuPlus size={18} />
              </button>
              <div className="model-selector">
                <span className="model-dot"></span>
                <span className="model-name">v0 Max</span>
                <LuChevronDown className="dropdown-arrow" size={14} />
              </div>
            </div>

            <div className="toolbar-right">
              <div className="project-selector">
                <span>Project</span>
                <LuChevronDown className="dropdown-arrow" size={14} />
              </div>
              <button 
                type="submit" 
                className={`submit-btn ${prompt.trim() ? 'active' : ''}`}
                disabled={loading}
                aria-label="Submit"
              >
                {loading ? (
                  <span className="spinner"></span>
                ) : prompt.trim() ? (
                  <LuArrowUp size={16} />
                ) : (
                  <LuMic size={16} />
                )}
              </button>
            </div>
          </div>
        </form>

        {result && (
          <div className="output-preview-container">
            <div className="output-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LuTerminal className="header-icon" size={16} />
                <span className="header-title">Live Web Emulator & Workspace</span>
              </div>
            </div>

            <div className="output-body">
              <div className="code-pane">
                <div className="file-tabs">
                  {Object.keys(result.files).map((fileName) => (
                    <button
                      key={fileName}
                      type="button"
                      className={`file-tab ${result.activeFile === fileName ? 'active' : ''}`}
                      onClick={() => setResult({ ...result, activeFile: fileName })}
                    >
                      <LuFileCode size={14} />
                      <span>{fileName}</span>
                    </button>
                  ))}
                </div>

                <textarea
                  className="code-editor-input"
                  value={result.files[result.activeFile] || ''}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  spellCheck={false}
                />
              </div>

              <div className="preview-pane">
                <iframe
                  ref={iframeRef}
                  title="Live Preview"
                  style={{ width: '100%', height: '100%', border: 'none', minHeight: '300px' }}
                />

                <div className="preview-footer">
                  <button type="button" className="footer-btn" onClick={handleSubmit} title="Refresh">
                    <LuRefreshCw size={14} />
                    <span>Refresh</span>
                  </button>
                  <button 
                    type="button" 
                    className="footer-btn open-sandbox-btn"
                    onClick={handleOpenInSandbox}
                  >
                    <LuExternalLink size={14} />
                    <span>Open Sandbox</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;