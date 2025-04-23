"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { formatPhoneNumber } from "@/utils/format-helpers"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { register, isAuthenticated } = useAuth()

  // Redirecionar se já estiver autenticado
  if (isAuthenticated) {
    router.push("/minha-conta")
    return null
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Permitir apenas números no campo de telefone
    const numericValue = value.replace(/\D/g, "")

    // Limitar a 11 dígitos (DDD + número)
    if (numericValue.length <= 11) {
      // Formatar o número conforme digitado
      const formattedPhone = formatPhoneNumber(numericValue)
      setPhone(formattedPhone)

      // Validar se o número está completo
      if (numericValue.length > 0 && numericValue.length < 11) {
        setPhoneError("Telefone deve ter 11 dígitos (com DDD)")
      } else {
        setPhoneError("")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validações
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.")
      return
    }

    // Validar telefone
    const numericPhone = phone.replace(/\D/g, "")
    if (numericPhone.length !== 11) {
      setPhoneError("Telefone deve ter 11 dígitos (com DDD)")
      return
    }

    setIsLoading(true)

    try {
      const success = await register(name, email, password, phone)
      if (success) {
        router.push("/minha-conta")
      } else {
        setError("Este email já está em uso. Por favor, tente outro ou faça login.")
      }
    } catch (err) {
      setError("Ocorreu um erro ao criar sua conta. Por favor, tente novamente.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="section-padding bg-gray-50">
      <div className="container-custom max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Criar Conta</h1>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nome Completo
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 border rounded-md"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border rounded-md"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Telefone
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                className={`w-full p-2 border rounded-md ${phoneError ? "border-red-500" : ""}`}
                placeholder="(xx) xxxxx-xxxx"
              />
              {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border rounded-md"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-2 border rounded-md"
                placeholder="Digite a senha novamente"
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full flex justify-center items-center">
              {isLoading ? "Criando conta..." : "Criar Conta"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p>
              Já tem uma conta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
