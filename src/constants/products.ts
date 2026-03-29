export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  category: string;
  isPublished: boolean;
  mediaUrl?: string;
}

export const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Premium Wireless Headphones', slug: 'premium-wireless-headphones', price: 299.99, category: 'Electronics', isPublished: true },
  { id: 2, name: 'Mechanical Gaming Keyboard', slug: 'mechanical-gaming-keyboard', price: 159.99, category: 'Electronics', isPublished: true },
  { id: 3, name: 'Ergonomic Office Chair', slug: 'ergonomic-office-chair', price: 349.99, category: 'Furniture', isPublished: false },
  { id: 4, name: 'Ultra-wide 4K Monitor', slug: 'ultra-wide-4k-monitor', price: 799.99, category: 'Electronics', isPublished: true },
  { id: 5, name: 'Smart Fitness Tracker', slug: 'smart-fitness-tracker', price: 99.99, category: 'Wearables', isPublished: true },
  { id: 6, name: 'Noise Cancelling Earbuds', slug: 'noise-cancelling-earbuds', price: 199.99, category: 'Electronics', isPublished: true },
  { id: 7, name: 'RGB Gaming Mouse', slug: 'rgb-gaming-mouse', price: 79.99, category: 'Electronics', isPublished: true },
  { id: 8, name: 'Aluminum Laptop Stand', slug: 'aluminum-laptop-stand', price: 49.99, category: 'Accessories', isPublished: true },
  { id: 9, name: '8-in-1 USB-C Hub', slug: '8-in-1-usb-c-hub', price: 69.99, category: 'Accessories', isPublished: true },
  { id: 10, name: '1080p HD Webcam', slug: '1080p-hd-webcam', price: 89.99, category: 'Electronics', isPublished: true },
  { id: 11, name: 'Portable SSD 1TB', slug: 'portable-ssd-1tb', price: 129.99, category: 'Storage', isPublished: true },
  { id: 12, name: 'Memory Foam Wrist Rest', slug: 'memory-foam-wrist-rest', price: 19.99, category: 'Accessories', isPublished: true },
  { id: 13, name: 'Monitor Light Bar', slug: 'monitor-light-bar', price: 49.99, category: 'Accessories', isPublished: true },
  { id: 14, name: 'Ergonomic Vertical Mouse', slug: 'ergonomic-vertical-mouse', price: 89.99, category: 'Accessories', isPublished: true },
  { id: 15, name: 'Felt Desk Pad Large', slug: 'felt-desk-pad-large', price: 29.99, category: 'Furniture', isPublished: true },
];
