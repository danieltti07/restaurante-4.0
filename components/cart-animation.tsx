"use client"

import { createContext, useContext, useState, useRef, type ReactNode } from "react"
import { ShoppingCart } from "lucide-react"

interface CartAnimationContextType {
  animateToCart: (startX: number, startY: number, productId: string) => void
}

const CartAnimationContext = createContext<CartAnimationContextType | undefined>(undefined)

export function CartAnimationProvider({ children }: { children: ReactNode }) {
  const [animations, setAnimations] = useState<{ id: string; startX: number; startY: number; productId: string }[]>([])
  const cartIconRef = useRef<HTMLDivElement | null>(null)

  // Função para obter a posição atual do ícone do carrinho
  const getCartPosition = () => {
    const cartIcon = document.querySelector(".cart-icon") as HTMLElement
    if (cartIcon) {
      const rect = cartIcon.getBoundingClientRect()
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      }
    }
    return { x: window.innerWidth - 50, y: 30 } // Fallback
  }

  const animateToCart = (startX: number, startY: number, productId: string) => {
    // Adicionar nova animação
    const newAnimation = {
      id: `anim_${Date.now()}`,
      startX,
      startY,
      productId,
    }

    setAnimations((prev) => [...prev, newAnimation])

    // Fazer o ícone do carrinho pulsar quando o item chegar
    setTimeout(() => {
      const cartIcon = document.querySelector(".cart-icon") as HTMLElement
      if (cartIcon) {
        cartIcon.classList.add("cart-pulse")
        setTimeout(() => {
          cartIcon.classList.remove("cart-pulse")
        }, 500)
      }
    }, 600)

    // Remover a animação após completar
    setTimeout(() => {
      setAnimations((prev) => prev.filter((anim) => anim.id !== newAnimation.id))
    }, 1000)
  }

  return (
    <CartAnimationContext.Provider value={{ animateToCart }}>
      {children}

      {/* Animações de itens voando para o carrinho */}
      {animations.map((anim) => {
        const cartPos = getCartPosition()

        return (
          <div
            key={anim.id}
            className="flying-cart-item fixed z-50 pointer-events-none"
            style={{
              left: `${anim.startX - 15}px`,
              top: `${anim.startY - 15}px`,
              animation: `flyToCart 0.6s forwards cubic-bezier(0.165, 0.84, 0.44, 1)`,
            }}
            data-cart-x={cartPos.x}
            data-cart-y={cartPos.y}
          >
            <div className="bg-primary text-white p-2 rounded-full shadow-lg">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>
        )
      })}

      {/* Estilos para a animação */}
      <style jsx global>{`
        @keyframes flyToCart {
          0% {
            transform: scale(1) translate(0, 0);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: scale(0.5) translate(
              calc((var(--cart-x) - var(--start-x)) / 0.5),
              calc((var(--cart-y) - var(--start-y)) / 0.5)
            );
            opacity: 0;
          }
        }

        .flying-cart-item {
          --start-x: 0px;
          --start-y: 0px;
          --cart-x: 0px;
          --cart-y: 0px;
        }

        .flying-cart-item::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        @keyframes cartPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }

        .cart-pulse {
          animation: cartPulse 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>

      {/* Script para atualizar as variáveis CSS para a animação */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              function updateFlyingItems() {
                document.querySelectorAll('.flying-cart-item').forEach(item => {
                  const startX = parseFloat(item.style.left) + 15;
                  const startY = parseFloat(item.style.top) + 15;
                  const cartX = parseFloat(item.getAttribute('data-cart-x'));
                  const cartY = parseFloat(item.getAttribute('data-cart-y'));
                  
                  item.style.setProperty('--start-x', startX + 'px');
                  item.style.setProperty('--start-y', startY + 'px');
                  item.style.setProperty('--cart-x', cartX + 'px');
                  item.style.setProperty('--cart-y', cartY + 'px');
                });
              }
              
              // Executar imediatamente e depois a cada 100ms
              updateFlyingItems();
              setInterval(updateFlyingItems, 100);
            });
          `,
        }}
      />
    </CartAnimationContext.Provider>
  )
}

export function useCartAnimation() {
  const context = useContext(CartAnimationContext)
  if (context === undefined) {
    throw new Error("useCartAnimation must be used within a CartAnimationProvider")
  }
  return context
}
