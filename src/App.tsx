import { useState, useEffect } from 'react'
import axios from 'axios'
import md5 from 'md5'
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner'
import './App.css'

interface IProduct {
  id: string;
  product: string;
  price?: number;
  brand?: string | null;
}

const App = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const password = 'Valantis';
  const timestamp = new Date().toISOString().slice(0,10).replace(/-/g,"");
  const auth = md5(`${password}_${timestamp}`);

  const [filterProduct, setFilterProduct] = useState<string | null>(null);
  const [filterPrice, setFilterPrice] = useState<number | null>(null);
  const [filterBrand, setFilterBrand] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.post('http://api.valantis.store:40000/', {
          action: 'get_ids',
          params: { offset: page * 50, limit: 50 }
        }, {
          headers: { 'X-Auth': auth }
        });
        const ids = response.data.result;
        const productResponse = await axios.post('http://api.valantis.store:40000/', {
          action: 'get_items',
          params: { ids }
        }, {
          headers: { 'X-Auth': auth }
        });
        const uniqueProducts = Array.from(new Map(productResponse.data.result.map((item: IProduct) => [item.id, item])).values()) as IProduct[];
        setProducts(uniqueProducts);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error(error);
          if (error.response && error.response.data && error.response.data.error) {
            console.error(`Error ID: ${error.response.data.error}`);
          }
        }
        fetchProducts();
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, auth]);

  const handleFilter = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://api.valantis.store:40000/', {
        action: 'filter',
        params: { 
          product: filterProduct, 
          price: filterPrice, 
          brand: filterBrand 
        }
      }, {
        headers: { 'X-Auth': auth }
      });
      const ids = response.data.result;
      const productResponse = await axios.post('http://api.valantis.store:40000/', {
        action: 'get_items',
        params: { ids }
      }, {
        headers: { 'X-Auth': auth }
      });
      const uniqueProducts = Array.from(new Map(productResponse.data.result.map((item: IProduct) => [item.id, item])).values()) as IProduct[];
      setProducts(uniqueProducts);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error);
        if (error.response && error.response.data && error.response.data.error) {
          console.error(`Error ID: ${error.response.data.error}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='control-container'>
        <div className='control-container__filter'>
          <input type="text" placeholder="Product" onChange={e => setFilterProduct(e.target.value)} />
          <input type="text" placeholder="Brand" onChange={e => setFilterBrand(e.target.value)} />
          <input type="number" placeholder="Price" onChange={e => setFilterPrice(Number(e.target.value))} />
          <button onClick={handleFilter}>Filter</button>
        </div>
        <div className='control-container__pages'>
          <button onClick={() => setPage(page - 1)} disabled={page === 0}>
            Previous Page
          </button>
          <button onClick={() => setPage(page + 1)}>
            Next Page
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Brand</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id || '-'}</td>
                <td>{product.product || '-'}</td>
                <td>{product.brand || '-'}</td>
                <td>{product.price !== undefined ? product.price : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default App;
