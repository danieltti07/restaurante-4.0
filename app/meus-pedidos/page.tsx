
"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useOrders } from "@/context/order-context"
import { Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react"
import { useSocket } from "../hooks/useSocket"

export default function MyOrdersPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const { getUserOrders } = useOrders()
  const router = useRouter()
  const orders = getUserOrders()

  // Atualiza pedidos em tempo real quando houver mudança de status
  useSocket(() => {
    getUserOrders()
  })

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  // Função para renderizar o ícone de status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "preparing":
        return <Package className="w-5 h-5 text-blue-500" />
      case "delivering":
        return <Truck className="w-5 h-5 text-purple-500" />
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  // Função para obter o texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente"
      case "preparing":
        return "Preparando"
      case "delivering":
        return "Em entrega"
      case "completed":
        return "Concluído"
      case "cancelled":
        return "Cancelado"
      default:
        return "Desconhecido"
    }
  }

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Adicionar função para formatar mensagem de WhatsApp após a função formatDate
  const formatWhatsAppMessage = (order: any) => {
    // Formatar cabeçalho do pedido
    let message = `*CONSULTA DE PEDIDO #${order.id.split("_")[1]}*\n\n`
    message += `*Cliente:* ${order.deliveryInfo.name}\n`
    message += `*Telefone:* ${order.deliveryInfo.phone}\n`

    // Adicionar endereço se for entrega
    if (order.deliveryType === "delivery" && order.deliveryInfo.address) {
      message += `*Endereço:* ${order.deliveryInfo.address}\n`
    }

    message += `*Tipo:* ${order.deliveryType === "delivery" ? "Entrega" : "Retirada"}\n`
    message += `*Horário:* ${order.deliveryInfo.time}\n`
    message += `*Status:* ${
      order.status === "pending"
        ? "Pendente"
        : order.status === "preparing"
          ? "Preparando"
          : order.status === "delivering"
            ? "Em entrega"
            : order.status === "completed"
              ? "Concluído"
              : "Cancelado"
    }\n\n`

    // Adicionar itens do pedido
    message += `*ITENS DO PEDIDO:*\n`
    order.items.forEach((item: any) => {
      message += `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}\n`
      if (item.observations) {
        message += `   _Obs: ${item.observations}_\n`
      }
    })

    // Adicionar total
    message += `\n*TOTAL: R$ ${order.total.toFixed(2).replace(".", ",")}*`

    return encodeURIComponent(message)
  }

  // Adicionar função para contatar via WhatsApp
  const contactViaWhatsApp = (order: any) => {
    const whatsappNumber = "5519984213797" // Número do WhatsApp da loja
    const message = formatWhatsAppMessage(order)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

    // Abrir WhatsApp em uma nova aba
    window.open(whatsappUrl, "_blank")
  }

  if (isLoading) {
    return (
      <div className="section-padding">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="section-padding bg-gray-50">
      <div className="container-custom max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Meus Pedidos</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="mb-4">Você ainda não fez nenhum pedido.</p>
            <Link href="/cardapio" className="btn-primary inline-block">
              Ver Cardápio
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Pedido #{order.id.split("_")[1]}</p>
                    <p className="text-sm">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(order.status)}
                    <span className="ml-2 font-medium">{getStatusText(order.status)}</span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Itens do Pedido</h3>
                    <ul className="space-y-2">
                      {order.items.map((item: any, index: number) => (
                        <li key={index} className="flex justify-between">
                          <span>
                            {item.quantity}x {item.name}
                            {item.observations && (
                              <span className="text-sm text-gray-500 block">Obs: {item.observations}</span>
                            )}
                          </span>
                          <span>R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total</span>
                    <span>R$ {order.total.toFixed(2).replace(".", ",")}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Informações de Entrega</h3>
                      <p>{order.deliveryInfo.name}</p>
                      <p>{order.deliveryInfo.phone}</p>
                      {order.deliveryType === "delivery" && order.deliveryInfo.address && (
                        <p>{order.deliveryInfo.address}</p>
                      )}
                      <p>Tipo: {order.deliveryType === "delivery" ? "Entrega" : "Retirada"}</p>
                      <p>Horário: {order.deliveryInfo.time}</p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Status do Pedido</h3>
                      {order.status === "pending" && <p>Seu pedido foi recebido e está sendo processado.</p>}
                      {order.status === "preparing" && <p>Seu pedido está sendo preparado na cozinha.</p>}
                      {order.status === "delivering" && (
                        <p>
                          Seu pedido está a caminho! Tempo estimado de entrega:{" "}
                          {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : "Em breve"}
                        </p>
                      )}
                      {order.status === "completed" && (
                        <p>Seu pedido foi {order.deliveryType === "delivery" ? "entregue" : "retirado"}. Obrigado!</p>
                      )}
                      {order.status === "cancelled" && <p>Este pedido foi cancelado.</p>}

                      {["pending", "preparing"].includes(order.status) && (
                        <div className="flex gap-2 mt-2">
                          <Link href={`/acompanhar/${order.id}`} className="btn-primary inline-block">
                            Acompanhar Pedido
                          </Link>
                          <button
                            onClick={() => contactViaWhatsApp(order)}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-4 h-4 mr-1"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.35 5L2 22l5.05-1.35C8.47 21.51 10.18 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.46 14.06c-.25.71-1.49 1.34-2.06 1.35-.56.01-1.08.21-3.54-.89-2.97-1.33-4.88-4.61-5.03-4.83-.15-.21-1.2-1.6-1.2-3.05 0-1.45.74-2.15 1.02-2.45.28-.3.6-.37.8-.37.2 0 .4 0 .58.01.2.01.45-.06.7.53.25.58.85 2.03.93 2.18.08.14.13.31.04.5-.1.19-.14.31-.28.48-.14.17-.3.38-.42.51-.14.14-.29.29-.12.56.16.27.73 1.15 1.57 1.87 1.08.91 1.98 1.19 2.27 1.33.28.14.45.12.62-.07.17-.19.74-.86.94-1.15.2-.29.4-.24.67-.14.27.09 1.7.8 1.99.94.29.15.49.22.56.34.07.12.07.71-.18 1.4z" />
                            </svg>
                            WhatsApp
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
