import React from 'react';
import { Smartphone, Headphones, Watch, ShoppingBag } from 'lucide-react';

export const PRODUCTS = [
  { id: 1, name: 'Wireless Headphones', price: 2999, icon: <Headphones size={40} /> },
  { id: 2, name: 'Smart Watch', price: 4999, icon: <Watch size={40} /> },
  { id: 3, name: 'Running Shoes', price: 3499, icon: <ShoppingBag size={40} /> },
  { id: 4, name: 'Backpack', price: 1999, icon: <ShoppingBag size={40} /> },
  { id: 5, name: 'Smartphone', price: 24999, icon: <Smartphone size={40} /> },
  { id: 6, name: 'Bluetooth Speaker', price: 2499, icon: <Headphones size={40} /> }
];
