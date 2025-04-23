"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Menu, X, ShoppingCart, User, LogOut, Settings } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const { items } = useCart()
  const { user, logout, isAuthenticated } = useAuth()
  const cartIconRef = useRef<HTMLDivElement>(null)

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen)
  const closeMenus = () => {
    setIsMenuOpen(false)
    setIsProfileMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              SR
            </div>
            <span className="text-xl font-bold text-primary">Seu Restaurante</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="font-medium hover:text-primary transition-colors">
              Início
            </Link>
            <Link href="/cardapio" className="font-medium hover:text-primary transition-colors">
              Cardápio
            </Link>
            <Link href="/pedido" className="font-medium hover:text-primary transition-colors">
              Pedido
            </Link>
            <Link href="/sobre" className="font-medium hover:text-primary transition-colors">
              Sobre
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-1 hover:text-primary transition-colors"
                  aria-expanded={isProfileMenuOpen}
                  aria-haspopup="true"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">{user?.name.split(" ")[0]}</span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/minha-conta"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={closeMenus}
                    >
                      Minha Conta
                    </Link>
                    <Link
                      href="/meus-pedidos"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={closeMenus}
                    >
                      Meus Pedidos
                    </Link>
                    {user?.role === "admin" && (
                      <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={closeMenus}>
                        <div className="flex items-center">
                          <Settings className="w-4 h-4 mr-2" />
                          Painel Admin
                        </div>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout()
                        closeMenus()
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="flex items-center hover:text-primary transition-colors">
                <User className="w-5 h-5 mr-1" />
                <span className="hidden sm:inline">Entrar</span>
              </Link>
            )}

            <Link href="/pedido" className="relative">
              <div ref={cartIconRef} className="cart-icon relative inline-block">
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={toggleMenu} aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-2">
            <ul className="flex flex-col space-y-4">
              <li>
                <Link href="/" className="block font-medium hover:text-primary transition-colors" onClick={closeMenus}>
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/cardapio"
                  className="block font-medium hover:text-primary transition-colors"
                  onClick={closeMenus}
                >
                  Cardápio
                </Link>
              </li>
              <li>
                <Link
                  href="/pedido"
                  className="block font-medium hover:text-primary transition-colors"
                  onClick={closeMenus}
                >
                  Pedido
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre"
                  className="block font-medium hover:text-primary transition-colors"
                  onClick={closeMenus}
                >
                  Sobre
                </Link>
              </li>
              {!isAuthenticated && (
                <li>
                  <Link
                    href="/login"
                    className="block font-medium hover:text-primary transition-colors"
                    onClick={closeMenus}
                  >
                    Entrar / Registrar
                  </Link>
                </li>
              )}
              {isAuthenticated && (
                <>
                  <li>
                    <Link
                      href="/minha-conta"
                      className="block font-medium hover:text-primary transition-colors"
                      onClick={closeMenus}
                    >
                      Minha Conta
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/meus-pedidos"
                      className="block font-medium hover:text-primary transition-colors"
                      onClick={closeMenus}
                    >
                      Meus Pedidos
                    </Link>
                  </li>
                  {user?.role === "admin" && (
                    <li>
                      <Link
                        href="/admin"
                        className="block font-medium hover:text-primary transition-colors"
                        onClick={closeMenus}
                      >
                        Painel Admin
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={() => {
                        logout()
                        closeMenus()
                      }}
                      className="block font-medium text-red-600 hover:text-red-800 transition-colors"
                    >
                      Sair
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
