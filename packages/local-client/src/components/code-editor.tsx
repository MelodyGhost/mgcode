import Editor, { OnMount } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import MonacoJSXHighlighter from 'monaco-jsx-highlighter';
import { useRef } from 'react';
import '../style/index.css';
import './syntax.css';

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string | undefined): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Minimal Babel setup for React JSX parsing:
    const babelParse = (code: string) =>
      parse(code, {
        sourceType: 'module',
        plugins: ['jsx'],
      });

    // Instantiate the highlighter
    const monacoJSXHighlighter = new MonacoJSXHighlighter(
      // @ts-ignore
      monaco,
      babelParse,
      traverse,
      editor
    );

    // Activate highlighting (debounceTime default: 100ms)
    monacoJSXHighlighter.highLightOnDidChangeModelContent();
    // Activate JSX commenting
    monacoJSXHighlighter.addJSXCommentCommand();
  };

  const formatWithPrettier = () => {
    // getValue
    const unformatted = editorRef.current.getValue();

    //Format value
    const formatted = prettier
      .format(unformatted, {
        parser: 'babel',
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, '');

    // set the formatted value
    editorRef.current.setValue(formatted);
  };

  return (
    <div className="editor">
      <button onClick={formatWithPrettier} className="formatter">
        Formater
      </button>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={initialValue}
        theme="vs-dark"
        options={{
          tabSize: 2,
          minimap: { enabled: false },
          smoothScrolling: true,
          wordWrap: 'on',
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          automaticLayout: true,
        }}
        onChange={onChange}
        onMount={handleEditorDidMount}
      />
    </div>
  );
};

export default CodeEditor;
