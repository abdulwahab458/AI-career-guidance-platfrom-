import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import mammoth from 'mammoth'
import pdfParse from 'pdf-parse/lib/pdf-parse.js'

export const runtime = 'nodejs'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const allowedExtensions = new Set(['pdf', 'docx', 'txt'])
const arrayFields = ['matchedSkills', 'missingSkills', 'keywordGaps', 'experienceGaps', 'suggestions']

async function extractResumeText(file) {
  const extension = file.name.toLowerCase().split('.').pop()
  if (!allowedExtensions.has(extension)) throw new Error('Unsupported resume format. Use PDF, DOCX, or TXT.')
  if (file.size > MAX_FILE_SIZE) throw new Error('Resume must be 10 MB or smaller.')

  const buffer = Buffer.from(await file.arrayBuffer())
  if (extension === 'pdf') return (await pdfParse(buffer)).text
  if (extension === 'docx') return (await mammoth.extractRawText({ buffer })).value
  return buffer.toString('utf8')
}

function normalizeResult(value) {
  const result = typeof value === 'object' && value !== null ? value : {}
  const score = (field) => Math.min(100, Math.max(0, Number(result[field]) || 0))
  const matchScore = Math.round(score('skillMatch') * 0.4 + score('experienceMatch') * 0.25 + score('keywordMatch') * 0.2 + score('educationMatch') * 0.15)

  return {
    matchScore,
    summary: String(result.summary || 'The resume was compared with the role requirements.'),
    skillMatch: score('skillMatch'),
    experienceMatch: score('experienceMatch'),
    keywordMatch: score('keywordMatch'),
    educationMatch: score('educationMatch'),
    ...Object.fromEntries(arrayFields.map((field) => [field, Array.isArray(result[field]) ? result[field].map(String).filter(Boolean) : []])),
  }
}

export async function POST(request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await request.formData()
    const resume = formData.get('resume')
    const jobDescription = String(formData.get('jobDescription') || '').trim()
    if (!resume || typeof resume.arrayBuffer !== 'function') return NextResponse.json({ error: 'Please upload a resume.' }, { status: 400 })
    if (!jobDescription) return NextResponse.json({ error: 'Please provide a job description.' }, { status: 400 })

    const resumeText = (await extractResumeText(resume)).trim()
    if (!resumeText) return NextResponse.json({ error: 'We could not extract text from that resume.' }, { status: 400 })

    const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genai.getGenerativeModel({ model: 'gemini-2.5-flash', generationConfig: { responseMimeType: 'application/json' } })
    const prompt = `Compare the resume and job description below as an expert recruiter. Return only valid JSON matching this shape:
{
  "skillMatch": number,
  "experienceMatch": number,
  "keywordMatch": number,
  "educationMatch": number,
  "summary": "brief overall assessment",
  "matchedSkills": ["skills present in both"],
  "missingSkills": ["important required skills absent from resume"],
  "keywordGaps": ["job-specific terms missing or underused"],
  "experienceGaps": ["experience or responsibility gaps"],
  "suggestions": ["specific actionable resume improvements"]
}
Use scores from 0 to 100. Distinguish required skills from nice-to-have skills, avoid inventing candidate experience, and keep each list concise.

RESUME:\n${resumeText.slice(0, 50000)}

JOB DESCRIPTION:\n${jobDescription.slice(0, 30000)}`

    const response = await model.generateContent(prompt)
    return NextResponse.json(normalizeResult(JSON.parse(response.response.text())))
  } catch (error) {
    console.error('Job matcher analysis failed:', error)
    return NextResponse.json({ error: error.message || 'Failed to analyze the resume.' }, { status: 500 })
  }
}