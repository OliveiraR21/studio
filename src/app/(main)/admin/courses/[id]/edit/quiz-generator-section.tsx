
'use client';

import { useRef } from 'react';
import type { Course } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { QuizGenerator, type QuizGeneratorHandles } from '@/components/admin/quiz-generator';
import { Loader2, RefreshCw, Save, Wand2 } from 'lucide-react';

interface QuizGeneratorSectionProps {
  course: Course;
}

export function QuizGeneratorSection({ course }: QuizGeneratorSectionProps) {
  const quizGeneratorRef = useRef<QuizGeneratorHandles>(null);

  const handleGenerateClick = () => {
    quizGeneratorRef.current?.generate();
  };

  const handleSaveClick = () => {
    quizGeneratorRef.current?.save();
  };
  
  const handleRegenerateClick = () => {
     quizGeneratorRef.current?.regenerate();
  }

  const isGenerating = quizGeneratorRef.current?.isGenerating;
  const isSaving = quizGeneratorRef.current?.isSaving;
  const hasGeneratedQuiz = quizGeneratorRef.current?.hasGeneratedQuiz;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Wand2 className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>Gerador de Questionário com IA</CardTitle>
            <CardDescription>
              A IA irá gerar um questionário com base no título, descrição e transcrição do curso. Salvar substituirá qualquer questionário existente.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <QuizGenerator 
            ref={quizGeneratorRef}
            courseId={course.id}
            title={course.title}
            description={course.description}
            hasExistingQuiz={!!course.quiz}
            transcript={course.transcript}
            onGenerateClick={handleGenerateClick}
        />
      </CardContent>
       {hasGeneratedQuiz && (
        <CardFooter className="justify-end gap-2 border-t pt-6">
            <Button 
                variant="ghost" 
                onClick={handleRegenerateClick}
                disabled={isGenerating || !hasGeneratedQuiz}
            >
                <RefreshCw className="mr-2 h-4 w-4" />
                Gerar Novamente
            </Button>
            <Button 
                onClick={handleSaveClick} 
                disabled={isSaving || !hasGeneratedQuiz}
            >
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isSaving ? 'Salvando...' : 'Salvar Questionário'}
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
