"use server"

import { Redis } from "@upstash/redis"
import { revalidatePath } from "next/cache"

// Initialize Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

interface PersonData {
  matricula: string
  nomeCompleto: string
  endereco: string
  telefone: string
  idade: number
}

const RANKING_KEY = "censo_final_v1"

// ETL Validation function
function validatePerson(data: PersonData): { valid: boolean; error?: string } {
  // Check if name is not empty
  if (!data.nomeCompleto || data.nomeCompleto.trim().length === 0) {
    return { valid: false, error: "Nome completo é obrigatório." }
  }

  // Check if age is a positive number
  if (!Number.isInteger(data.idade) || data.idade < 0) {
    return { valid: false, error: "Idade deve ser um número positivo." }
  }

  if (data.idade > 150) {
    return { valid: false, error: "Idade deve ser menor que 150 anos." }
  }

  // Check if matricula is not empty
  if (!data.matricula || data.matricula.trim().length === 0) {
    return { valid: false, error: "Matrícula é obrigatória." }
  }

  return { valid: true }
}

export async function savePerson(data: PersonData) {
  try {
    // Validate data (ETL)
    const validation = validatePerson(data)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    await redis.zadd(RANKING_KEY, {
      score: Number.parseInt(data.idade.toString()),
      member: `${data.nomeCompleto} - ${data.matricula}`,
    })

    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("[v0] Error saving person:", error)
    return { success: false, error: "Erro ao salvar no banco de dados." }
  }
}

export async function getRanking() {
  try {
    const dados = await redis.zrange(RANKING_KEY, 0, 9, {
      rev: true,
      withScores: true,
    })

    // Transform to array of objects
    const ranking = []
    for (let i = 0; i < dados.length; i += 2) {
      ranking.push({
        name: dados[i] as string,
        age: dados[i + 1] as number,
      })
    }

    return ranking
  } catch (error) {
    console.error("[v0] Error fetching ranking:", error)
    return []
  }
}
