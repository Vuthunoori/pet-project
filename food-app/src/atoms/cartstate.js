// src/atoms/cartState.js
import { atom } from 'recoil';

export const cartState = atom({
  key: 'cartState', 
  default: [], // Default value 
});
// export const currentRestaurantState = atom({
//   key: 'currentRestaurantState',
//   default: null, // Will hold the current restaurant ID
// });