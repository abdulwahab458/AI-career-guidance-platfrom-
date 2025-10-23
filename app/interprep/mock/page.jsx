import Quiz from "@/components/Quiz";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-slate-950/20 to-background ">
      <div className="container mx-auto mt-16 flex flex-col gap-y-6 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div>
          <Link href="/interprep">
            <Button variant="ghost" className="gap-2 hover:bg-transparent">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Interview Preparation</span>
            </Button>
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-extrabold bg-gradient-to-b from-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            Mock Interview
          </h1>
          <p className="text-neutral-400 text-sm max-w-md mx-auto">
            Test your knowledge with realistic, industry-specific interview questions.
          </p>
        </div>

        {/* Quiz Container */}
        <div className="mt-3 flex justify-center">
          <div className="w-full max-w-2xl rounded-2xl shadow-2xl border border-neutral-800/40 bg-neutral-900/50 backdrop-blur-lg p-6 sm:p-8">
            <Quiz />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
