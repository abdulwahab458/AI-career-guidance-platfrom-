'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Check, ChevronDown, Circle, Map, RefreshCw, Sparkles, Target } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'

const initialForm = {
  goal: '',
  country: '',
  region: '',
  careerStage: '',
  targetLevel: '',
  education: '',
  certifications: '',
  projects: '',
  currentOccupation: '',
  yearsExperience: '',
}

const stages = ['Career goal', 'Location', 'Current situation', 'Profile']
const statusLabel = { not_started: 'Not started', in_progress: 'In progress', completed: 'Complete', skipped: 'Skipped' }

function flattenTasks(content) {
  return (content?.phases || []).flatMap((phase) => phase.tasks || [])
}

function RoadmapDashboard({ roadmap, onRefresh }) {
  const [expandedPhase, setExpandedPhase] = useState(roadmap.content.phases?.[0]?.id || null)
  const [updatingTask, setUpdatingTask] = useState('')
  const content = roadmap.content
  const tasks = flattenTasks(content)
  const completed = tasks.filter((task) => task.status === 'completed').length
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0

  const updateTask = async (taskId, status) => {
    setUpdatingTask(taskId)
    try {
      const response = await fetch('/api/roadmap', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roadmapId: roadmap.id, taskId, status }),
      })
      if (!response.ok) throw new Error('Unable to update task')
      await onRefresh()
    } catch (error) {
      window.alert(error.message)
    } finally {
      setUpdatingTask('')
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-col gap-5 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-500"><Map className="h-4 w-4" /> Career roadmap</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{content.career.career}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{content.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {content.location.country && <Badge variant="outline">{content.location.country}{content.location.region ? ` · ${content.location.region}` : ''}</Badge>}
            {content.career.targetLevel && <Badge variant="outline">Target: {content.career.targetLevel}</Badge>}
          </div>
        </div>
        <Button variant="outline" onClick={onRefresh}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="overflow-hidden border-sky-500/25 bg-gradient-to-br from-sky-500/10 via-card to-card">
          <CardContent className="p-6">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div><p className="text-sm font-medium text-muted-foreground">Career readiness</p><p className="mt-1 text-5xl font-bold text-sky-500">{content.readiness.score}%</p><p className="mt-2 text-sm text-muted-foreground">A transparent starting point based on your current evidence.</p></div>
              <div className="w-full max-w-xs"><div className="mb-2 flex justify-between text-xs text-muted-foreground"><span>Roadmap progress</span><span>{progress}%</span></div><Progress value={progress} /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Target className="h-4 w-4 text-amber-500" />Next best action</CardTitle></CardHeader>
          <CardContent><p className="font-semibold">{content.nextBestActions?.[0] || 'Start the first roadmap task'}</p><p className="mt-2 text-sm text-muted-foreground">Follow the phase order below and update tasks as you build evidence.</p></CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(content.readiness.breakdown || {}).slice(0, 4).map(([category, value]) => <Card key={category}><CardContent className="p-4"><p className="text-xs font-medium capitalize text-muted-foreground">{category.replaceAll('_', ' ')}</p><p className="mt-1 text-2xl font-bold">{value}%</p><Progress className="mt-3" value={value} /></CardContent></Card>)}
      </section>

      <section className="space-y-3">
        <div><h2 className="text-xl font-semibold">Your path</h2><p className="text-sm text-muted-foreground">Work through the phases in order. Dependencies are shown on each task.</p></div>
        {content.phases?.map((phase, index) => {
          const phaseCompleted = phase.tasks.filter((task) => task.status === 'completed').length
          const isExpanded = expandedPhase === phase.id
          return <Card key={phase.id} className="overflow-hidden transition-shadow hover:shadow-md">
            <button type="button" onClick={() => setExpandedPhase(isExpanded ? null : phase.id)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
              <span className="flex min-w-0 items-center gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sm font-bold text-sky-500">{index + 1}</span><span className="min-w-0"><span className="block truncate font-semibold">{phase.title}</span><span className="mt-1 block text-sm text-muted-foreground">{phase.summary}</span></span></span>
              <span className="flex shrink-0 items-center gap-3"><Badge variant="outline">{phaseCompleted}/{phase.tasks.length}</Badge><ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} /></span>
            </button>
            {isExpanded && <CardContent className="border-t border-border/70 px-5 pb-5 pt-4"><div className="space-y-3">{phase.tasks.map((task) => <div key={task.id} className="rounded-xl border border-border/70 bg-muted/20 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="flex gap-3"><span className="mt-0.5 text-muted-foreground">{task.status === 'completed' ? <Check className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5" />}</span><div><p className="font-medium">{task.title}</p><p className="mt-1 text-sm text-muted-foreground">{task.reason}</p>{task.dependencies?.length > 0 && <p className="mt-2 text-xs text-muted-foreground">Depends on: {task.dependencies.join(', ')}</p>}</div></div><select value={task.status} disabled={updatingTask === task.id} onChange={(event) => updateTask(task.id, event.target.value)} className="rounded-md border border-input bg-background px-2 py-1.5 text-xs"><option value="not_started">Not started</option><option value="in_progress">In progress</option><option value="completed">Complete</option><option value="skipped">Skipped</option></select></div><div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground"><Badge variant="secondary">{task.estimatedDuration}</Badge>{task.skillsGained?.map((skill) => <Badge key={skill} variant="outline">{skill}</Badge>)}</div></div>)}</div></CardContent>}
          </Card>
        })}
      </section>
      <p className="text-xs text-muted-foreground">AI-generated guidance is a planning aid. Verify licensing, registration, and jurisdiction-specific requirements with the relevant official authority.</p>
    </div>
  )
}

