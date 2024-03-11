import { IProductTableProps } from './interface'
import './style.css'

const ProductTable =({ products }: IProductTableProps) => {
  if (products.length === 0) {
    return <h1>Not found</h1>
  }

  return (
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
  );
};

export default ProductTable;
