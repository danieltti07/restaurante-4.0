"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  role: string  // Role is now required
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        if (parsed && typeof parsed.role === "string") {
          setUser(parsed)
        } else {
          setUser(null)
          localStorage.removeItem("user")
        }
      } catch {
        setUser(null)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  // Definindo a URL do backend que pode ser configurada com uma variável de ambiente
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://restaurante-4-0.onrender.com"; // Usando a URL do Render ou localhost em desenvolvimento

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error("Erro de login:", errorData)
        return false
      }

      const data = await res.json()
      
      // Ensure role is present
      if (!data.role) {
        // Default fallback
        data.role = "user"
      }
      
      setUser(data)
      localStorage.setItem("user", JSON.stringify(data))

      return true
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<boolean> => {
    setIsLoading(true)

    try {
      const res = await fetch(`${API_URL}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, phone }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error("Erro de registro:", errorData)
        return false
      }

      const data = await res.json()

      // Use role from backend or default to "user"
      const userData: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        role: data.role ?? "user"
      }

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))

      return true
    } catch (error) {
      console.error("Erro ao registrar:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
