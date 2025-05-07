import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  // Substitua os dados abaixo pelo desejado
  const adminEmail = "admin@restaurante.com"
  const adminPassword = "admin123"
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  // Opcional: acrescente o campo role ou similar se usar controle de role
  const user = await prisma.customer.create({
    data: {
      name: "Administrador",
      email: adminEmail,
      status: true,
      password: hashedPassword,
      phone: "+5500000000000",
      // role: "admin" <-- Adicione aqui SE existir este campo no schema/model!
    },
  })

  console.log("Usuário admin criado:", user)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())