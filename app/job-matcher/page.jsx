'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, ArrowRight, CheckCircle2, FileText, Loader2, Sparkles, Target, Upload, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

const resultSections = [
  { key: 'matchedSkills', title: 'Matched Skills', icon: CheckCircle2, color: 'text-emerald-500' },
  { key: 'missingSkills', title: 'Missing Skills', icon: XCircle, color: 'text-rose-500' },
  { key: 'keywordGaps', title: 'Keyword Gaps', icon: AlertCircle, color: 'text-amber-500' },
  { key: 'experienceGaps', title: 'Experience Gaps', icon: Target, color: 'text-sky-500' },
]

const JobMatcherPage = () => {
  const [resume, setResume] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = result ? 'auto' : 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [result])

  const handleAnalyze = async (event) => {
    event.preventDefault()
    setError('')
    setResult(null)

    if (!resume || !jobDescription.trim()) {
      setError('Upload your resume and paste the job description before analyzing.')
      return
    }

    const formData = new FormData()
    formData.append('resume', resume)
    formData.append('jobDescription', jobDescription.trim())

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/job-matcher/analyze', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Analysis failed')
      setResult(data)
    } catch (analysisError) {
      setError(analysisError.message || 'Unable to analyze your application right now.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <main className={`job-matcher-page mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-8 ${result ? 'relative min-h-[calc(100vh-4rem)] overflow-visible' : 'fixed inset-x-0 top-12 h-[calc(100vh-4rem)] justify-center overflow-hidden'}`}>
      <section className="max-w-3xl space-y-2">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-sky-500"><Sparkles className="h-4 w-4" /> Application intelligence</p>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">See how your resume fits the role.</h1>
        <p className="text-base text-muted-foreground sm:text-lg">Upload your resume and add the job description to get a focused match report in seconds.</p>
      </section>

      <form onSubmit={handleAnalyze} className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="min-w-0">
          <CardHeader className="pb-4"><CardTitle>Resume</CardTitle><CardDescription>PDF, DOCX, or TXT up to 10 MB.</CardDescription></CardHeader>
          <CardContent>
            <label htmlFor="resume-upload" className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 px-6 text-center transition hover:border-sky-500 hover:bg-sky-500/5">
              <Upload className="mb-3 h-8 w-8 text-sky-500" />
              <span className="font-medium">{resume ? resume.name : 'Choose your resume'}</span>
              <span className="mt-1 text-sm text-muted-foreground">{resume ? `${(resume.size / 1024 / 1024).toFixed(2)} MB` : 'or drop it here'}</span>
              <input id="resume-upload" type="file" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" className="sr-only" onChange={(event) => setResume(event.target.files?.[0] || null)} />
            </label>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="pb-4"><CardTitle>Job description</CardTitle><CardDescription>Paste the complete listing for the most useful comparison.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste the role, responsibilities, requirements, and qualifications here..." className="min-h-44 max-h-44 resize-none overflow-y-auto [field-sizing:fixed]" />
            <Button type="submit" disabled={isAnalyzing} className="w-full sm:w-auto">
              {isAnalyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4" />Analyze match</>}
            </Button>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>
      </form>

      {result && (
        <section className="space-y-6" aria-live="polite">
          <Card className="overflow-hidden border-sky-500/30">
            <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Resume match</p>
                <p className="mt-2 text-4xl font-bold">{result.matchScore}% <span className="text-lg font-medium text-muted-foreground">match</span></p>
                <p className="mt-2 max-w-2xl text-muted-foreground">{result.summary}</p>
              </div>
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[10px] border-sky-500/20 text-3xl font-bold text-sky-500" style={{ borderTopColor: 'rgb(14 165 233)' }}>{result.matchScore}%</div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {resultSections.map(({ key, title, icon: Icon, color }) => (
              <Card key={key}>
                <CardHeader className="flex flex-row items-center gap-3 space-y-0"><Icon className={`h-5 w-5 ${color}`} /><CardTitle>{title}</CardTitle></CardHeader>
                <CardContent>{result[key]?.length ? <ul className="space-y-2 text-sm text-muted-foreground">{result[key].map((item) => <li key={item} className="flex gap-2"><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />{item}</li>)}</ul> : <p className="text-sm text-muted-foreground">No significant gaps found.</p>}</CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-sky-500" />Suggestions</CardTitle></CardHeader>
            <CardContent><ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">{result.suggestions.map((suggestion) => <li key={suggestion} className="rounded-md bg-muted/50 p-3">{suggestion}</li>)}</ul></CardContent>
          </Card>
        </section>
      )}
    </main>
  )
}

export default JobMatcherPage
