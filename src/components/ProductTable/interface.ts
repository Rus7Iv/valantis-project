export interface IProduct {
  id: string;
  product: string;
  price?: number;
  brand?: string | null;
}

export interface IProductTableProps {
  products: IProduct[];
}
