"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Clock, Package, Truck, CheckCircle, XCircle, Search, Filter } from "lucide-react"
import Link from "next/link"

// Importar o contexto de pedidos
import { useOrders, type Order } from "@/context/order-context"

export default function AdminPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const { orders, updateOrderStatus } = useOrders()
  const router = useRouter()

  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  // Verificar se o usuário é admin
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else if (user?.role !== "admin") {
        router.push("/")
      }
    }
  }, [isLoading, isAuthenticated, user, router])

  // Filtrar pedidos
  useEffect(() => {
    if (orders) {
      let filtered = [...orders]

      // Filtrar por status
      if (statusFilter !== "all") {
        filtered = filtered.filter((order) => order.status === statusFilter)
      }

      // Filtrar por termo de busca
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        filtered = filtered.filter(
          (order) =>
            order.id.toLowerCase().includes(term) ||
            order.deliveryInfo.name.toLowerCase().includes(term) ||
            order.deliveryInfo.phone.toLowerCase().includes(term),
        )
      }

      // Ordenar por data (mais recentes primeiro)
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      setFilteredOrders(filtered)
    }
  }, [orders, statusFilter, searchTerm])

  // Função para atualizar o status do pedido
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(orderId)
    try {
      await updateOrderStatus(orderId, newStatus)
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      alert("Ocorreu um erro ao atualizar o status do pedido.")
    } finally {
      setIsUpdating(null)
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

  // Função para obter o ícone de status
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

  if (isLoading) {
    return (
      <div className="section-padding">
        <div className="container-custom max-w-6xl mx-auto text-center">
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null // Redirecionamento já está sendo tratado no useEffect
  }

  return (
    <div className="section-padding bg-gray-50">
      <div className="container-custom max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Painel de Administração</h1>

        {/* Filtros e Busca */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por ID, nome ou telefone"
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                className="border rounded-md p-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos os status</option>
                <option value="pending">Pendentes</option>
                <option value="preparing">Preparando</option>
                <option value="delivering">Em entrega</option>
                <option value="completed">Concluídos</option>
                <option value="cancelled">Cancelados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Pedidos */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">Nenhum pedido encontrado.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className="font-medium">{getStatusText(order.status)}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Pedido #{order.id.split("_")[1]} • {formatDate(order.createdAt)}
                    </p>
                  </div>

                  {/* Botões de ação para atualizar status */}
                  <div className="flex flex-wrap gap-2">
                    {order.status === "pending" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "preparing")}
                        disabled={isUpdating === order.id}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
                      >
                        <Package size={16} />
                        {isUpdating === order.id ? "Atualizando..." : "Iniciar Preparo"}
                      </button>
                    )}

                    {order.status === "preparing" && order.deliveryType === "delivery" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "delivering")}
                        disabled={isUpdating === order.id}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
                      >
                        <Truck size={16} />
                        {isUpdating === order.id ? "Atualizando..." : "Enviar para Entrega"}
                      </button>
                    )}

                    {(order.status === "preparing" && order.deliveryType === "pickup") ||
                    order.status === "delivering" ? (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "completed")}
                        disabled={isUpdating === order.id}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
                      >
                        <CheckCircle size={16} />
                        {isUpdating === order.id
                          ? "Atualizando..."
                          : order.deliveryType === "pickup"
                            ? "Marcar como Pronto"
                            : "Confirmar Entrega"}
                      </button>
                    ) : null}

                    <Link
                      href={`/admin/pedido/${order.id}`}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm"
                    >
                      Ver Detalhes
                    </Link>
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Informações do Cliente */}
                    <div>
                      <h3 className="font-medium mb-2">Cliente</h3>
                      <p>{order.deliveryInfo.name}</p>
                      <p>{order.deliveryInfo.phone}</p>
                      <p>
                        Tipo: {order.deliveryType === "delivery" ? "Entrega" : "Retirada"} • {order.deliveryInfo.time}
                      </p>
                      {order.deliveryType === "delivery" && order.deliveryInfo.address && (
                        <p className="text-sm mt-1">{order.deliveryInfo.address}</p>
                      )}
                    </div>

                    {/* Resumo do Pedido */}
                    <div>
                      <h3 className="font-medium mb-2">Itens</h3>
                      <ul className="text-sm">
                        {order.items.map((item, index) => (
                          <li key={index} className="mb-1">
                            {item.quantity}x {item.name}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pagamento */}
                    <div>
                      <h3 className="font-medium mb-2">Pagamento</h3>
                      <p>
                        Método:{" "}
                        {order.paymentMethod === "cash"
                          ? "Dinheiro"
                          : order.paymentMethod === "card"
                            ? "Cartão"
                            : "PIX"}
                      </p>
                      <p className="font-bold">Total: R$ {order.total.toFixed(2).replace(".", ",")}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
