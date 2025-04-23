"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Copy, Check } from "lucide-react"

interface PixQRCodeProps {
  value: string
  amount: number
  merchantName: string
}

export default function PixQRCode({ value, amount, merchantName }: PixQRCodeProps) {
  const [copied, setCopied] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState("")

  // Gerar URL do QR Code
  useEffect(() => {
    // Criar um texto para o QR Code que simula um PIX
    // Em um ambiente real, você usaria uma API de pagamento para gerar o código PIX
    const pixText = value

    // Usar a API do QR Server para gerar o QR Code
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixText)}`
    setQrCodeUrl(qrUrl)
  }, [value])

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <h3 className="text-lg font-bold mb-4">Pagamento via PIX</h3>
      <p className="mb-4">
        Escaneie o QR Code abaixo ou copie o código PIX para realizar o pagamento de{" "}
        <span className="font-bold">R$ {amount.toFixed(2).replace(".", ",")}</span>
      </p>

      <div className="flex justify-center mb-6">
        <div className="border-2 border-gray-200 p-2 rounded-lg">
          {qrCodeUrl ? (
            <Image
              src={qrCodeUrl || "/placeholder.svg"}
              alt="QR Code PIX"
              width={200}
              height={200}
              className="mx-auto"
            />
          ) : (
            <div className="w-[200px] h-[200px] bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500">Carregando QR Code...</p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Código PIX (Copia e Cola)</p>
        <div className="flex items-center border rounded-md overflow-hidden">
          <div className="bg-gray-100 p-2 flex-1 text-sm truncate">{value}</div>
          <button
            onClick={handleCopy}
            className="bg-primary text-white p-2 hover:bg-primary-dark transition-colors"
            aria-label="Copiar código PIX"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p>1. Abra o aplicativo do seu banco</p>
        <p>2. Escolha pagar via PIX com QR Code ou Copia e Cola</p>
        <p>3. Escaneie o QR Code ou cole o código</p>
        <p>4. Confirme o pagamento</p>
      </div>
    </div>
  )
}
