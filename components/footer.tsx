import Link from "next/link"
import { Facebook, Instagram, MapPin, Phone, Mail, Clock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Seu Restaurante</h3>
            <p className="mb-4">
              Deliciosas refeições para todos os gostos. Entregamos qualidade e sabor diretamente para você.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="w-6 h-6 hover:text-primary transition-colors" />
              </a>
              <a
                href="https://www.instagram.com/duodesignoficial?igsh=MWwwODI1aHR6ZXZqYw=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6 hover:text-primary transition-colors" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/cardapio" className="hover:text-primary transition-colors">
                  Cardápio
                </Link>
              </li>
              <li>
                <Link href="/pedido" className="hover:text-primary transition-colors">
                  Pedido
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-primary transition-colors">
                  Sobre
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-0.5 text-primary" />
                <span>Rua São Paulo 55, Jardim De Faveri </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-primary" />
                <span>(19) 98421-3797 </span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-primary" />
                <span>danieltutui2018@gmail.com</span>
              </li>
              <li className="flex items-start">
                <Clock className="w-5 h-5 mr-2 mt-0.5 text-primary" />
                <span>
                  Seg-Sex: 10h às 22h
                  <br />
                  Sáb-Dom: 10h às 23h
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Seu Restaurante. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
