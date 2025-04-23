"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { formatPhoneNumber } from "@/utils/format-helpers"

export default function MyAccountPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [message, setMessage] = useState({ type: "", text: "" })
  const [isSaving, setIsSaving] = useState(false)
  const [phoneError, setPhoneError] = useState("")

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    } else if (user) {
      // Preencher os campos com os dados do usuário
      setName(user.name || "")
      setEmail(user.email || "")
      setPhone(user.phone || "")
      setAddress(user.address || "")
    }
  }, [isLoading, isAuthenticated, user, router])

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

    // Validar telefone
    const numericPhone = phone.replace(/\D/g, "")
    if (numericPhone.length > 0 && numericPhone.length !== 11) {
      setPhoneError("Telefone deve ter 11 dígitos (com DDD)")
      return
    }

    setIsSaving(true)
    setMessage({ type: "", text: "" })

    try {
      // Simular atualização de dados (em um app real, isso seria uma chamada de API)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Atualizar dados no localStorage
      if (user) {
        const updatedUser = {
          ...user,
          name,
          phone,
          address,
        }

        // Atualizar no localStorage (simulando banco de dados)
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const updatedUsers = users.map((u: any) => (u.id === user.id ? { ...u, ...updatedUser } : u))
        localStorage.setItem("users", JSON.stringify(updatedUsers))
        localStorage.setItem("user", JSON.stringify(updatedUser))

        setMessage({
          type: "success",
          text: "Dados atualizados com sucesso!",
        })
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: "Ocorreu um erro ao atualizar seus dados. Por favor, tente novamente.",
      })
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="section-padding">
        <div className="container-custom max-w-md mx-auto text-center">
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="section-padding bg-gray-50">
      <div className="container-custom max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Minha Conta</h1>

          {message.text && (
            <div
              className={`${
                message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              } p-3 rounded-md mb-4`}
            >
              {message.text}
            </div>
          )}

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
                disabled
                className="w-full p-2 border rounded-md bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado.</p>
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
              <label htmlFor="address" className="block text-sm font-medium mb-1">
                Endereço Padrão
              </label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Seu endereço completo"
              />
            </div>

            <button type="submit" disabled={isSaving} className="btn-primary w-full flex justify-center items-center">
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
