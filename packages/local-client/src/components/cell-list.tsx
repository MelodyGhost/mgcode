import { useEffect } from 'react';
import { useTypedSelector } from '../hooks/use-typed-selector';
import useActions from '../hooks/use-actions';
import AddNewCell from './add-new-cell';
import CellListItem from './cell-list-item';
import './cell-list.css';

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cells }) =>
    cells?.order.map((id) => cells.data[id])
  );

  const { fetchCells } = useActions();

  useEffect(() => {
    fetchCells();
  }, [fetchCells]);

  const renderedCells = cells?.map((cell) => (
    <div key={cell.id}>
      <CellListItem cell={cell} />
      <AddNewCell previousCellId={cell.id} />
    </div>
  ));

  return (
    <div className="cell-list">
      <AddNewCell isOnlyOne={!cells?.length} previousCellId={null} />
      {renderedCells}
    </div>
  );
};

export default CellList;
