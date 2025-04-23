import type React from "react"
import { Truck, Clock, Award, ThumbsUp } from "lucide-react"

interface FeatureProps {
  icon: React.ReactNode
  title: string
  description: string
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

export default function FeaturesSection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <h2 className="section-title">Nossos Diferenciais</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Feature
            icon={<Truck className="w-10 h-10" />}
            title="Entrega Rápida"
            description="Entregamos seu pedido em até 30 minutos ou a próxima entrega é por nossa conta."
          />
          <Feature
            icon={<Award className="w-10 h-10" />}
            title="Ingredientes Frescos"
            description="Utilizamos apenas ingredientes frescos e de alta qualidade em todas as nossas preparações."
          />
          <Feature
            icon={<Clock className="w-10 h-10" />}
            title="Horário Estendido"
            description="Funcionamos todos os dias, inclusive feriados, para atender você quando precisar."
          />
          <Feature
            icon={<ThumbsUp className="w-10 h-10" />}
            title="Satisfação Garantida"
            description="Se você não ficar satisfeito com seu pedido, nós substituímos ou devolvemos seu dinheiro."
          />
        </div>
      </div>
    </section>
  )
}
