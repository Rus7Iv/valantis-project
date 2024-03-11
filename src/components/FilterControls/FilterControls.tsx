import { useState } from 'react'
import { IFilterControlsProps } from './interface'
import './style.css'

const FilterControls  = ({ onFilter }: IFilterControlsProps) => {
  const [filterProduct, setFilterProduct] = useState<string | null>(null);
  const [filterPrice, setFilterPrice] = useState<number | null>(null);
  const [filterBrand, setFilterBrand] = useState<string | null>(null);

  const handleFilter = () => {
    const filters = {
      ...(filterProduct && { product: filterProduct }),
      ...(filterPrice && { price: filterPrice }),
      ...(filterBrand && { brand: filterBrand }),
    };
    onFilter(filters);
  };

  return (
    <div className='filters-container'>
      <input type="text" placeholder="Product" onChange={e => setFilterProduct(e.target.value)} />
      <input type="text" placeholder="Brand" onChange={e => setFilterBrand(e.target.value)} />
      <input type="number" placeholder="Price" onChange={e => setFilterPrice(Number(e.target.value))} />
      <button onClick={handleFilter}>Filter</button>
    </div>
  );
};

export default FilterControls;
