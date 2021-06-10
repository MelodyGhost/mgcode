import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { ActionCreator } from '../state';

const useActions = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    return bindActionCreators(ActionCreator, dispatch);
  }, [dispatch]);
};

export default useActions;
