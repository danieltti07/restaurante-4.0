// Arrays de frases para gerar comentários aleatórios
const subjects = [
  "A comida",
  "O atendimento",
  "A entrega",
  "A pizza",
  "O hambúrguer",
  "A marmita",
  "O prato executivo",
  "O cardápio",
  "A experiência",
  "O delivery",
  "O sabor",
  "A qualidade",
]

const positiveAdjectives = [
  "incrível",
  "excelente",
  "fantástico",
  "maravilhoso",
  "excepcional",
  "sensacional",
  "espetacular",
  "surpreendente",
  "extraordinário",
  "impressionante",
  "delicioso",
  "perfeito",
]

const compliments = [
  "Sempre peço e nunca me decepciono.",
  "Recomendo para todos os meus amigos.",
  "Melhor da cidade, sem dúvidas!",
  "Vale cada centavo.",
  "Virou meu restaurante favorito.",
  "Não consigo pedir de outro lugar.",
  "Superou todas as minhas expectativas.",
  "Ingredientes sempre frescos e de qualidade.",
  "Entrega sempre no prazo prometido.",
  "Embalagem mantém a comida quentinha até a entrega.",
  "Porções generosas e preço justo.",
  "Atendimento rápido e eficiente.",
]

const foodSpecificComments = [
  "A massa da pizza tem o ponto perfeito.",
  "O hambúrguer é suculento e os ingredientes são de primeira.",
  "As marmitas são completas e muito saborosas.",
  "Os pratos executivos têm uma apresentação impecável.",
  "As sobremesas são divinas.",
  "As opções vegetarianas são deliciosas.",
  "O tempero é único e especial.",
  "Cada mordida é uma explosão de sabor.",
  "O molho especial faz toda a diferença.",
  "A combinação de ingredientes é perfeita.",
  "Tudo é preparado com muito carinho.",
  "Dá para sentir a dedicação em cada prato.",
]

// Nomes com gênero para combinar com os avatares
const names = [
  { name: "Maria Silva", gender: "female" },
  { name: "João Santos", gender: "male" },
  { name: "Ana Oliveira", gender: "female" },
  { name: "Carlos Mendes", gender: "male" },
  { name: "Fernanda Lima", gender: "female" },
  { name: "Pedro Costa", gender: "male" },
  { name: "Juliana Alves", gender: "female" },
  { name: "Roberto Ferreira", gender: "male" },
  { name: "Camila Souza", gender: "female" },
  { name: "Marcelo Gomes", gender: "male" },
  { name: "Luciana Pereira", gender: "female" },
  { name: "Ricardo Martins", gender: "male" },
  { name: "Patrícia Rocha", gender: "female" },
  { name: "Fernando Almeida", gender: "male" },
  { name: "Cristina Barbosa", gender: "female" },
  { name: "Rodrigo Cardoso", gender: "male" },
  { name: "Mariana Ribeiro", gender: "female" },
  { name: "Gabriel Moreira", gender: "male" },
  { name: "Daniela Castro", gender: "female" },
  { name: "Lucas Vieira", gender: "male" },
]

// Função para gerar um avatar aleatório baseado no gênero
function generateRandomAvatar(gender: "male" | "female", seed: string): string {
  // Usando a API do Dicebear para gerar avatares realistas
  // Usando o estilo 'personas' que tem aparência mais realista
  return `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(
    seed,
  )}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&gender=${gender}`
}

// Função para gerar um comentário aleatório
export function generateRandomComment(usedComments: Set<string> = new Set()): {
  name: string
  comment: string
  rating: number
  image: string
  gender: "male" | "female"
} {
  // Tenta gerar um comentário único até 10 tentativas
  for (let i = 0; i < 10; i++) {
    // Gera as partes do comentário
    const subject = subjects[Math.floor(Math.random() * subjects.length)]
    const adjective = positiveAdjectives[Math.floor(Math.random() * positiveAdjectives.length)]
    const compliment = compliments[Math.floor(Math.random() * compliments.length)]
    const foodComment =
      Math.random() > 0.5 ? ` ${foodSpecificComments[Math.floor(Math.random() * foodSpecificComments.length)]}` : ""

    // Monta o comentário completo
    const comment = `${subject} é ${adjective}! ${compliment}${foodComment}`

    // Verifica se o comentário já foi usado
    if (!usedComments.has(comment)) {
      // Gera uma avaliação entre 4.5 e 5
      const rating = Math.random() > 0.3 ? 5 : 4.5

      // Seleciona um nome aleatório com gênero
      const nameObj = names[Math.floor(Math.random() * names.length)]
      const { name, gender } = nameObj

      // Gera um avatar baseado no nome e gênero
      const image = generateRandomAvatar(gender, name)

      return { name, comment, rating, image, gender }
    }
  }

  // Fallback caso não consiga gerar um comentário único após 10 tentativas
  return {
    name: "Cliente Satisfeito",
    comment: "Excelente experiência! Recomendo a todos.",
    rating: 5,
    image: generateRandomAvatar("male", "default"),
    gender: "male",
  }
}

// Função para gerar múltiplos comentários únicos
export function generateUniqueComments(count: number): Array<{
  id: number
  name: string
  comment: string
  rating: number
  image: string
  gender: "male" | "female"
}> {
  const usedComments = new Set<string>()
  const comments = []

  for (let i = 0; i < count; i++) {
    const comment = generateRandomComment(usedComments)
    usedComments.add(comment.comment)
    comments.push({
      id: i + 1,
      ...comment,
    })
  }

  return comments
}
