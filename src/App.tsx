import { useState, useEffect } from 'react';
import axios from 'axios';
import md5 from 'md5';

interface IProduct {
  id: string;
  product: string;
  price: number;
  brand: string | null;
}

const App = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ product: '', price: '', brand: '' });
  const password = 'Valantis';
  const timestamp = new Date().toISOString().slice(0,10).replace(/-/g,"");
  const auth = md5(`${password}_${timestamp}`);

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
          params: { ids, ...filter }
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
  }, [page, auth, filter]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, [event.target.name]: event.target.value });
  };

  return (
    <div>
      <div>
        <input type="text" name="product" value={filter.product} onChange={handleFilterChange} placeholder="Filter by product name" />
        <input type="text" name="price" value={filter.price} onChange={handleFilterChange} placeholder="Filter by price" />
        <input type="text" name="brand" value={filter.brand} onChange={handleFilterChange} placeholder="Filter by brand" />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        products.map(product => (
          <div key={product.id}>
            <h2>{product.product}</h2>
            <p>{product.id}</p>
            <p>{product.price}</p>
            <p>{product.brand}</p>
          </div>
        ))
      )}
      <button onClick={() => setPage(page - 1)} disabled={page === 0} style={{marginRight: '50px'}}>
        Previous Page
      </button>
      <button onClick={() => setPage(page + 1)}>
        Next Page
      </button>
    </div>
  );
};

export default App;
