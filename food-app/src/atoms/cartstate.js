import { atom } from "recoil";

export const cartState = atom({
  key: "cartState",
  default: [],
});
export const sessionState = atom({
  key: "sessionState",
  default: null,
});
