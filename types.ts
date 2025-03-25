export interface Product {
  id: string;
  categoryId: string;
  subcategoryId: string;
  providerId: string;
  name: string;
  nameTag: string;
  description: string;
  price: string;
  offerPrice: string | null;
  hasOffer: boolean;
  isFeatured: boolean;
  isArchived: boolean;
  stock: number;
  colorId: string;
  weight: number;
  attributes: any | null;
  createdAt: string;
  updatedAt: string;
  images: Image[];
  category: Category;
  subcategory: Subcategory;
  provider: Provider;
  color: Color;
}
export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}
export interface Billboard {
  id: string;
  label: string;
  imageUrl?: string;
  images?: {
    url: string;
    alt: string;
  }[];
}

export interface Provider {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  id: string;
  url: string;
}

export interface Category {
  id: string;
  name: string;
  title?: string;
  imageUrl: string;
  billboard?: Billboard;
  createdAt: string;
  updatedAt: string;
}

export interface Size {
  id: string;
  name: string;
  value: string;
};

export interface Color {
  id: string;
  name: string;
  value: string;
};
