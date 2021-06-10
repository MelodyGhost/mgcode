import MDEditor from '@uiw/react-md-editor';
import './mark-down-edditor.css';
import React, { useState, useEffect, useRef } from 'react';
import useActions from '../hooks/use-actions';
import { Cell } from '../state';

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const [edditing, setEdditing] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const { updateCell } = useActions();

  useEffect(() => {
    const setEdditingFalse = (event: Event) => {
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        return;
      }
      setEdditing(false);
    };
    document.addEventListener('click', setEdditingFalse, { capture: true });
    return () =>
      document.removeEventListener('click', setEdditingFalse, {
        capture: true,
      });
  }, [edditing]);

  return (
    <div className="">
      {edditing && (
        <div ref={ref} className="text-editor">
          <MDEditor
            value={cell.content}
            onChange={(value) => updateCell(cell.id, value || '')}
          />
        </div>
      )}
      {!edditing && (
        <div onClick={() => setEdditing(true)} className="text-editor card">
          <div className="card-content">
            <MDEditor.Markdown source={cell.content || 'Click here to edit'} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TextEditor;
