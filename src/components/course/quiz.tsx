"use client";

import type { Quiz as QuizType } from "@/lib/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle } from "lucide-react";

interface QuizProps {
  quiz: QuizType;
  onQuizComplete: (score: number) => void;
}

export function Quiz({ quiz, onQuizComplete }: QuizProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleValueChange = (questionIndex: number, value: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionIndex]: value }));
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        correctAnswers++;
      }
    });
    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);
    onQuizComplete(finalScore); // Notify parent component
  };

  const handleRetake = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    // Note: onQuizComplete is not called on retake. 
    // It should only be called when a final submission is made.
  }

  // Quiz is now rendered without a surrounding Card by default,
  // to be more flexible.
  return (
    <>
      <div className="space-y-6">
        {quiz.questions.map((question, qIndex) => (
          <div key={qIndex}>
            <p className="font-medium mb-3 flex items-start">
              {submitted && (
                  answers[qIndex] === question.correctAnswer ? 
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" /> : 
                  <XCircle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" />
              )}
              {qIndex + 1}. {question.text}
            </p>
            <RadioGroup
              onValueChange={(value) => handleValueChange(qIndex, value)}
              value={answers[qIndex]}
              disabled={submitted}
            >
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className={`flex items-center space-x-2 p-2 rounded-md ${submitted && option === question.correctAnswer ? 'bg-green-500/20' : ''} ${submitted && answers[qIndex] === option && option !== question.correctAnswer ? 'bg-red-500/20' : ''}`}>
                  <RadioGroupItem value={option} id={`q${qIndex}o${oIndex}`} />
                  <Label htmlFor={`q${qIndex}o${oIndex}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-stretch gap-4 mt-6">
        {submitted ? (
          <>
            <div className="text-center text-lg font-bold">
              Sua Pontuação: {score}%
            </div>
            <Button onClick={handleRetake}>Refazer Questionário</Button>
          </>
        ) : (
          <Button onClick={handleSubmit} disabled={Object.keys(answers).length !== quiz.questions.length}>
            Enviar Respostas
          </Button>
        )}
      </div>
    </>
  );
}
