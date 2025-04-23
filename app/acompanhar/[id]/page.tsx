"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useOrders, type Order } from "@/context/order-context"
import { Clock, Package, Truck, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function TrackOrderPage({ params }: { params: { id: string } }) {
  const { isAuthenticated, isLoading } = useAuth()
  const { getOrderById, cancelOrder } = useOrders()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [error, setError] = useState("")

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    // Buscar o pedido
    const orderData = getOrderById(params.id)
    if (orderData) {
      setOrder(orderData)
    } else {
      setError("Pedido não encontrado")
    }
  }, [isLoading, isAuthenticated, params.id, getOrderById, router])

  // Atualizar o pedido a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedOrder = getOrderById(params.id)
      if (updatedOrder) {
        setOrder(updatedOrder)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [params.id, getOrderById])

  const handleCancelOrder = async () => {
    if (!order) return

    if (!window.confirm("Tem certeza que deseja cancelar este pedido?")) {
      return
    }

    setIsCancelling(true)
    try {
      const success = await cancelOrder(order.id)
      if (success) {
        const updatedOrder = getOrderById(order.id)
        setOrder(updatedOrder)
      } else {
        setError("Não foi possível cancelar o pedido. O pedido já pode estar em rota de entrega.")
      }
    } catch (err) {
      setError("Ocorreu um erro ao cancelar o pedido.")
      console.error(err)
    } finally {
      setIsCancelling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="section-padding">
        <div className="container-custom max-w-2xl mx-auto text-center">
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="section-padding">
        <div className="container-custom max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">{error}</h1>
            <Link href="/meus-pedidos" className="btn-primary inline-block">
              Ver Meus Pedidos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="section-padding">
        <div className="container-custom max-w-2xl mx-auto text-center">
          <p>Carregando informações do pedido...</p>
        </div>
      </div>
    )
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

  // Adicionar função para contatar via WhatsApp
  const contactViaWhatsApp = () => {
    if (!order) return

    const whatsappNumber = "5519984213797" // Número do WhatsApp da loja
    const message = formatWhatsAppMessage(order)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

    // Abrir WhatsApp em uma nova aba
    window.open(whatsappUrl, "_blank")
  }

  // Calcular o progresso do pedido
  const getOrderProgress = () => {
    switch (order.status) {
      case "pending":
        return 25
      case "preparing":
        return 50
      case "delivering":
        return 75
      case "completed":
        return 100
      case "cancelled":
        return 0
      default:
        return 0
    }
  }

  return (
    <div className="section-padding bg-gray-50">
      <div className="container-custom max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold mb-2">Acompanhar Pedido</h1>
            <p className="text-gray-600">
              Pedido #{order.id.split("_")[1]} • {formatDate(order.createdAt)}
            </p>
          </div>

          {order.status === "cancelled" ? (
            <div className="p-6 bg-red-50 text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Pedido Cancelado</h2>
              <p className="mb-4">Este pedido foi cancelado.</p>
              <Link href="/cardapio" className="btn-primary inline-block">
                Fazer Novo Pedido
              </Link>
            </div>
          ) : (
            <>
              <div className="p-6">
                <div className="mb-6">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-primary text-white">
                          Progresso do Pedido
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-primary">{getOrderProgress()}%</span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${getOrderProgress()}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between mb-6">
                  <div
                    className={`flex flex-col items-center ${order.status === "pending" || order.status === "preparing" || order.status === "delivering" || order.status === "completed" ? "text-primary" : "text-gray-400"}`}
                  >
                    <Clock className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Recebido</span>
                  </div>
                  <div
                    className={`flex flex-col items-center ${order.status === "preparing" || order.status === "delivering" || order.status === "completed" ? "text-primary" : "text-gray-400"}`}
                  >
                    <Package className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Preparando</span>
                  </div>
                  {order.deliveryType === "delivery" && (
                    <div
                      className={`flex flex-col items-center ${order.status === "delivering" || order.status === "completed" ? "text-primary" : "text-gray-400"}`}
                    >
                      <Truck className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium">Em Entrega</span>
                    </div>
                  )}
                  <div
                    className={`flex flex-col items-center ${order.status === "completed" ? "text-primary" : "text-gray-400"}`}
                  >
                    <CheckCircle className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">
                      {order.deliveryType === "delivery" ? "Entregue" : "Pronto"}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                  <h3 className="font-bold mb-2">Status Atual</h3>
                  {order.status === "pending" && (
                    <p>Seu pedido foi recebido e está sendo processado. Em breve iniciaremos a preparação.</p>
                  )}
                  {order.status === "preparing" && (
                    <p>Seu pedido está sendo preparado na cozinha com todo o cuidado.</p>
                  )}
                  {order.status === "delivering" && (
                    <p>Seu pedido está a caminho! O entregador está se dirigindo ao seu endereço.</p>
                  )}
                  {order.status === "completed" && (
                    <p>
                      Seu pedido foi{" "}
                      {order.deliveryType === "delivery" ? "entregue" : "finalizado e está pronto para retirada"}. Bom
                      apetite!
                    </p>
                  )}

                  {order.estimatedDelivery && (
                    <p className="mt-2 font-medium">
                      Previsão de {order.deliveryType === "delivery" ? "entrega" : "conclusão"}:{" "}
                      {formatDate(order.estimatedDelivery)}
                    </p>
                  )}

                  {order.currentLocation && order.status !== "completed" && (
                    <p className="mt-2">Localização atual: {order.currentLocation}</p>
                  )}
                </div>
              </div>

              <div className="p-6 border-t">
                <h3 className="font-bold mb-4">Resumo do Pedido</h3>
                <div className="mb-4">
                  <ul className="space-y-2">
                    {order.items.map((item, index) => (
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

              <div className="p-6 border-t bg-gray-50">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div>
                    <Link href="/meus-pedidos" className="text-primary hover:underline">
                      ← Voltar para Meus Pedidos
                    </Link>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
                    <button
                      onClick={contactViaWhatsApp}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 mr-2"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.35 5L2 22l5.05-1.35C8.47 21.51 10.18 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.46 14.06c-.25.71-1.49 1.34-2.06 1.35-.56.01-1.08.21-3.54-.89-2.97-1.33-4.88-4.61-5.03-4.83-.15-.21-1.2-1.6-1.2-3.05 0-1.45.74-2.15 1.02-2.45.28-.3.6-.37.8-.37.2 0 .4 0 .58.01.2.01.45-.06.7.53.25.58.85 2.03.93 2.18.08.14.13.31.04.5-.1.19-.14.31-.28.48-.14.17-.3.38-.42.51-.14.14-.29.29-.12.56.16.27.73 1.15 1.57 1.87 1.08.91 1.98 1.19 2.27 1.33.28.14.45.12.62-.07.17-.19.74-.86.94-1.15.2-.29.4-.24.67-.14.27.09 1.7.8 1.99.94.29.15.49.22.56.34.07.12.07.71-.18 1.4z" />
                      </svg>
                      Falar no WhatsApp
                    </button>

                    {["pending", "preparing"].includes(order.status) && (
                      <button
                        onClick={handleCancelOrder}
                        disabled={isCancelling}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        {isCancelling ? "Cancelando..." : "Cancelar Pedido"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
