export interface Product {
  id: number;
  name: string;
  description: string[];
  imageUrl: string;
  originalPrice: number;
  slashedPrice: number;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Notification {
  id: number;
  productId: number;
  message: string;
  timestamp: Date;
}

export interface Store {
  id: number;
  name: string;
  address: string;
  hours: string;
  isOpen: boolean;
  lat: number;
  lng: number;
}