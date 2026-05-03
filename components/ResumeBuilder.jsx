"use client"

import { Download, Edit, Loader2, Monitor, Save } from "lucide-react"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resumeSchema } from "@/lib/schema"
import useFetch from "./hooks/use-fetch"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import EntryForm from "./EntryForm"
import { entriesToMarkdown } from "@/lib/helper"
import MDEditor from "@uiw/react-md-editor"
import { useUser } from "@clerk/nextjs"
import jsPDF from "jspdf"
import { marked } from "marked"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"

  // Call server API to save resume (client-safe)
  const callSaveResume = async (content) => {
    const res = await fetch('/api/resume/save', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || 'Failed to save resume')
    }
    return await res.json()
  }

const ResumeBuilder = ({ initialContent }) => {
  const [activeTab, setActiveTab] = useState("edit")
  const [resumeMode, setResumeMode] = useState("preview")
  const [previewContent, setPreviewContent] = useState(initialContent)
  const [isGenerating, setIsGenerating] = useState(false)
  const { user } = useUser()

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      experience: [],
      education: [],
      projects: [],
    },
  })

  const {
    loading: savingResult,
    fn: saveResumefn,
    data: saveResult,
    error: saveError,
  } = useFetch(callSaveResume)

  const formValues = watch()

  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent()
      if (newContent && newContent.trim().length > 10) {
        setPreviewContent(newContent)
      }
    } else if (activeTab === "preview" && !previewContent) {
      setPreviewContent(initialContent || "")
    }
  }, [formValues, activeTab, initialContent])

  const getContactMarkdown = () => {
    const { contactInfo } = formValues
    const parts = []
    if (contactInfo.email) parts.push(`${contactInfo.email}`)
    if (contactInfo.mobile) parts.push(`${contactInfo.mobile}`)
    if (contactInfo.linkedin) parts.push(`[LinkedIn](${contactInfo.linkedin})`)
    if (contactInfo.twitter) parts.push(`[Twitter](${contactInfo.twitter})`)

    const fullName = user?.fullName || "Your Name"

    return parts.length > 0
      ? `## <div align="center">${fullName}</div>

<div align="center">${parts.join(" | ")}</div>`
      : `## <div align="center">${fullName}</div>`
  }

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues
    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n")
  }

  const generatePDF = async () => {
    setIsGenerating(true)
    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" })
      const html = marked.parse(previewContent)
      const text = html.replace(/<[^>]+>/g, "")
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 10
      const maxLineWidth = pageWidth - 2 * margin
      const lines = doc.splitTextToSize(text, maxLineWidth)
      doc.text(lines, margin, 20)
      doc.save("resume.pdf")
    } catch (error) {
      console.error("Error downloading PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const onSubmit = async () => {
    try {
      await saveResumefn(previewContent)
    } catch (error) {
      console.error("Save Error:", error)
    }
  }

  useEffect(() => {
    if (saveResult?.id) {
      toast.success("Resume saved successfully")
    } else if (saveError) {
      toast.error("Failed to save resume")
    }
  }, [saveResult, saveError])

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent">
          Build Your Resume
        </h1>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={onSubmit}
            disabled={savingResult}
            className="flex items-center gap-2"
          >
            {savingResult ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save
              </>
            )}
          </Button>
          <Button
            onClick={generatePDF}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" /> Download
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Edit Section */}
        <TabsContent value="edit" className="mt-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 transition-all duration-300"
          >
            {/* Contact Info */}
            <Card>
              <CardContent className="space-y-4 p-6">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input {...register("contactInfo.email")} placeholder="Email" type="email" />
                  <Input {...register("contactInfo.mobile")} placeholder="Phone" type="tel" />
                  <Input {...register("contactInfo.linkedin")} placeholder="LinkedIn URL" type="url" />
                  <Input {...register("contactInfo.twitter")} placeholder="Twitter URL" type="url" />
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardContent className="space-y-4 p-6">
                <h3 className="text-lg font-semibold">Professional Summary</h3>
                <Controller
                  name="summary"
                  control={control}
                  render={({ field }) => (
                    <Textarea {...field} placeholder="Write a short summary..." rows={4} />
                  )}
                />
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardContent className="space-y-4 p-6">
                <h3 className="text-lg font-semibold">Skills</h3>
                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <Textarea {...field} placeholder="List your skills..." rows={4} />
                  )}
                />
              </CardContent>
            </Card>

            {/* Experience / Education / Projects */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="space-y-4 p-6">
                  <h3 className="text-lg font-semibold">Experience</h3>
                  <Controller
                    name="experience"
                    control={control}
                    render={({ field }) => (
                      <EntryForm type="Experience" entries={field.value} onChange={field.onChange} />
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-4 p-6">
                  <h3 className="text-lg font-semibold">Education</h3>
                  <Controller
                    name="education"
                    control={control}
                    render={({ field }) => (
                      <EntryForm type="Education" entries={field.value} onChange={field.onChange} />
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-4 p-6">
                  <h3 className="text-lg font-semibold">Projects</h3>
                  <Controller
                    name="projects"
                    control={control}
                    render={({ field }) => (
                      <EntryForm type="Project" entries={field.value} onChange={field.onChange} />
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </form>
        </TabsContent>

        {/* Preview Section */}
        <TabsContent value="preview" className="mt-6">
          <div className="flex justify-end mb-4">
            <Button
              variant="link"
              type="button"
              onClick={() =>
                setResumeMode(resumeMode === "preview" ? "edit" : "preview")
              }
              className="flex items-center gap-2"
            >
              {resumeMode === "preview" ? (
                <>
                  <Edit className="h-4 w-4" /> Edit Resume
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4" /> Preview Resume
                </>
              )}
            </Button>
          </div>

          <div
            id="resume-pdf"
            className="border rounded-lg bg-white p-4 shadow-sm max-h-[80vh] overflow-auto"
          >
            <MDEditor
              value={previewContent}
              onChange={setPreviewContent}
              height={700}
              preview={resumeMode}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ResumeBuilder
