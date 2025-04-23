import Link from "next/link"
import { PhoneIcon as WhatsApp } from "lucide-react"

export default function HeroBanner() {
  return (
    <div className="relative bg-gray-900 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: "url('/placeholder.svg?height=600&width=1200')" }}
      />

      <div className="container-custom relative z-10 py-20 md:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Peça sua refeição favorita agora</h1>
          <p className="text-lg md:text-xl mb-8">
            Deliciosas opções preparadas com ingredientes frescos e entregues rapidamente na sua casa.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/cardapio" className="btn-primary">
              Ver Cardápio
            </Link>
            <Link href="/pedido" className="btn-secondary">
              Fazer Pedido
            </Link>
            <a
              href="https://wa.me/5519984213797"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
            >
              <WhatsApp className="w-5 h-5 mr-2" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
