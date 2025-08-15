
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed'
  total: number
  createdAt: string
  updatedAt: string
  shippingAddress?: Address
  paymentMethod?: string
}

export interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface Address {
  id: string
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
  isDefault?: boolean
}

interface OrderStore {
  orders: Order[]
  addresses: Address[]
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateOrderStatus: (orderId: string, status: Order['status']) => void
  addAddress: (address: Omit<Address, 'id'>) => void
  updateAddress: (id: string, address: Partial<Address>) => void
  removeAddress: (id: string) => void
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      addresses: [],
      
      addOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: `order_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({
          orders: [newOrder, ...state.orders]
        }))
      },
      
      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date().toISOString() }
              : order
          )
        }))
      },
      
      addAddress: (addressData) => {
        const newAddress: Address = {
          ...addressData,
          id: `addr_${Date.now()}`,
        }
        set((state) => ({
          addresses: [...state.addresses, newAddress]
        }))
      },
      
      updateAddress: (id, addressData) => {
        set((state) => ({
          addresses: state.addresses.map(addr =>
            addr.id === id ? { ...addr, ...addressData } : addr
          )
        }))
      },
      
      removeAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.filter(addr => addr.id !== id)
        }))
      },
    }),
    {
      name: 'order-store',
    }
  )
)
