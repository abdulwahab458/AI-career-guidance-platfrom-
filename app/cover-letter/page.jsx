"use client";

import { useState, useEffect } from "react";
import { Download, FileText, Loader2, Monitor, Sparkles } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import jsPDF from "jspdf";
import { marked } from "marked";
import PropTypes from "prop-types";
import { toast } from "sonner";

import useFetch from "@/components/hooks/use-fetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateCoverLetter } from "@/actions/coverletter";

const CoverLetterBuilder = ({ initialLetter = "" }) => {
  const [coverLetter, setcoverLetter] = useState(initialLetter);
  const [mode, setmode] = useState("preview");
  const [jobTitle, setjobTitle] = useState("");
  const [companyName, setcompanyName] = useState("");
  const [jobDescription, setjobDescription] = useState("");
  const [resumeSummary, setresumeSummary] = useState("");

  const { fn: generateLetter, data: aiLetter, loading: isGenerating } =
    useFetch(generateCoverLetter);

  // Update cover letter when AI finishes
  useEffect(() => {
    if (aiLetter?.coverLetter && aiLetter.coverLetter !== coverLetter) {
      setcoverLetter(aiLetter.coverLetter);
    }
  }, [aiLetter]);

  // Generate cover letter
  const handleGenerate = async () => {
    if (!jobTitle || !companyName) {
      toast.error("Please fill in Job Title and Company Name first");
      return;
    }
    await generateLetter({ jobTitle, companyName, jobDescription, resumeSummary });
  };

  // Download PDF
  const handleDownloadPDF = async () => {
    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const html = marked.parse(coverLetter || "");
      const text = html.replaceAll(/<[^>]+>/g, "");

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 10;
      const maxLineWidth = pageWidth - 2 * margin;
      const lines = doc.splitTextToSize(text, maxLineWidth);

      doc.text(lines, margin, 20);
      doc.save("cover-letter.pdf");

      toast.success("Cover Letter downloaded successfully!");
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error("Failed to download PDF");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 space-y-6 px-4 pb-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h2 className="text-4xl font-extrabold bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent">
          Generate Your Cover Letter
        </h2>

        <div className="space-x-2 mt-4 md:mt-0">
          <Button onClick={handleDownloadPDF} disabled={!coverLetter}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* INPUT SECTION */}
      <div className="border rounded-lg p-6 space-y-4 bg-card">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="jobTitle" className="text-sm font-medium">Job Title</label>
            <Input
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setjobTitle(e.target.value)}
              placeholder="e.g., Frontend Developer"
            />
          </div>
          <div>
            <label htmlFor="companyName" className="text-sm font-medium">Company Name</label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setcompanyName(e.target.value)}
              placeholder="e.g., OpenAI"
            />
          </div>
        </div>

        <div>
          <label htmlFor="jobDescription" className="text-sm font-medium">Job Description</label>
          <Textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setjobDescription(e.target.value)}
            placeholder="Paste the job description here..."
          />
        </div>

        <div>
          <label htmlFor="resumeSummary" className="text-sm font-medium">Your Resume Summary</label>
          <Textarea
            id="resumeSummary"
            value={resumeSummary}
            onChange={(e) => setresumeSummary(e.target.value)}
            placeholder="Paste your professional summary here..."
          />
        </div>

        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            onClick={() => setmode(mode === "preview" ? "edit" : "preview")}
          >
            {mode === "preview" ? (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Edit Letter
              </>
            ) : (
              <>
                <Monitor className="h-4 w-4 mr-2" />
                Preview Letter
              </>
            )}
          </Button>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate with AI
              </>
            )}
          </Button>
        </div>
      </div>

      {/* EDITOR / PREVIEW SECTION */}
      <div className="cover-letter-editor border rounded-lg p-4 bg-white max-h-[80vh] overflow-y-auto">
        <MDEditor
          value={coverLetter}
          onChange={setcoverLetter}
          height={700}
          preview={mode}
          style={{
            background: "white",
          }}
        />
      </div>
    </div>
  );
};

export default CoverLetterBuilder;

CoverLetterBuilder.propTypes = {
  initialLetter: PropTypes.string,
};
