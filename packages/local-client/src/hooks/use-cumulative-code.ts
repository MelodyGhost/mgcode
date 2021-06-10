import { useTypedSelector } from './use-typed-selector';

const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    if (!state.cells) return '';
    const { data, order } = state.cells;
    const combinedCell = order.map((id) => data[id]);

    const showFunction = `
        import _React from 'react'
        import _ReactDOM from 'react-dom'

        var show = (value) => {
          const root = document.querySelector('#root');
          if (typeof value === 'object') {
            if (value.$$typeof && value.props) {
              _ReactDOM.render(value, root)
            } else {
              root.innerHTML = JSON.stringify(value);
            }
          } else {
            root.innerHTML = value;
          }
        };
      `;

    const showFunctionNoop = `var show = () => {}`;

    const combinedCode = [];

    for (let curCell of combinedCell) {
      if (curCell.type === 'code') {
        // combinedCode.push('show("")');
        if (curCell.id === cellId) {
          combinedCode.push(showFunction);
        } else {
          combinedCode.push(showFunctionNoop);
        }

        combinedCode.push(curCell.content);
      }

      if (curCell.id === cellId) {
        break;
      }
    }

    return combinedCode.join('\n');
  });
};

export default useCumulativeCode;
