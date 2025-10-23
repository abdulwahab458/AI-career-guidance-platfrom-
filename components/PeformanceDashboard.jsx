"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Button } from "./ui/button";
import QuizResult from "./QuizResult";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import Noquiz from "./Noquiz";

const PerformanceDashboard = ({ assessments }) => {
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    if (!assessments || assessments.length === 0) {
        return (
            // <div>

            // <p className="text-center text-muted-foreground">
            //     No quizzes taken yet. Start a quiz to see your performance!
                
            // </p>
            // <Link href={"/interprep/mock"}>
            // <Button>
            //     Start Quiz now 
            // </Button>
            // </Link>
            // </div>
            <div>
                <Noquiz/>
            </div>
        );
    }

    // ✅ Helper to get consistent numeric score
    const getScore = (quiz) => {
        const raw = quiz.quizscore ?? quiz.score ?? 0;
        const parsed = parseFloat(raw);
        return isNaN(parsed) ? 0 : parsed;
    };

    // ✅ Prepare data for the performance chart
    const chartData = assessments.map((a, index) => ({
        name: `Quiz ${index + 1}`,
        score: getScore(a),
    }));

    return (
        <div className="space-y-6">
            {/* Performance Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Performance Over Time</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="score"
                                stroke="#2563eb"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Quiz History List */}
            <Card>
                <CardHeader>
                    <CardTitle>Past Quizzes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {assessments.map((quiz, index) => (
                            <div
                                key={quiz.id || index}
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted cursor-pointer transition"
                            >
                                <div>
                                    <p className="font-medium">Quiz {index + 1}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Score: {getScore(quiz).toFixed(1)}%
                                    </p>
                                </div>
                                <Button onClick={() => setSelectedQuiz(quiz)} size="sm">
                                    View Details
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quiz Details Dialog */}
            <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Quiz Results</DialogTitle>
                    </DialogHeader>
                    {selectedQuiz && (
                        <QuizResult
                            result={selectedQuiz}
                            hideStartNew={true}
                            onstartNew={() => setSelectedQuiz(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
            <Link href={'/interprep/mock'}>
                <Button className={"w-full mt-5"}>
                    Start Quiz Now
                </Button>
            </Link>
        </div>
    );
};

export default PerformanceDashboard;
