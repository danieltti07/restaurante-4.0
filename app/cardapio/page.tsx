"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getAllItems, getItemsByCategory } from "@/data/menu-items"
import MenuItemCard from "@/components/menu-item-card"
import CategoryTabs from "@/components/category-tabs"

export default function CardapioPage() {
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [displayedItems, setDisplayedItems] = useState(getAllItems())

  // Usar useEffect para adicionar uma transição suave quando os itens mudam
  useEffect(() => {
    setDisplayedItems(activeCategory === "Todos" ? getAllItems() : getItemsByCategory(activeCategory))
  }, [activeCategory])

  return (
    <div className="section-padding">
      <div className="container-custom">
        <h1 className="section-title">Nosso Cardápio</h1>

        <CategoryTabs activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {displayedItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <MenuItemCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
