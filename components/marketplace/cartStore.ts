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
  setCartItems: (items: CartItem[]) => void
  clearCart: () => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
}

export const useCartStore = create<CartState>((set: (fn: (state: CartState) => Partial<CartState> | CartState) => void) => ({
  cartItems: [],
  setCartItems: (items: CartItem[]) => set({ cartItems: items }),
  clearCart: () => set({ cartItems: [] }),
  updateQuantity: (id: string, quantity: number) => set((state: CartState) => ({
    cartItems: state.cartItems.map((item: CartItem) => item.id === id ? { ...item, quantity } : item)
  })),
  removeItem: (id: string) => set((state: CartState) => ({
    cartItems: state.cartItems.filter((item: CartItem) => item.id !== id)
  })),
})) 