import Link from "next/link"
import HeroBanner from "@/components/hero-banner"
import FeaturesSection from "@/components/features-section"
import { menuItems } from "@/data/menu-items"
import MenuItemCard from "@/components/menu-item-card"
import TestimonialCarousel from "@/components/testimonial-carousel"

export default function Home() {
  // Get 3 popular items from different categories
  const popularItems = [
    menuItems.find((item) => item.id === "marmita-1"),
    menuItems.find((item) => item.id === "pizza-1"),
    menuItems.find((item) => item.id === "lanche-2"),
  ].filter(Boolean)

  return (
    <>
      <HeroBanner />

      <FeaturesSection />

      <section className="section-padding">
        <div className="container-custom">
          <h2 className="section-title">Mais Pedidos</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularItems.map((item) => item && <MenuItemCard key={item.id} item={item} />)}
          </div>

          <div className="text-center mt-10">
            <Link href="/cardapio" className="btn-primary">
              Ver Cardápio Completo
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="section-title">O Que Nossos Clientes Dizem</h2>
          <TestimonialCarousel />
        </div>
      </section>

      <section className="section-padding bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Peça Agora Mesmo!</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Estamos prontos para preparar sua refeição favorita e entregar no conforto da sua casa.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/pedido" className="btn-secondary">
              Fazer Pedido
            </Link>
            <a
              href="https://wa.me/5519984213797"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary font-bold py-2 px-4 rounded-lg transition-colors duration-200 hover:bg-gray-100"
            >
              Chamar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
