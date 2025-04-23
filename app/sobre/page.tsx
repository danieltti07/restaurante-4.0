import Image from "next/image"
import { MapPin, Phone, Mail, Clock, Facebook, Instagram } from "lucide-react"

export default function SobrePage() {
  return (
    <div className="section-padding">
      <div className="container-custom">
        <h1 className="section-title">Sobre Nós</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Nossa História</h2>
            <p className="mb-4">
              Fundado em 2010, o Seu Restaurante nasceu da paixão pela gastronomia e do desejo de oferecer refeições de
              qualidade para todos os gostos. Começamos como um pequeno negócio familiar e hoje somos referência na
              cidade.
            </p>
            <p className="mb-4">
              Nossa missão é proporcionar uma experiência gastronômica excepcional, com pratos preparados com
              ingredientes frescos e de alta qualidade, entregues com rapidez e excelência no atendimento.
            </p>
            <p>
              Valorizamos a satisfação dos nossos clientes acima de tudo e trabalhamos constantemente para superar suas
              expectativas, seja através do sabor dos nossos pratos, da agilidade na entrega ou do atendimento
              personalizado.
            </p>
          </div>

          <div className="relative h-80 lg:h-auto rounded-lg overflow-hidden">
            <Image src="/placeholder.svg?height=400&width=600" alt="Nosso Restaurante" fill className="object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="order-2 lg:order-1">
            <div className="h-80 lg:h-full w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.1775656636577!2d-46.6522202!3d-23.5646162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzUyLjUiUyA0NsKwMzknMDguMCJX!5e0!3m2!1spt-BR!2sbr!4v1619541534707!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Localização do Restaurante"
              ></iframe>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-2xl font-bold mb-6">Informações</h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-primary mr-3 mt-0.5" />
                <div>
                  <h3 className="font-bold">Endereço</h3>
                  <p>Rua São Paulo 55, Jardim De Faveri</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="w-6 h-6 text-primary mr-3 mt-0.5" />
                <div>
                  <h3 className="font-bold">Telefone</h3>
                  <p>(19) 98421-3797</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="w-6 h-6 text-primary mr-3 mt-0.5" />
                <div>
                  <h3 className="font-bold">E-mail</h3>
                  <p>danieltutui2018@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="w-6 h-6 text-primary mr-3 mt-0.5" />
                <div>
                  <h3 className="font-bold">Horário de Funcionamento</h3>
                  <p>Segunda a Sexta: 10h às 22h</p>
                  <p>Sábado e Domingo: 10h às 23h</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-bold mb-4">Redes Sociais</h3>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 p-3 rounded-full hover:bg-primary hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="https://www.instagram.com/duodesignoficial?igsh=MWwwODI1aHR6ZXZqYw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 p-3 rounded-full hover:bg-primary hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="https://wa.me/5519984213797"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block"
              >
                Fale Conosco pelo WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
