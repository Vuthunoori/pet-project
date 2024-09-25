// src/atoms/cartState.js
import { atom } from 'recoil';

export const cartState = atom({
  key: 'cartState', 
  default: [], // Default value 
});
export const currentRestaurantState = atom({
  key: 'currentRestaurantState',
  default: null, // Will hold the current restaurant ID
});
export const currentPrevState = atom({
  key: 'currentPrevState',
  default: null, // Will hold the current restaurant ID
});
export const currentNameState = atom({
  key: 'currentNameState',
  default: null, // Will hold the current restaurant ID
});
export const PrevNameState = atom({
  key: 'PrevNameState',
  default: null, // Will hold the current restaurant ID
});