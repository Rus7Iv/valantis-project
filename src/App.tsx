import { useState, useEffect } from 'react';
import axios from 'axios';
import md5 from 'md5';

interface Product {
  id: string;
  product: string;
  price: number;
  brand: string | null;
}

const App = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
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
          params: { ids }
        }, {
          headers: { 'X-Auth': auth }
        });
        setProducts(productResponse.data.result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, auth]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        products.map(product => (
          <div key={product.id}>
            <h2>{product.product}</h2>
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