function RoadmapCreation({ onCreated }) {
  const [form, setForm] = useState(initialForm)
  const [step, setStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const canContinue = step === 0 ? form.goal.trim().length >= 3 : true

  const submit = async () => {
    setError('')
    setIsGenerating(true)
    try {
      const response = await fetch('/api/roadmap', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to generate roadmap')
      onCreated(data.roadmap)
    } catch (generationError) {
      setError(generationError.message)
    } finally {
      setIsGenerating(false)
    }
  }

  if (isGenerating) return <Card className="mx-auto max-w-2xl"><CardContent className="p-8 sm:p-12"><div className="mx-auto max-w-md text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500"><Sparkles className="h-7 w-7 animate-pulse" /></div><h1 className="mt-6 text-2xl font-bold">Building your career roadmap</h1><p className="mt-2 text-muted-foreground">Gemini is turning your goal and experience into a practical path.</p><div className="mt-8 space-y-3 text-left text-sm"><p><Check className="mr-2 inline h-4 w-4 text-emerald-500" />Understanding your career goal</p><p><Check className="mr-2 inline h-4 w-4 text-emerald-500" />Identifying requirements and gaps</p><p><Sparkles className="mr-2 inline h-4 w-4 animate-pulse text-sky-500" />Building personalized phases</p><p className="text-muted-foreground"><Circle className="mr-2 inline h-4 w-4" />Creating your next best action</p></div></div></CardContent></Card>

  return <div className="mx-auto max-w-3xl"><div className="mb-8 flex items-center justify-between"><div><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-500"><Map className="h-4 w-4" /> Career roadmap</p><h1 className="mt-2 text-3xl font-bold">Design your next move.</h1></div><span className="text-sm text-muted-foreground">{step + 1} / {stages.length}</span></div><Progress value={((step + 1) / stages.length) * 100} className="mb-8" />
    <Card><CardHeader><CardTitle>{stages[step]}</CardTitle><CardDescription>{step === 0 ? 'Tell us what you want to become in your own words.' : step === 1 ? 'Requirements can vary by country and region.' : step === 2 ? 'Help the roadmap meet you where you are today.' : 'Add what you already know so the plan focuses on your gaps.'}</CardDescription></CardHeader><CardContent className="space-y-5">
      {step === 0 && <><Textarea autoFocus value={form.goal} onChange={(event) => update('goal', event.target.value)} placeholder="I want to become a commercial pilot..." className="min-h-32 resize-none" /><p className="text-xs text-muted-foreground">Broad goals are welcome. The system can ask for more detail in a future refinement.</p></>}
      {step === 1 && <div className="grid gap-4 sm:grid-cols-2"><Input value={form.country} onChange={(event) => update('country', event.target.value)} placeholder="Country (e.g. India)" /><Input value={form.region} onChange={(event) => update('region', event.target.value)} placeholder="State, province, or city" /></div>}
      {step === 2 && <div className="space-y-6"><div><p className="mb-3 text-sm font-medium">Which sounds most like you?</p><div className="grid gap-2 sm:grid-cols-2">{['High school student', 'College student', 'Recent graduate', 'Changing careers', 'Working professional'].map((stage) => <Button key={stage} type="button" variant={form.careerStage === stage ? 'default' : 'outline'} className="justify-start" onClick={() => update('careerStage', stage)}>{stage}</Button>)}</div><p className="mt-2 text-xs text-muted-foreground">No experience yet? Choose Recent graduate or College student. We will build from your current starting point.</p></div><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-2"><span className="text-sm font-medium">Current role <span className="font-normal text-muted-foreground">(optional)</span></span><Input value={form.currentOccupation} onChange={(event) => update('currentOccupation', event.target.value)} placeholder="Student, graduate, or leave blank" /></label><label className="space-y-2"><span className="text-sm font-medium">Years of experience</span><Input type="number" min="0" max="50" value={form.yearsExperience} onChange={(event) => update('yearsExperience', event.target.value)} placeholder="0" /></label></div><div><p className="mb-3 text-sm font-medium">What level are you aiming for?</p><div className="flex flex-wrap gap-2">{['Entry-level', 'Not sure yet', 'Experienced'].map((level) => <Button key={level} type="button" variant={form.targetLevel === level ? 'default' : 'outline'} onClick={() => update('targetLevel', level)}>{level}</Button>)}</div><p className="mt-2 text-xs text-muted-foreground">Not sure is fine. The roadmap will suggest a realistic next level.</p></div></div>}
      {step === 3 && <div className="space-y-5"><div><label className="text-sm font-medium" htmlFor="roadmap-education">Education</label><Textarea id="roadmap-education" value={form.education} onChange={(event) => update('education', event.target.value)} placeholder="Degree, school, graduation year, or subjects you are studying" className="mt-2 min-h-24 resize-none" /><p className="mt-1 text-xs text-muted-foreground">A short description is enough. You can write “Currently studying...”</p></div><div><label className="text-sm font-medium" htmlFor="roadmap-certifications">Certifications or licenses <span className="font-normal text-muted-foreground">(optional)</span></label><Textarea id="roadmap-certifications" value={form.certifications} onChange={(event) => update('certifications', event.target.value)} placeholder="Add any certifications, exams, or write “None yet”" className="mt-2 min-h-20 resize-none" /></div><div><label className="text-sm font-medium" htmlFor="roadmap-projects">Projects and practical experience <span className="font-normal text-muted-foreground">(optional)</span></label><Textarea id="roadmap-projects" value={form.projects} onChange={(event) => update('projects', event.target.value)} placeholder="Class assignments, personal projects, volunteering, clubs, internships, or write “None yet”" className="mt-2 min-h-24 resize-none" /><p className="mt-1 text-xs text-muted-foreground">Coursework and volunteering count. You do not need a formal job to get started.</p></div></div>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-between gap-3"><Button type="button" variant="ghost" disabled={step === 0} onClick={() => setStep((current) => current - 1)}>Back</Button>{step < stages.length - 1 ? <Button type="button" disabled={!canContinue} onClick={() => setStep((current) => current + 1)}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Button> : <Button type="button" onClick={submit}>Generate roadmap <Sparkles className="ml-2 h-4 w-4" /></Button>}</div>
    </CardContent></Card></div>
}

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadRoadmap = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/roadmap')
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to load roadmap')
      setRoadmap(data.roadmap)
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadRoadmap() }, [])

  return <main className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.1),_transparent_35%),linear-gradient(135deg,_hsl(var(--background)),_hsl(var(--muted)/0.45))] px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8">{loading ? <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center"><RefreshCw className="h-6 w-6 animate-spin text-sky-500" /></div> : error ? <Card className="mx-auto max-w-2xl"><CardContent className="p-8 text-center"><p className="text-destructive">{error}</p><Button className="mt-4" onClick={loadRoadmap}>Try again</Button></CardContent></Card> : roadmap ? <RoadmapDashboard roadmap={roadmap} onRefresh={loadRoadmap} /> : <RoadmapCreation onCreated={setRoadmap} />}</main>
}
