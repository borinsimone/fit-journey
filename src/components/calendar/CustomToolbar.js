import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CustomToolbar = (toolbar) => {
  return (
    <div className='custom-toolbar'>
      <button
        onClick={() => toolbar.onNavigate('PREV')}
        className='btn-prev'
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={() => toolbar.onNavigate('NEXT')}
        className='btn-next'
      >
        <FaChevronRight />
      </button>
      ciao
    </div>
  );
};
export default CustomToolbar;
