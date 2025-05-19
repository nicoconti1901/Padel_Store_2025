import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from "@/types/product";

type CartItem = {
    product: Product;
    quantity: number;
};

interface CartStore {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
}

export const useCart = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            addItem: (product: Product) => set((state) => {
                const existingItem = state.items.find(item => item.product.id === product.id);
                if (existingItem) {
                    return {
                        items: state.items.map(item =>
                            item.product.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        )
                    };
                }
                return { items: [...state.items, { product, quantity: 1 }] };
            }),
            removeItem: (productId: number) => set((state) => ({
                items: state.items.filter(item => item.product.id !== productId)
            })),
            updateQuantity: (productId: number, quantity: number) => {
                const id = Number(productId);
                if (isNaN(id)) return;
                
                set((state) => ({
                    items: state.items.map(item =>
                        item.product.id === id
                            ? { ...item, quantity: Math.max(0, quantity) }
                            : item
                    ).filter(item => item.quantity > 0)
                }));
            },
            clearCart: () => set({ items: [] })
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
); 