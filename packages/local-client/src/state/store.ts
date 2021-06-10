import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
import { saveMiddleware } from './middleware/save-middleware';

export const store = createStore(
  reducer,
  {},
  applyMiddleware(saveMiddleware, thunk)
);
