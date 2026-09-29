import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'
import { generateJson, GeminiServiceError } from '@/lib/gemini'
import { z } from 'zod'

export const runtime = 'nodejs'

const requestSchema = z.object({
  goal: z.string().trim().min(3).max(500),
  country: z.string().trim().max(100).optional().default(''),
  region: z.string().trim().max(100).optional().default(''),
  careerStage: z.string().trim().max(100).optional().default(''),
  targetLevel: z.string().trim().max(100).optional().default(''),
  education: z.string().trim().max(2000).optional().default(''),
  certifications: z.string().trim().max(2000).optional().default(''),
  projects: z.string().trim().max(3000).optional().default(''),
  currentOccupation: z.string().trim().max(200).optional().default(''),
  yearsExperience: z.string().trim().max(50).optional().default(''),
})

function asString(value, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback
}

function asList(value) {
  return Array.isArray(value) ? value.map((item) => String(item).trim()).filter(Boolean) : []
}

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)))
}

function normalizeRequirements(requirements) {
  return (Array.isArray(requirements) ? requirements : []).map((requirement, index) => ({
    id: asString(requirement.id, `requirement-${index + 1}`),
    name: asString(requirement.name, 'Career requirement'),
    category: asString(requirement.category, 'skill'),
    importance: asString(requirement.importance, 'recommended'),
    requiredForEntry: Boolean(requirement.requiredForEntry),
    currentLevel: clamp(requirement.currentLevel),
    targetLevel: clamp(requirement.targetLevel || 80),
    status: asString(requirement.status, 'missing'),
    reason: asString(requirement.reason, 'This supports readiness for the target career.'),
    estimatedEffort: asString(requirement.estimatedEffort, 'To be determined'),
    prerequisites: asList(requirement.prerequisites),
  })).slice(0, 30)
}

function calculateReadiness(requirements) {
  const weights = { mandatory: 1.5, strongly_expected: 1.25, required: 1.5, recommended: 1, optional: 0.5 }
  const categories = {}
  let total = 0
  let weightTotal = 0

  for (const requirement of requirements) {
    const weight = weights[requirement.importance] || 1
    const category = requirement.category || 'other'
    if (!categories[category]) categories[category] = { total: 0, weight: 0 }
    categories[category].total += requirement.currentLevel * weight
    categories[category].weight += weight
    total += requirement.currentLevel * weight
    weightTotal += weight
  }

  const breakdown = Object.fromEntries(Object.entries(categories).map(([category, value]) => [category, Math.round(value.total / value.weight)]))
  return { score: weightTotal ? Math.round(total / weightTotal) : 0, breakdown }
}

function normalizeRoadmap({ career, requirements, assessment, plan, input }) {
  const normalizedRequirements = normalizeRequirements(requirements)
  const readiness = calculateReadiness(normalizedRequirements)
  const phases = (Array.isArray(plan?.phases) ? plan.phases : []).map((phase, phaseIndex) => ({
    id: asString(phase.id, `phase-${phaseIndex + 1}`),
    title: asString(phase.title, `Phase ${phaseIndex + 1}`),
    summary: asString(phase.summary, 'Build the capabilities needed for your next step.'),
    tasks: (Array.isArray(phase.tasks) ? phase.tasks : []).map((task, taskIndex) => ({
      id: asString(task.id, `task-${phaseIndex + 1}-${taskIndex + 1}`),
      title: asString(task.title, 'Complete the next career step'),
      category: asString(task.category, 'development'),
      importance: asString(task.importance, 'recommended'),
      status: ['not_started', 'in_progress', 'completed', 'skipped'].includes(task.status) ? task.status : 'not_started',
      reason: asString(task.reason, 'This step closes a gap in your readiness profile.'),
      estimatedDuration: asString(task.estimatedDuration, 'Flexible'),
      dependencies: asList(task.dependencies),
      skillsGained: asList(task.skillsGained),
      evidence: asString(task.evidence, ''),
    })).slice(0, 12),
  })).slice(0, 10)

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    career: {
      industry: asString(career?.industry, 'Career development'),
      careerFamily: asString(career?.careerFamily),
      career: asString(career?.career, input.goal),
      specialization: asString(career?.specialization),
      targetLevel: asString(career?.targetLevel, input.targetLevel),
      confidence: clamp(career?.confidence),
      needsClarification: Boolean(career?.needsClarification),
    },
    location: { country: input.country, region: input.region },
    profile: {
      careerStage: input.careerStage,
      education: input.education,
      currentOccupation: input.currentOccupation,
      yearsExperience: input.yearsExperience,
      certifications: input.certifications,
      projects: input.projects,
    },
    requirements: normalizedRequirements,
    gaps: Array.isArray(assessment?.gaps) ? assessment.gaps.map((gap) => ({
      name: asString(gap.name),
      status: asString(gap.status, 'missing'),
      reason: asString(gap.reason),
      priority: asString(gap.priority, 'medium'),
    })).filter((gap) => gap.name).slice(0, 30) : [],
    readiness,
    phases,
    nextBestActions: asList(plan?.nextBestActions).slice(0, 3),
    summary: asString(plan?.summary, `A personalized path toward ${asString(career?.career, input.goal)}.`),
  }
}

