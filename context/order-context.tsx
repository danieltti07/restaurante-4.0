"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import type { CartItem } from "./cart-context"

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "preparing" | "delivering" | "completed" | "cancelled"
  deliveryType: "delivery" | "pickup"
  deliveryInfo: {
    name: string
    phone: string
    address?: string
    complement?: string
    time: string
  }
  paymentMethod: string
  createdAt: string
  estimatedDelivery?: string
  currentLocation?: string
}

interface OrderContextType {
  orders: Order[]
  activeOrder: Order | null
  createOrder: (
    orderData: Omit<Order, "id" | "createdAt" | "status" | "estimatedDelivery" | "currentLocation">
  ) => Promise<string>
  getOrderById: (orderId: string) => Order | null
  getUserOrders: () => Order[]
  cancelOrder: (orderId: string) => Promise<boolean>
  updateOrderStatus: (orderId: string, newStatus: string) => Promise<boolean>
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [activeOrder, setActiveOrder] = useState<Order | null>(null)

  // Carrega os pedidos do usuário do banco
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return

      try {
        const res = await fetch(`/api/orders?userId=${user.id}`)
        const data = await res.json()
        setOrders(data)

        const active = data.find(
          (order: Order) =>
            ["pending", "preparing", "delivering"].includes(order.status)
        )
        setActiveOrder(active || null)
      } catch (err) {
        console.error("Erro ao buscar pedidos:", err)
      }
    }

    fetchOrders()
  }, [user])

  const createOrder = async (
    orderData: Omit<Order, "id" | "createdAt" | "status" | "estimatedDelivery" | "currentLocation">
  ): Promise<string> => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    })

    if (!res.ok) throw new Error("Erro ao criar pedido")

    const newOrder: Order = await res.json()
    setOrders((prev) => [...prev, newOrder])
    setActiveOrder(newOrder)
    return newOrder.id
  }

  const getOrderById = (orderId: string): Order | null => {
    return orders.find((o) => o.id === orderId) || null
  }

  const getUserOrders = (): Order[] => {
    if (!user) return []
    return orders
      .filter((o) => o.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const cancelOrder = async (orderId: string): Promise<boolean> => {
    const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "PATCH" })
    if (!res.ok) return false

    const updated = await res.json()
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? updated : o))
    )
    if (activeOrder?.id === orderId) setActiveOrder(null)
    return true
  }

  const updateOrderStatus = async (orderId: string, newStatus: string): Promise<boolean> => {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })

    if (!res.ok) return false

    const updated = await res.json()
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? updated : o))
    )

    if (activeOrder?.id === orderId) {
      setActiveOrder(
        ["completed", "cancelled"].includes(newStatus) ? null : updated
      )
    }

    return true
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrder,
        createOrder,
        getOrderById,
        getUserOrders,
        cancelOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider")
  }

  return context
}
