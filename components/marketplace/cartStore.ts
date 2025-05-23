// If you haven't already, run: npm install zustand
import { create } from 'zustand'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  unit: string
  supplier: string
  verified: boolean
  image: string
  brandId: string
  genericId: string
}

interface CartState {
  cartItems: CartItem[]
  addItem: (itemToAdd: CartItem) => void
  setCartItems: (items: CartItem[]) => void
  clearCart: () => void
  updateQuantity: (id: string, newQuantity: number) => void
  removeItem: (id: string) => void
}

export const useCartStore = create<CartState>((set: (fn: (state: CartState) => Partial<CartState> | CartState) => void) => ({
  cartItems: [],
  addItem: (itemToAdd: CartItem) => set((state: CartState) => {
    const existingItemIndex = state.cartItems.findIndex(item => item.id === itemToAdd.id);
    if (existingItemIndex !== -1) {
      const updatedCartItems = state.cartItems.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + itemToAdd.quantity }
          : item
      );
      return { cartItems: updatedCartItems };
    } else {
      return { cartItems: [...state.cartItems, itemToAdd] };
    }
  }),
  setCartItems: (items: CartItem[]) => set({ cartItems: items }),
  clearCart: () => set({ cartItems: [] }),
  updateQuantity: (id: string, newQuantity: number) => set((state: CartState) => ({
    cartItems: state.cartItems.map((item: CartItem) => item.id === id ? { ...item, quantity: newQuantity } : item)
  })),
  removeItem: (id: string) => set((state: CartState) => ({
    cartItems: state.cartItems.filter((item: CartItem) => item.id !== id)
  })),
}))