async function getCurrentUser() {
  const { userId } = await auth()
  if (!userId) return null
  return db.user.findUnique({
    where: { clerkUserId: userId },
    include: { resume: true },
  })
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const roadmap = await db.careerRoadmap.findFirst({ where: { userId: user.id }, orderBy: { updatedAt: 'desc' } })
    return NextResponse.json({ roadmap })
  } catch (error) {
    console.error('Roadmap retrieval failed:', error)
    return NextResponse.json({ error: 'Unable to load your roadmap.' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const input = requestSchema.parse(await request.json())
    const profile = {
      existingIndustry: user.industry || '',
      existingBio: user.bio || '',
      existingExperience: user.experience ?? '',
      existingSkills: Array.isArray(user.skills) ? user.skills : [],
      resume: (user.resume?.[0]?.content || '').slice(0, 12000),
      ...input,
    }

    const career = await generateJson(`Resolve this career goal into structured JSON. Do not generate a roadmap yet. If ambiguous, choose the most likely career but set needsClarification true and provide the likely options in specialization as a semicolon-separated string. Keep the result career-agnostic and do not assume technology.
Shape: {"industry":"","careerFamily":"","career":"","specialization":"","confidence":0,"needsClarification":false}
Goal: ${input.goal}`)

    const requirements = await generateJson(`Analyze realistic entry requirements for this career. Respect the country and region, distinguish mandatory, strongly_expected, recommended, and optional, and explicitly flag licensing or registration when relevant. Do not invent jurisdiction-specific laws; say verification is needed in the reason when authoritative confirmation is unavailable.
Career: ${JSON.stringify(career)}
Location: ${input.country}, ${input.region}
Target level: ${input.targetLevel}
Return only JSON: {"requirements":[{"id":"","name":"","category":"education|skill|experience|certification|licensing|portfolio|networking","importance":"mandatory|strongly_expected|recommended|optional","requiredForEntry":false,"targetLevel":80,"reason":"","estimatedEffort":"","prerequisites":[]}]}`)

    const assessment = await generateJson(`Compare the career requirements against the user's actual profile. Never invent experience. Return status as satisfied, partial, missing, or not_applicable and concise gaps.
Requirements: ${JSON.stringify(requirements)}
User profile: ${JSON.stringify(profile)}
Return only JSON: {"gaps":[{"name":"","status":"satisfied|partial|missing|not_applicable","reason":"","priority":"high|medium|low"}],"requirementLevels":[{"id":"","currentLevel":0,"status":""}]}`)

    const requirementLevels = new Map((Array.isArray(assessment.requirementLevels) ? assessment.requirementLevels : []).map((level) => [level.id, level]))
    const enrichedRequirements = (Array.isArray(requirements.requirements) ? requirements.requirements : []).map((requirement) => ({
      ...requirement,
      currentLevel: requirementLevels.get(requirement.id)?.currentLevel || 0,
      status: requirementLevels.get(requirement.id)?.status || 'missing',
    }))

    const plan = await generateJson(`Build a personalized, career-agnostic roadmap from these analyzed requirements and gaps. Use dynamic phases appropriate to the career; do not force software-engineering phases. Order dependencies correctly. For regulated careers, include verification steps and do not present AI output as official advice. Return only JSON:
{"summary":"","nextBestActions":[""],"phases":[{"id":"","title":"","summary":"","tasks":[{"id":"","title":"","category":"","importance":"required|recommended|optional","status":"not_started","reason":"","estimatedDuration":"","dependencies":[],"skillsGained":[],"evidence":""}]}]}
Career: ${JSON.stringify(career)}
Requirements: ${JSON.stringify(enrichedRequirements)}
Gaps: ${JSON.stringify(assessment.gaps || [])}
  Profile: ${JSON.stringify({ ...profile, resume: undefined })}`)

    const content = normalizeRoadmap({ career, requirements: enrichedRequirements, assessment, plan, input })
    const roadmap = await db.careerRoadmap.create({
      data: {
        userId: user.id,
        title: `${content.career.career || input.goal} roadmap`,
        targetRole: content.career.career || input.goal,
        country: input.country || null,
        region: input.region || null,
        content,
      },
    })
    return NextResponse.json({ roadmap }, { status: 201 })
  } catch (error) {
    console.error('Roadmap generation failed:', error)
    if (error instanceof z.ZodError) return NextResponse.json({ success: false, error: error.issues[0]?.message || 'Invalid roadmap details.', retryable: false }, { status: 400 })
    if (error instanceof GeminiServiceError) return NextResponse.json({ success: false, error: error.message, retryable: error.retryable }, { status: error.retryable ? 503 : 502 })
    return NextResponse.json({ success: false, error: 'Unable to generate your roadmap right now. Please try again.', retryable: true }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const taskId = asString(body.taskId)
    const status = asString(body.status)
    if (!taskId || !['not_started', 'in_progress', 'completed', 'skipped'].includes(status)) {
      return NextResponse.json({ error: 'A valid task and status are required.' }, { status: 400 })
    }

    const roadmap = await db.careerRoadmap.findFirst({ where: { id: asString(body.roadmapId), userId: user.id } })
    if (!roadmap) return NextResponse.json({ error: 'Roadmap not found.' }, { status: 404 })
    const content = typeof roadmap.content === 'object' && roadmap.content !== null ? structuredClone(roadmap.content) : {}
    for (const phase of content.phases || []) {
      for (const task of phase.tasks || []) {
        if (task.id === taskId) task.status = status
      }
    }
    const updated = await db.careerRoadmap.update({ where: { id: roadmap.id }, data: { content } })
    return NextResponse.json({ roadmap: updated })
  } catch (error) {
    console.error('Roadmap update failed:', error)
    return NextResponse.json({ error: 'Unable to update roadmap progress.' }, { status: 500 })
  }
}
