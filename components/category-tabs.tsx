"use client"
import { categories } from "@/data/menu-items"

interface CategoryTabsProps {
  activeCategory: string
  onSelectCategory: (category: string) => void
}

export default function CategoryTabs({ activeCategory, onSelectCategory }: CategoryTabsProps) {
  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex space-x-2 min-w-max pb-2">
        <button
          onClick={() => onSelectCategory("Todos")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ease-in-out ${
            activeCategory === "Todos"
              ? "bg-primary text-white shadow-md transform scale-105"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Todos
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ease-in-out ${
              activeCategory === category
                ? "bg-primary text-white shadow-md transform scale-105"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
