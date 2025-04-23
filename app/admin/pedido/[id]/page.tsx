"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useOrders, type Order } from "@/context/order-context"
import {
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  MapPin,
  Phone,
  User,
  Calendar,
  CreditCard,
} from "lucide-react"

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const { getOrderById, updateOrderStatus } = useOrders()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState("")

  // Verificar se o usuário é admin
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else if (user?.role !== "admin") {
        router.push("/")
      } else {
        // Buscar o pedido
        const orderData = getOrderById(params.id)
        if (orderData) {
          setOrder(orderData)
        } else {
          setError("Pedido não encontrado")
        }
      }
    }
  }, [isLoading, isAuthenticated, params.id, getOrderById, router, user])

  // Função para atualizar o status do pedido
  const handleUpdateStatus = async (newStatus: string) => {
    if (!order) return

    setIsUpdating(true)
    try {
      await updateOrderStatus(order.id, newStatus)
      // Atualizar o pedido na tela
      const updatedOrder = getOrderById(order.id)
      setOrder(updatedOrder)
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      setError("Ocorreu um erro ao atualizar o status do pedido.")
    } finally {
      setIsUpdating(false)
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
  const formatWhatsAppMessage = (order: Order) => {
    // Formatar cabeçalho do pedido
    let message = `*ATUALIZAÇÃO DE PEDIDO #${order.id.split("_")[1]}*\n\n`
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
    order.items.forEach((item) => {
      message += `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}\n`
      if (item.observations) {
        message += `   _Obs: ${item.observations}_\n`
      }
    })

    // Adicionar total
    message += `\n*TOTAL: R$ ${order.total.toFixed(2).replace(".", ",")}*`

    return encodeURIComponent(message)
  }

  // Adicionar função para contatar cliente via WhatsApp
  const contactCustomerViaWhatsApp = () => {
    if (!order) return

    const customerPhone = order.deliveryInfo.phone.replace(/\D/g, "")
    // Garantir que o número comece com o código do país (Brasil: 55)
    const formattedPhone = customerPhone.startsWith("55") ? customerPhone : `55${customerPhone}`

    const message = `Olá ${order.deliveryInfo.name}, sobre seu pedido #${order.id.split("_")[1]} em Seu Restaurante:`
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`

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

  if (error) {
    return (
      <div className="section-padding">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">{error}</h1>
            <Link href="/admin" className="btn-primary inline-block">
              Voltar para o Painel
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="section-padding">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <p>Carregando informações do pedido...</p>
        </div>
      </div>
    )
  }

  // Função para obter o ícone de status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-8 h-8 text-yellow-500" />
      case "preparing":
        return <Package className="w-8 h-8 text-blue-500" />
      case "delivering":
        return <Truck className="w-8 h-8 text-purple-500" />
      case "completed":
        return <CheckCircle className="w-8 h-8 text-green-500" />
      case "cancelled":
        return <XCircle className="w-8 h-8 text-red-500" />
      default:
        return <Clock className="w-8 h-8 text-gray-500" />
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

  return (
    <div className="section-padding bg-gray-50">
      <div className="container-custom max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/admin" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para o Painel
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-2">Detalhes do Pedido</h1>
                <p className="text-gray-600">
                  Pedido #{order.id.split("_")[1]} • {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                {getStatusIcon(order.status)}
                <span className="ml-2 font-bold">{getStatusText(order.status)}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Informações do Cliente */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-bold mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" /> Informações do Cliente
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Nome</p>
                      <p>{order.deliveryInfo.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Telefone</p>
                      <p>{order.deliveryInfo.phone}</p>
                    </div>
                  </div>
                  {order.deliveryType === "delivery" && order.deliveryInfo.address && (
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Endereço</p>
                        <p>{order.deliveryInfo.address}</p>
                        {order.deliveryInfo.complement && <p>{order.deliveryInfo.complement}</p>}
                      </div>
                    </div>
                  )}
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {order.deliveryType === "delivery" ? "Horário de Entrega" : "Horário de Retirada"}
                      </p>
                      <p>{order.deliveryInfo.time}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações de Pagamento */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-bold mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" /> Informações de Pagamento
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Método de Pagamento</p>
                    <p>
                      {order.paymentMethod === "cash"
                        ? "Dinheiro na entrega"
                        : order.paymentMethod === "card"
                          ? "Cartão na entrega"
                          : "PIX"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Tipo de Entrega</p>
                    <p>{order.deliveryType === "delivery" ? "Entrega" : "Retirada"}</p>
                  </div>
                  <div>
                    <p className="font-medium">Status do Pagamento</p>
                    <p>
                      {order.paymentMethod === "pix" ? (
                        <span className="text-green-600 font-medium">Pago</span>
                      ) : (
                        <span className="text-yellow-600 font-medium">Pagamento na entrega</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Itens do Pedido */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Itens do Pedido</h2>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-4">Item</th>
                      <th className="text-center p-4">Quantidade</th>
                      <th className="text-right p-4">Preço</th>
                      <th className="text-right p-4">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            {item.observations && <p className="text-sm text-gray-500">Obs: {item.observations}</p>}
                          </div>
                        </td>
                        <td className="p-4 text-center">{item.quantity}</td>
                        <td className="p-4 text-right">R$ {item.price.toFixed(2).replace(".", ",")}</td>
                        <td className="p-4 text-right">
                          R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100">
                    <tr>
                      <td colSpan={3} className="p-4 text-right font-bold">
                        Total
                      </td>
                      <td className="p-4 text-right font-bold">R$ {order.total.toFixed(2).replace(".", ",")}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Atualizar Status */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-bold mb-4">Atualizar Status do Pedido</h2>

              {order.status === "cancelled" ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                  Este pedido foi cancelado e não pode ser atualizado.
                </div>
              ) : order.status === "completed" ? (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg">Este pedido já foi concluído.</div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {order.status === "pending" && (
                    <button
                      onClick={() => handleUpdateStatus("preparing")}
                      disabled={isUpdating}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                    >
                      <Package size={18} />
                      {isUpdating ? "Atualizando..." : "Iniciar Preparo"}
                    </button>
                  )}

                  {order.status === "preparing" && order.deliveryType === "delivery" && (
                    <button
                      onClick={() => handleUpdateStatus("delivering")}
                      disabled={isUpdating}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                    >
                      <Truck size={18} />
                      {isUpdating ? "Atualizando..." : "Enviar para Entrega"}
                    </button>
                  )}

                  {(order.status === "preparing" && order.deliveryType === "pickup") ||
                  order.status === "delivering" ? (
                    <button
                      onClick={() => handleUpdateStatus("completed")}
                      disabled={isUpdating}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                    >
                      <CheckCircle size={18} />
                      {isUpdating
                        ? "Atualizando..."
                        : order.deliveryType === "pickup"
                          ? "Marcar como Pronto"
                          : "Confirmar Entrega"}
                    </button>
                  ) : null}

                  {(order.status === "pending" || order.status === "preparing") && (
                    <button
                      onClick={() => handleUpdateStatus("cancelled")}
                      disabled={isUpdating}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                    >
                      <XCircle size={18} />
                      {isUpdating ? "Atualizando..." : "Cancelar Pedido"}
                    </button>
                  )}
                </div>
              )}
              {!["cancelled", "completed"].includes(order.status) && (
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={contactCustomerViaWhatsApp}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.35 5L2 22l5.05-1.35C8.47 21.51 10.18 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.46 14.06c-.25.71-1.49 1.34-2.06 1.35-.56.01-1.08.21-3.54-.89-2.97-1.33-4.88-4.61-5.03-4.83-.15-.21-1.2-1.6-1.2-3.05 0-1.45.74-2.15 1.02-2.45.28-.3.6-.37.8-.37.2 0 .4 0 .58.01.2.01.45-.06.7.53.25.58.85 2.03.93 2.18.08.14.13.31.04.5-.1.19-.14.31-.28.48-.14.17-.3.38-.42.51-.14.14-.29.29-.12.56.16.27.73 1.15 1.57 1.87 1.08.91 1.98 1.19 2.27 1.33.28.14.45.12.62-.07.17-.19.74-.86.94-1.15.2-.29.4-.24.67-.14.27.09 1.7.8 1.99.94.29.15.49.22.56.34.07.12.07.71-.18 1.4z" />
                    </svg>
                    Contatar Cliente via WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
