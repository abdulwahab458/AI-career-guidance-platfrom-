"use client";

import { useEffect, useState } from "react";
import useFetch from "./hooks/use-fetch";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { BarLoader } from "react-spinners";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import QuizResult from "./QuizResult";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  // fetch hook for generating quiz (calls API route)
  const callGenerate = async () => {
    const res = await fetch('/api/interview/generate', { method: 'POST', credentials: 'same-origin' });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to generate quiz');
    }
    const json = await res.json();
    return json.questions || json;
  };

  const {
    loading: generatingQuiz,
    fn: generateQuizfn,
    data: quizData,
    error,
  } = useFetch(callGenerate);

  // fetch hook for saving results (calls API route)
  const callSave = async (questions, answers, score) => {
    const res = await fetch('/api/interview/save', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions, answers, score }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to save quiz results');
    }
    return await res.json();
  };

  const {
    loading: savingResult,
    fn: saveQuizResultsfn,
    data: resultData,
    setdata: setResultsData,
  } = useFetch(callSave);

  

  // initialize answer array when new quiz data arrives
  useEffect(() => {
    if (quizData && quizData.length > 0) {
      setAnswers(new Array(quizData.length).fill(null));
      setCurrentQuestion(0);
      setSelected(null);
    }
  }, [quizData]);

  // handle selecting an answer
  const handleSelect = (value) => {
    setSelected(value);
  };

  // calculate score (%)
  const calcScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === quizData[index].correctAnswer) {
        correct++;
      }
    });
    return (correct / quizData.length) * 100;
  };

  // finish quiz and save results
  const finishQuiz = async () => {
    const score = calcScore();

    try {
      await saveQuizResultsfn(quizData, answers, score);
      toast.success("Quiz Completed!");
    } catch (error) {
      toast.error(error.message || "Failed to save quiz results");
    }
  };

  // go to next question
  const handleNext = async () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = selected;
    setAnswers(updatedAnswers);
    setSelected(null);

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // last question → save results
      finishQuiz();
    }
  };

  const startNewQuiz = () =>{
    setCurrentQuestion(0);
    setAnswers([]);
    generateQuizfn();
    setResultsData(null);
  }

  if (generatingQuiz) {
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-4">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
        <div className="w-3 h-3 bg-blue-300 rounded-full animate-bounce [animation-delay:0.4s]" />
      </div>
      <p className="text-sm text-neutral-400">Hold on tight while your quiz is being generated...</p>
    </div>
  );
}

  if(resultData){
    return(
      <div className="mx-2">
        <QuizResult result={resultData} onStartNew={startNewQuiz}/>
      </div>
    )
  }

  // show loader when saving results after last question
  if (savingResult) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-10">
        <p className="text-lg font-medium mb-3">Saving your results...</p>
        <BarLoader width={"80%"} color="grey" />
      </div>
    );
  }

  // handle errors
  if (error) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">
            {error.message || "Something went wrong."}
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={generateQuizfn}>
            Retry
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // show pre-quiz screen
  if (!quizData) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Test Your Knowledge</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This quiz will have 10 questions related to your industry.</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={generateQuizfn}>
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // show question content
  const question = quizData[currentQuestion];

  return (
    <Card className="mx-2">
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1} of {quizData.length}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium mb-4">{question.question}</p>

        <RadioGroup
          value={selected || ""}
          onValueChange={handleSelect}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>

      <CardFooter>
        {selected ? (
          <Button className="w-full" onClick={handleNext}>
            {currentQuestion < quizData.length - 1 ? "Next" : "Finish"}
          </Button>
        ) : (
          <Button className="w-full" disabled>
            Select an Option
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Quiz;
