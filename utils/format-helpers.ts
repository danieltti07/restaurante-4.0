/**
 * Formata um número de telefone para o padrão brasileiro (xx) xxxxx-xxxx
 * @param phone Número de telefone (apenas dígitos)
 * @returns Número formatado
 */
export function formatPhoneNumber(phone: string): string {
  // Remove todos os caracteres não numéricos
  const numericPhone = phone.replace(/\D/g, "")

  // Aplica a formatação conforme o número de dígitos
  if (numericPhone.length <= 2) {
    return numericPhone.length ? `(${numericPhone}` : ""
  } else if (numericPhone.length <= 7) {
    return `(${numericPhone.slice(0, 2)}) ${numericPhone.slice(2)}`
  } else {
    return `(${numericPhone.slice(0, 2)}) ${numericPhone.slice(2, 7)}-${numericPhone.slice(7, 11)}`
  }
}

/**
 * Verifica se um número de telefone está completo (11 dígitos)
 * @param phone Número de telefone (pode conter formatação)
 * @returns true se o telefone estiver completo
 */
export function isPhoneComplete(phone: string): boolean {
  const numericPhone = phone.replace(/\D/g, "")
  return numericPhone.length === 11
}
