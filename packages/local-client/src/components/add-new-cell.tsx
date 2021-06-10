import './add-new-cell.css';
import useActions from '../hooks/use-actions';

interface AddNewCellProps {
  previousCellId: string | null;
  isOnlyOne?: boolean;
}

const AddNewCell: React.FC<AddNewCellProps> = ({
  previousCellId,
  isOnlyOne = false,
}) => {
  const { insertCellAfter } = useActions();

  return (
    <div className={isOnlyOne ? 'add-button is-only-one' : 'add-button'}>
      <button
        className="button is-rounded is-small is-primary"
        onClick={() => insertCellAfter(previousCellId, 'code')}
      >
        <span className="icon">
          <i className="fas fa-plus"></i>
        </span>
        <span>Code</span>
      </button>
      <button
        className="button is-rounded is-small is-primary"
        onClick={() => insertCellAfter(previousCellId, 'text')}
      >
        <span className="icon">
          <i className="fas fa-plus"></i>
        </span>
        <span>Text</span>
      </button>
      <div className="divider"></div>
    </div>
  );
};

export default AddNewCell;
