import './code-cell.css';
import React, { useEffect } from 'react';
import CodeEditor from './code-editor';
import Preview from './Preview';
import Resizable from './resizable';
import useAction from '../hooks/use-actions';
import { Cell } from '../state';
import { useTypedSelector } from '../hooks/use-typed-selector';
import useCumulativeCode from '../hooks/use-cumulative-code';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useAction();
  const bundle = useTypedSelector((state) => {
    if (state.bundles) {
      return state.bundles[cell.id];
    }
  });

  const cumulativeCode = useCumulativeCode(cell.id);

  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cumulativeCode);
      return;
    }
    let wait: NodeJS.Timeout;

    wait = setTimeout(async () => {
      createBundle(cell.id, cumulativeCode);
    }, 1000);

    return () => clearTimeout(wait);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode, cell.id, createBundle]);

  return (
    <Resizable direction="vertical">
      <div className="code-cell-wrapper">
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value ? value : '')}
          />
        </Resizable>
        <div className="preview-wrapper">
          {!bundle || bundle?.loading ? (
            <div id="progress">
              <progress className="progress is-small is-primary">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} error={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
