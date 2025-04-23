"use client"

import { Trash2, Plus, Minus } from "lucide-react"
import { type CartItem as CartItemType, useCart } from "@/context/cart-context"

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, updateObservations } = useCart()

  return (
    <div className="border-b py-4">
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium">{item.name}</h3>
          <p className="text-sm text-gray-600">
            R$ {item.price.toFixed(2).replace(".", ",")} x {item.quantity}
          </p>
          {item.observations && <p className="text-xs text-gray-500 mt-1">Obs: {item.observations}</p>}
        </div>

        <div className="flex items-start">
          <p className="font-medium mr-4">R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}</p>
          <button
            onClick={() => removeItem(item.id)}
            className="text-red-500 hover:text-red-700"
            aria-label="Remover item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center mt-2">
        <div className="flex items-center border rounded-md">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="px-2 py-1 text-gray-600 hover:text-primary"
            aria-label="Diminuir quantidade"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 py-1">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="px-2 py-1 text-gray-600 hover:text-primary"
            aria-label="Aumentar quantidade"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => {
            const obs = prompt("Observações:", item.observations || "")
            if (obs !== null) {
              updateObservations(item.id, obs)
            }
          }}
          className="ml-4 text-sm text-gray-600 hover:text-primary"
        >
          {item.observations ? "Editar observações" : "Adicionar observações"}
        </button>
      </div>
    </div>
  )
}
