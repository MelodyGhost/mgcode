import { useRef, useEffect } from 'react';
import './preview.css';

interface previewProps {
  code: string;
  error: string;
}

const html = `
  <html>
    <head> </head>
    <body>
      <div id='root'></div>
      <script>
        const showError = (err) => {
          const root = document.querySelector('#root')
          root.innerHTML = '<div style="color:red"><h1>RuntimeError:</h1>' + err + '</div>'
          console.error(err)
        }
        
        window.addEventListener('message', (event) => {
          try {
            eval(event.data)
          } catch (err) {
            showError(err)
          }
        }, false)

        window.addEventListener('error', (event) => {
          event.preventDefault();
          showError(event.error)
        })

      </script>
    </body>
  </html>
`;

const Preview: React.FC<previewProps> = ({ code, error }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    if (!iframe.current) return;
    iframe.current.srcdoc = html;
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 20);
  }, [code]);

  return (
    <div className="preview">
      <iframe
        ref={iframe}
        srcDoc={html}
        sandbox="allow-scripts"
        title="Frame for code execution"
      ></iframe>
      {error && <div className="preview-error">{error}</div>}
    </div>
  );
};

export default Preview;
