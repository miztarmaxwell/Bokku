export interface Product {
  id: number;
  name: string;
  description: string[];
  imageUrl: string;
  originalPrice: number;
  slashedPrice: number;
}

export interface Notification {
  id: number;
  message: string;
  timestamp: Date;
}
