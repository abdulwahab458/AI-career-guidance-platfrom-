import React from "react";
import { getAssesment } from "@/actions/interview"; // adjust path as needed
import PerformanceDashboard from "@/components/PeformanceDashboard";

const Page = async () => {
  // ✅ Fetch assessments from the server action
  const assessments = await getAssesment();

  return (
    <div className="p-6 max-w-5xl mt-15 mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-5xl bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text font-extrabold text-transparent ">Interview Preparation</h1>
      <PerformanceDashboard assessments={assessments || []} />
    </div>
  );
};

export default Page;
