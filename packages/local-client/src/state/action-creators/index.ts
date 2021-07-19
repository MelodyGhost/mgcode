import bundle from '../../bundler';
import { Dispatch } from 'redux';
import axios from 'axios';

import { ActionType } from '../action-types';
import {
  DeleteCellAction,
  DirectionType,
  InsertCellAfterAction,
  MoveCellAction,
  UpdateCellAction,
  Action,
} from '../actions';
import { Cell, CellTypes } from '../cell';
import { RootState } from '../reducers';

export const updateCell = (id: string, content: string): UpdateCellAction => {
  return {
    type: ActionType.UPDATE_CELL,
    payload: {
      id,
      content,
    },
  };
};

export const moveCell = (
  id: string,
  direction: DirectionType
): MoveCellAction => {
  return {
    type: ActionType.MOVE_CELL,
    payload: {
      id,
      direction,
    },
  };
};

export const deleteCell = (id: string): DeleteCellAction => {
  return {
    type: ActionType.DELETE_CELL,
    payload: id,
  };
};

export const insertCellAfter = (
  id: string | null,
  type: CellTypes
): InsertCellAfterAction => {
  return {
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
      id,
      type,
    },
  };
};

export const createBundle = (id: string, input: string) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.BUNDLE_START,
      payload: {
        id,
      },
    });

    const result = await bundle(input);

    dispatch({
      type: ActionType.BUNDLE_COMPLETE,
      payload: {
        id,
        bundle: result,
      },
    });
  };
};

export const fetchCells = () => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.FETCH_CELLS,
    });

    try {
      const { data }: { data: Cell[] } = await axios.get('/cells');
      dispatch({
        type: ActionType.FETCH_CELLS_COMPLETE,
        payload: data,
      });
    } catch (err) {
      // Added this for web preview instruction
      if (err.response.status === 404) {
        const str: Cell[] = [
          {
            id: 'yhm4y',
            type: 'text',
            content:
              '#  Welcome to **MG Note** 👋 \n> if you are in web preview (not in your local server), all your changes will be lost if you close the window.\n\n## Usage\n\nThis is an interactive coding environment. You can write Javascript, see it executed, and write comprehensive documentation using markdown.\n\n- Click any text cell (**including this one**) to edit it\n- The code in each code editor is all joined together into one file. If you define a variable in cell #1, you can refer to it in any following cell!\n- You can show any **React component**, **string**, **number**, or anything else by calling the `show` function. This is a function built into this environment. Call show multiple times to show multiple values\n- Re-order or delete cells using the buttons on the top right\n- Add new cells by hovering on the divider between each cell\n \nAll of your changes get saved to the file you opened mgnote with. So if you ran `npx mgnote serve test.js`, all of the text and code you write will be saved to the `test.js` file.',
          },
          {
            id: '93psz',
            type: 'code',
            content:
              "import { useState } from 'react';\r\n\r\nconst Counter = () => {\r\n  const [state, setState] = useState(10);\r\n  return (\r\n    <div>\r\n      <button onClick={() => setState(state + 1)}>up</button>\r\n      {state}\r\n      <button onClick={() => setState(state - 1)}>down</button>\r\n    </div>\r\n  );\r\n};\r\n\r\nshow(<Counter />);",
          },
        ];

        dispatch({
          type: ActionType.FETCH_CELLS_COMPLETE,
          payload: str,
        });
        return;
      }
      dispatch({
        type: ActionType.FETCH_CELLS_ERROR,
        payload: err.message,
      });
    }
  };
};

export const saveCells = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    try {
      const { cells } = getState()!;
      const { data, order } = cells!;

      const cellsToSave = order.map((id) => data[id]);
      if (cellsToSave.length) {
        await axios.post('/cells', { cells: cellsToSave });
      }
    } catch (err) {
      dispatch({
        type: ActionType.SAVE_CELLS_ERROR,
        payload: err.string,
      });
    }
  };
};
