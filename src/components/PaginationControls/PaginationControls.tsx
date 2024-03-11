import './style.css'
import { IPaginationControlsProps } from './interface';

const PaginationControls = ({ page, onPageChange }: IPaginationControlsProps) => (
  <div className='pagination-container'>
    <button onClick={() => onPageChange(page - 1)} disabled={page === 0}>
      Previous Page
    </button>
    <button onClick={() => onPageChange(page + 1)}>
      Next Page
    </button>
  </div>
);

export default PaginationControls;
