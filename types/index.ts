export interface Color {
  id: string;
  name: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  colorId: string;
  color?: Color;
} 