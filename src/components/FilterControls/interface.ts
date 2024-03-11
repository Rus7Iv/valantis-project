export interface IFilterControlsProps {
  onFilter: (filters: { product?: string | null, price?: number | null, brand?: string | null }) => void;
}
