import { CheckCircle2, Trophy, XCircle } from "lucide-react";
import React from "react";
import { CardContent, CardFooter } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";

const QuizResult = ({ result, hideStartNew = false, onstartNew }) => {
  if (!result) return null;

  // ✅ Match Prisma schema field names
  const score =
    result.quizscore ??
    result.quizScore ??
    result.score ??
    0;

  const improvementTip =
    result.improvementTip ??
    result.improvementtip ??
    "";

  // ✅ Normalize questions (handle if stored as array of objects or JSON strings)
  const questions =
    Array.isArray(result.questions)
      ? result.questions.map((q) =>
          typeof q === "string" ? JSON.parse(q) : q
        )
      : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="flex items-center gap-2 text-4xl font-semibold">
        <Trophy className="h-6 w-6 text-yellow-500" />
        Quiz Result
      </h1>

      <CardContent className="space-y-6">
        {/* Score Section */}
        <div>
          <h3 className="text-2xl font-bold mb-2">
            {Number(score).toFixed(1)}%
          </h3>
          <Progress value={Number(score)} className="w-full" />
        </div>

        {/* Improvement Tip */}
        {improvementTip && (
          <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm">
            <p className="font-semibold">Improvement Tip:</p>
            <p>{improvementTip}</p>
          </div>
        )}

        {/* Questions Review */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Question Review</h2>
          <div className="space-y-4">
            {questions.map((q, index) => (
              <div
                key={index}
                className={`p-3 border rounded-lg ${
                  q.isCorrect
                    ? "border-green-300 bg-green-50"
                    : "border-red-300 bg-red-50"
                }`}
              >
                {/* Question text + icon */}
                <div className="flex items-center gap-2 mb-2">
                  {q.isCorrect ? (
                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                  ) : (
                    <XCircle className="text-red-600 w-5 h-5" />
                  )}
                  <p className="font-medium text-black">{q.question}</p>
                </div>

                {/* Answers */}
                <div className="ml-6 text-sm">
                  <p className="text-gray-700">
                    Your Answer:{" "}
                    <span
                      className={
                        q.isCorrect ? "text-green-700" : "text-red-700"
                      }
                    >
                      {q.userAnswer || "No answer"}
                    </span>
                  </p>
                  {!q.isCorrect && (
                    <p className="text-gray-700">
                      Correct Answer: <strong>{q.answer}</strong>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      {/* Start New Quiz Button */}
      {!hideStartNew && (
        <CardFooter>
          <Button onClick={onstartNew} className="w-full">
            Start New Quiz
          </Button>
        </CardFooter>
      )}
    </div>
  );
};

export default QuizResult;
