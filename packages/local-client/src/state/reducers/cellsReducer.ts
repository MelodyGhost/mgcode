import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce(
  (state: CellsState = initialState, action: Action): CellsState => {
    switch (action.type) {
      case ActionType.UPDATE_CELL:
        const { id, content } = action.payload;
        state.data[id].content = content;
        return state;
      case ActionType.MOVE_CELL:
        const { direction } = action.payload;
        const currentIndex = state.order.indexOf(action.payload.id);
        const newIndex =
          direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (newIndex < 0 || newIndex > state.order.length - 1) return state;

        state.order[currentIndex] = state.order[newIndex];
        state.order[newIndex] = action.payload.id;
        return state;

      case ActionType.INSERT_CELL_AFTER:
        const newCell: Cell = {
          id: randomId(),
          type: action.payload.type,
          content: '',
        };

        state.data[newCell.id] = newCell;

        const foundIndex = state.order.findIndex(
          (id) => id === action.payload.id
        );

        if (foundIndex < 0) {
          state.order.unshift(newCell.id);
        } else {
          state.order.splice(foundIndex + 1, 0, newCell.id);
        }
        return state;

      case ActionType.DELETE_CELL:
        delete state.data[action.payload];

        state.order = state.order.filter((id) => id !== action.payload);
        return state;
      case ActionType.FETCH_CELLS:
        state.loading = true;
        state.error = null;
        return state;
      case ActionType.FETCH_CELLS_COMPLETE:
        state.loading = false;
        state.order = action.payload.map((cell) => cell.id);
        state.data = action.payload.reduce((acc, cell) => {
          acc[cell.id] = cell;
          return acc;
        }, {} as CellsState['data']);
        return state;
      case ActionType.FETCH_CELLS_ERROR:
        state.loading = false;
        state.error = action.payload;
        return state;
      case ActionType.SAVE_CELLS_ERROR:
        state.loading = false;
        state.error = action.payload;
        return state;
      default:
        return state;
    }
  }
);

const randomId = () => Math.random().toString(36).substr(2, 5);

export default reducer;
