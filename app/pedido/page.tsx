"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ShoppingBag, MapPin, ArrowRight } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { useOrders } from "@/context/order-context"
import CartItem from "@/components/cart-item"
import PixQRCode from "@/components/pix-qrcode"
import { formatPhoneNumber } from "@/utils/format-helpers"

export default function PedidoPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const { createOrder } = useOrders()

  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    complement: "",
    time: "",
    paymentMethod: "cash",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [showPixQRCode, setShowPixQRCode] = useState(false)
  const [pixCode, setPixCode] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [completedOrder, setCompletedOrder] = useState<{
    items: typeof items
    total: number
  } | null>(null)

  // Preencher os dados do formulário com os dados do usuário logado
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
      }))
    }
  }, [isAuthenticated, user])

  // Gerar código PIX aleatório para simulação
  useEffect(() => {
    if (formData.paymentMethod === "pix") {
      setPixCode(
        `00020126330014BR.GOV.BCB.PIX0111${Math.random().toString().substring(2, 13)}5204000053039865802BR5924SEURESTUARANTE6009SAO PAULO62070503***6304${Math.floor(
          Math.random() * 10000,
        )
          .toString()
          .padStart(4, "0")}`,
      )
    }
  }, [formData.paymentMethod])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "phone") {
      // Permitir apenas números no campo de telefone
      const numericValue = value.replace(/\D/g, "")

      // Limitar a 11 dígitos (DDD + número)
      if (numericValue.length <= 11) {
        // Formatar o número conforme digitado
        const formattedPhone = formatPhoneNumber(numericValue)
        setFormData((prev) => ({ ...prev, [name]: formattedPhone }))

        // Validar se o número está completo
        if (numericValue.length > 0 && numericValue.length < 11) {
          setPhoneError("Telefone deve ter 11 dígitos (com DDD)")
        } else {
          setPhoneError("")
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Mostrar/esconder QR Code do PIX
    if (name === "paymentMethod") {
      setShowPixQRCode(value === "pix")
    }
  }

  // Função para formatar mensagem de WhatsApp
  const formatWhatsAppMessage = () => {
    if (!completedOrder) {
      alert("Erro: Nenhum pedido concluído encontrado.")
      return ""
    }

    const { items, total } = completedOrder

    // Formatar cabeçalho do pedido
    let message = `*NOVO PEDIDO*\n\n`
    message += `*Cliente:* ${formData.name}\n`
    message += `*Telefone:* ${formData.phone}\n`

    // Adicionar endereço se for entrega
    if (deliveryType === "delivery") {
      message += `*Endereço:* ${formData.address}\n`
      if (formData.complement) {
        message += `*Complemento:* ${formData.complement}\n`
      }
    }

    message += `*Tipo:* ${deliveryType === "delivery" ? "Entrega" : "Retirada"}\n`
    message += `*Horário:* ${formData.time}\n`
    message += `*Pagamento:* ${formData.paymentMethod === "cash" ? "Dinheiro" : formData.paymentMethod === "card" ? "Cartão" : "PIX"}\n\n`

    // Adicionar itens do pedido e recalcular o total
    let recalculatedTotal = 0
    message += `*ITENS DO PEDIDO:*\n`
    items.forEach((item) => {
      const itemTotal = item.price * item.quantity
      recalculatedTotal += itemTotal
      message += `• ${item.quantity}x ${item.name} - R$ ${itemTotal.toFixed(2).replace(".", ",")}\n`
      if (item.observations) {
        message += `   _Obs: ${item.observations}_\n`
      }
    })

    // Adicionar total recalculado
    message += `\n*TOTAL: R$ ${recalculatedTotal.toFixed(2).replace(".", ",")}*`

    return encodeURIComponent(message)
  }

  // Função para enviar para WhatsApp
  const sendToWhatsApp = () => {
    const whatsappNumber = "5519984213797" // Número do WhatsApp da loja
    const message = formatWhatsAppMessage()
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

    // Abrir WhatsApp em uma nova aba
    window.open(whatsappUrl, "_blank")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      alert("Seu carrinho está vazio. Adicione itens antes de finalizar o pedido.")
      return
    }

    // Validar telefone
    const numericPhone = formData.phone.replace(/\D/g, "")
    if (numericPhone.length !== 11) {
      setPhoneError("Telefone deve ter 11 dígitos (com DDD)")
      return
    }

    // Se for pagamento PIX, verificar se o usuário "pagou"
    if (formData.paymentMethod === "pix" && !window.confirm("Confirma que o pagamento via PIX foi realizado?")) {
      return
    }

    setIsSubmitting(true)

    try {
      // Criar o pedido
      const newOrderId = await createOrder({
        userId: user?.id || "guest",
        items,
        total,
        deliveryType,
        deliveryInfo: {
          name: formData.name,
          phone: formData.phone,
          address: deliveryType === "delivery" ? formData.address : "",
          complement: formData.complement,
          time: formData.time,
        },
        paymentMethod: formData.paymentMethod,
      })

      // Salvar os dados do pedido concluído
      setCompletedOrder({
        items: [...items], // Copiar os itens do carrinho
        total, // Salvar o total
      })
      setOrderId(newOrderId)
      setOrderComplete(true)
      clearCart()

      // Não enviar automaticamente para WhatsApp - o usuário usará o botão
    } catch (error) {
      console.error("Erro ao criar pedido:", error)
      alert("Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderComplete) {
    return (
      <div className="section-padding">
        <div className="container-custom max-w-2xl mx-auto text-center">
          <div className="bg-green-100 text-green-800 p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-bold mb-4">Pedido Confirmado!</h2>
            <p className="mb-2">Obrigado por seu pedido, {formData.name}.</p>
            <p className="mb-4">Seu pedido foi registrado com sucesso.</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <button
                onClick={sendToWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                Enviar pedido no WhatsApp
              </button>

              {orderId && isAuthenticated && (
                <Link href={`/acompanhar/${orderId}`} className="btn-primary inline-flex items-center justify-center">
                  Acompanhar Pedido
                </Link>
              )}
            </div>
          </div>

          <p className="mb-6">
            {isAuthenticated
              ? "Você pode acompanhar o status do seu pedido na página 'Meus Pedidos'."
              : "Crie uma conta para acompanhar seus pedidos futuros mais facilmente."}
          </p>

          <Link href="/" className="btn-primary">
            Voltar para o Início
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="section-padding">
      <div className="container-custom">
        <h1 className="section-title">Finalizar Pedido</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Carrinho */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <ShoppingBag className="mr-2 w-5 h-5" /> Seu Carrinho
              </h2>

              {items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
                  <Link href="/cardapio" className="btn-primary">
                    Ver Cardápio
                  </Link>
                </div>
              ) : (
                <>
                  <div className="divide-y">
                    {items.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>R$ {total.toFixed(2).replace(".", ",")}</span>
                    </div>
                  </div>
                </>
              )}

              {/* QR Code PIX */}
              {showPixQRCode && items.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <PixQRCode value={pixCode} amount={total} merchantName="Seu Restaurante" />
                </div>
              )}
            </div>
          </div>

          {/* Formulário */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <MapPin className="mr-2 w-5 h-5" /> Dados de Entrega
              </h2>

              {!isAuthenticated && (
                <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-md">
                  <p className="text-sm">
                    <Link href="/login" className="font-bold hover:underline">
                      Faça login
                    </Link>{" "}
                    ou{" "}
                    <Link href="/registro" className="font-bold hover:underline">
                      crie uma conta
                    </Link>{" "}
                    para acompanhar seus pedidos e ter um histórico completo.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Tipo de Entrega</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="delivery"
                        checked={deliveryType === "delivery"}
                        onChange={() => setDeliveryType("delivery")}
                        className="mr-2"
                      />
                      Entrega
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="pickup"
                        checked={deliveryType === "pickup"}
                        onChange={() => setDeliveryType("pickup")}
                        className="mr-2"
                      />
                      Retirada
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="(xx) xxxxx-xxxx"
                    className={`w-full p-2 border rounded-md ${phoneError ? "border-red-500" : ""}`}
                  />
                  {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                </div>

                {deliveryType === "delivery" && (
                  <>
                    <div className="mb-4">
                      <label htmlFor="address" className="block text-sm font-medium mb-1">
                        Endereço
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="complement" className="block text-sm font-medium mb-1">
                        Complemento
                      </label>
                      <input
                        type="text"
                        id="complement"
                        name="complement"
                        value={formData.complement}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </>
                )}

                <div className="mb-4">
                  <label htmlFor="time" className="block text-sm font-medium mb-1">
                    {deliveryType === "delivery" ? "Horário de Entrega" : "Horário de Retirada"}
                  </label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Selecione um horário</option>
                    <option value="assim-que-possivel">Assim que possível</option>
                    <option value="11:30">11:30</option>
                    <option value="12:00">12:00</option>
                    <option value="12:30">12:30</option>
                    <option value="13:00">13:00</option>
                    <option value="18:30">18:30</option>
                    <option value="19:00">19:00</option>
                    <option value="19:30">19:30</option>
                    <option value="20:00">20:00</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="paymentMethod" className="block text-sm font-medium mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="cash">Dinheiro na Entrega</option>
                    <option value="card">Cartão na Entrega</option>
                    <option value="pix">PIX</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full flex items-center justify-center"
                  disabled={isSubmitting || items.length === 0}
                >
                  {isSubmitting ? (
                    "Processando..."
                  ) : (
                    <>
                      Confirmar Pedido <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
