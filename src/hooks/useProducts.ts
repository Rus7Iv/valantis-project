import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import md5 from 'md5'
import { IProduct } from '../components/ProductTable/interface';

const useProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const password = 'Valantis';
  const timestamp = new Date().toISOString().slice(0,10).replace(/-/g,"");
  const auth = md5(`${password}_${timestamp}`);

  const fetchProducts = useCallback(async () => {
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
  }, [page, auth]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilter = async (product: string | null, price: number | null, brand: string | null) => {
    setLoading(true);
    try {
      const response = await axios.post('http://api.valantis.store:40000/', {
        action: 'filter',
        params: { 
          product: product, 
          price: price, 
          brand: brand 
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

  return { products, page, setPage, loading, handleFilter };
};

export default useProducts;
