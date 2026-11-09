import { GoogleGenerativeAI } from '@google/generative-ai'

const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: { responseMimeType: 'application/json' },
})

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

function isTransientGeminiError(error) {
  return /\[(429|500|503|504)\b|capacity|overloaded|temporarily unavailable|fetching from/i.test(String(error?.message || error))
}

export class GeminiServiceError extends Error {
  constructor(message, { retryable = false } = {}) {
    super(message)
    this.name = 'GeminiServiceError'
    this.retryable = retryable
  }
}

export async function generateJson(prompt) {
  let lastError

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await model.generateContent(prompt)
      const text = response.response.text().replace(/^```json\s*/i, '').replace(/```$/i, '').trim()
      return JSON.parse(text)
    } catch (error) {
      lastError = error
      if (!isTransientGeminiError(error) || attempt === 1) break
      await sleep(700 * (attempt + 1) + Math.round(Math.random() * 300))
    }
  }

  if (isTransientGeminiError(lastError)) {
    throw new GeminiServiceError('The AI service is temporarily unavailable. Please try again.', { retryable: true })
  }

  throw new GeminiServiceError('The AI service returned an invalid response. Please try again.')
}
