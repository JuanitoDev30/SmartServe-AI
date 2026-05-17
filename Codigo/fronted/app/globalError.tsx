'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : '';

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="es">
      <head>
        <style>{`
          * { 
            box-sizing: border-box; 
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdf4 100%);
            color: #1a1a1a;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
          }
          
          .error-container {
            width: 100%;
            max-width: 480px;
            text-align: center;
            animation: fadeIn 0.5s ease-out;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .error-icon-wrapper {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: #fef2f2;
            margin-bottom: 1.5rem;
            animation: pulse 2s ease-in-out infinite;
          }
          
          @keyframes pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.2); }
            50% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
          }
          
          .error-icon {
            width: 32px;
            height: 32px;
            color: #dc2626;
          }
          
          .error-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #171717;
            margin-bottom: 0.5rem;
            line-height: 1.3;
          }
          
          .error-subtitle {
            font-size: 0.95rem;
            color: #525252;
            margin-bottom: 1.5rem;
            line-height: 1.5;
          }
          
          .error-subtitle code {
            background: #e5e5e5;
            padding: 0.15em 0.4em;
            border-radius: 4px;
            font-family: ui-monospace, monospace;
            font-size: 0.85em;
          }
          
          .error-card {
            background: white;
            border-radius: 12px;
            padding: 1.25rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04);
            border: 1px solid #e5e5e5;
            text-align: left;
          }
          
          .error-message-label {
            font-size: 0.7rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #dc2626;
            margin-bottom: 0.5rem;
          }
          
          .error-message {
            font-family: ui-monospace, monospace;
            font-size: 0.85rem;
            color: #404040;
            line-height: 1.5;
            word-break: break-word;
          }
          
          .error-actions {
            display: flex;
            gap: 0.75rem;
            justify-content: center;
            flex-wrap: wrap;
          }
          
          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.65rem 1.25rem;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s ease;
            border: none;
            text-decoration: none;
          }
          
          .btn-primary {
            background: #16a34a;
            color: white;
          }
          
          .btn-primary:hover {
            background: #15803d;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
          }
          
          .btn-secondary {
            background: white;
            color: #404040;
            border: 1px solid #d4d4d4;
          }
          
          .btn-secondary:hover {
            background: #fafafa;
            border-color: #a3a3a3;
          }
          
          .error-details {
            margin-top: 1.5rem;
          }
          
          .error-details summary {
            list-style: none;
            cursor: pointer;
            font-size: 0.8rem;
            color: #737373;
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            user-select: none;
          }
          
          .error-details summary::-webkit-details-marker {
            display: none;
          }
          
          .error-details summary .chevron {
            transition: transform 0.2s ease;
            font-size: 0.6rem;
          }
          
          .error-details[open] summary .chevron {
            transform: rotate(180deg);
          }
          
          .error-stack {
            margin-top: 0.75rem;
            padding: 1rem;
            background: #fafafa;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            overflow-x: auto;
            font-family: ui-monospace, monospace;
            font-size: 0.7rem;
            line-height: 1.6;
            color: #525252;
            text-align: left;
            max-height: 200px;
            overflow-y: auto;
          }
          
          .error-digest {
            margin-top: 1rem;
            font-size: 0.7rem;
            color: #a3a3a3;
          }
        `}</style>
      </head>
      <body>
        <div className="error-container">
          <div className="error-icon-wrapper">
            <svg
              className="error-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="error-title">Algo salio mal</h1>
          <p className="error-subtitle">
            Ocurrio un error al cargar <code>{pathname || '/'}</code>
          </p>

          <div className="error-card">
            <p className="error-message-label">Mensaje de error</p>
            <p className="error-message">
              {error.message || 'Error desconocido'}
            </p>
          </div>

          <div className="error-actions">
            <button className="btn btn-primary" onClick={reset}>
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Intentar de nuevo
            </button>
            <Link href="/" className="btn btn-secondary">
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              s Ir al inicio
            </Link>
          </div>

          {error.stack && (
            <details className="error-details">
              <summary>
                <span className="chevron">▼</span>
                Ver detalles tecnicos
              </summary>
              <pre className="error-stack">{error.stack}</pre>
            </details>
          )}

          {error.digest && (
            <p className="error-digest">Error ID: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
