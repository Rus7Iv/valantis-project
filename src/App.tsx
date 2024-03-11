import FilterControls from './components/FilterControls/FilterControls'
import PaginationControls from './components/PaginationControls/PaginationControls'
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner'
import ProductTable from './components/ProductTable/ProductTable'
import useProducts from './hooks/useProducts'
import './App.css'

const App = () => {
  const { products, page, setPage, loading, handleFilter } = useProducts();

  return (
    <>
      <div className='control-container'>
        <FilterControls onFilter={handleFilter} />
        <PaginationControls page={page} onPageChange={setPage} />
      </div>
      {loading ? <LoadingSpinner /> : <ProductTable products={products} />}
    </>
  );
};

export default App;

