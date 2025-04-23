import type { MenuItem } from "@/context/cart-context"

export const menuItems: MenuItem[] = [
  // Marmitas
  {
    id: "marmita-1",
    name: "Marmita Tradicional",
    description: "Arroz, feijão, bife acebolado, salada e batata frita.",
    price: 18.9,
    image: "/placeholder.svg?height=200&width=300&text=Marmita%20Tradicional",
    category: "Marmitas",
  },
  {
    id: "marmita-2",
    name: "Marmita Fitness",
    description: "Arroz integral, feijão, frango grelhado, legumes e salada.",
    price: 21.9,
    image: "/placeholder.svg?height=200&width=300&text=Marmita%20Fitness",
    category: "Marmitas",
  },
  {
    id: "marmita-3",
    name: "Marmita Executiva",
    description: "Arroz, feijão, filé mignon, purê de batata, legumes e salada.",
    price: 25.9,
    image: "/placeholder.svg?height=200&width=300&text=Marmita%20Executiva",
    category: "Marmitas",
  },

  // Pizzas
  {
    id: "pizza-1",
    name: "Pizza Margherita",
    description: "Molho de tomate, mussarela, tomate e manjericão.",
    price: 39.9,
    image: "/placeholder.svg?height=200&width=300&text=Pizza%20Margherita",
    category: "Pizzas",
  },
  {
    id: "pizza-2",
    name: "Pizza Calabresa",
    description: "Molho de tomate, mussarela e calabresa.",
    price: 42.9,
    image: "/placeholder.svg?height=200&width=300&text=Pizza%20Calabresa",
    category: "Pizzas",
  },
  {
    id: "pizza-3",
    name: "Pizza Quatro Queijos",
    description: "Molho de tomate, mussarela, provolone, gorgonzola e parmesão.",
    price: 45.9,
    image: "/placeholder.svg?height=200&width=300&text=Pizza%20Quatro%20Queijos",
    category: "Pizzas",
  },

  // Lanches
  {
    id: "lanche-1",
    name: "Hambúrguer Clássico",
    description: "Pão, hambúrguer, queijo, alface, tomate e maionese.",
    price: 22.9,
    image: "/placeholder.svg?height=200&width=300&text=Hambúrguer%20Clássico",
    category: "Lanches",
  },
  {
    id: "lanche-2",
    name: "Hambúrguer Especial",
    description: "Pão, hambúrguer, queijo cheddar, bacon, cebola caramelizada e molho especial.",
    price: 28.9,
    image: "/placeholder.svg?height=200&width=300&text=Hambúrguer%20Especial",
    category: "Lanches",
  },
  {
    id: "lanche-3",
    name: "Hambúrguer Vegetariano",
    description: "Pão, hambúrguer de grão-de-bico, queijo, alface, tomate e maionese vegana.",
    price: 24.9,
    image: "/placeholder.svg?height=200&width=300&text=Hambúrguer%20Vegetariano",
    category: "Lanches",
  },

  // Pratos Executivos
  {
    id: "prato-1",
    name: "Filé à Parmegiana",
    description: "Filé empanado, molho de tomate, queijo, arroz e batata frita.",
    price: 32.9,
    image: "/placeholder.svg?height=200&width=300&text=Filé%20à%20Parmegiana",
    category: "Pratos Executivos",
  },
  {
    id: "prato-2",
    name: "Salmão Grelhado",
    description: "Salmão grelhado, arroz, legumes e molho de ervas.",
    price: 38.9,
    image: "/placeholder.svg?height=200&width=300&text=Salmão%20Grelhado",
    category: "Pratos Executivos",
  },
  {
    id: "prato-3",
    name: "Feijoada Completa",
    description: "Feijoada, arroz, couve, farofa, laranja e torresmo.",
    price: 35.9,
    image: "/placeholder.svg?height=200&width=300&text=Feijoada%20Completa",
    category: "Pratos Executivos",
  },

  // Bebidas
  {
    id: "bebida-1",
    name: "Refrigerante",
    description: "Lata 350ml (Coca-Cola, Guaraná, Sprite, Fanta).",
    price: 5.9,
    image: "/placeholder.svg?height=200&width=300&text=Refrigerante",
    category: "Bebidas",
  },
  {
    id: "bebida-2",
    name: "Suco Natural",
    description: "Copo 500ml (Laranja, Limão, Abacaxi, Maracujá).",
    price: 8.9,
    image: "/placeholder.svg?height=200&width=300&text=Suco%20Natural",
    category: "Bebidas",
  },
  {
    id: "bebida-3",
    name: "Água Mineral",
    description: "Garrafa 500ml (com ou sem gás).",
    price: 3.9,
    image: "/placeholder.svg?height=200&width=300&text=Água%20Mineral",
    category: "Bebidas",
  },
]

export const categories = ["Marmitas", "Pizzas", "Lanches", "Pratos Executivos", "Bebidas"]

export function getItemsByCategory(category: string): MenuItem[] {
  return menuItems.filter((item) => item.category === category)
}

export function getAllItems(): MenuItem[] {
  return menuItems
}

export function getItemById(id: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === id)
}
