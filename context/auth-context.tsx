"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  role?: string
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

  // Verificar se o usuário está logado ao carregar a página
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    // Criar usuário admin se não existir
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const adminExists = users.some((u: any) => u.email === "admin@restaurante.com")

    if (!adminExists) {
      const adminUser = {
        id: "user_admin",
        name: "Administrador",
        email: "admin@restaurante.com",
        password: "admin123",
        role: "admin",
        createdAt: new Date().toISOString(),
      }

      users.push(adminUser)
      localStorage.setItem("users", JSON.stringify(users))
    }

    setIsLoading(false)
  }, [])

  // Simular login (em um app real, isso seria uma chamada de API)
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      // Verificar se o usuário existe no localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const foundUser = users.find((u: any) => u.email === email)

      if (foundUser && foundUser.password === password) {
        // Remover a senha antes de armazenar no estado
        const { password: _, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        localStorage.setItem("user", JSON.stringify(userWithoutPassword))
        return true
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Simular registro (em um app real, isso seria uma chamada de API)
  const register = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    setIsLoading(true)

    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      // Verificar se o email já está em uso
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      if (users.some((u: any) => u.email === email)) {
        return false
      }

      // Criar novo usuário
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        password,
        phone,
        role: "customer", // Papel padrão para novos usuários
        createdAt: new Date().toISOString(),
      }

      // Salvar no "banco de dados" (localStorage)
      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      // Fazer login automático
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))

      return true
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
