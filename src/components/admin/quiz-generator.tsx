

"use client";

import { useState, useEffect, useImperativeHandle, forwardRef, useTransition } from 'react';
import type { Quiz, QuestionDifficulty } from '@/lib/types';
import { generateQuiz, type GenerateQuizResult } from '@/ai/flows/generate-quiz-flow';
import { saveQuiz } from '@/actions/course-actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Wand2 } from 'lucide-react';

interface QuizGeneratorProps {
  courseId: string;
  title: string;
  description: string;
  hasExistingQuiz: boolean;
  transcript?: string;
  onQuizSaved?: () => void;
  onGenerateClick?: () => void;
}

export interface QuizGeneratorHandles {
  save: () => void;
  generate: () => void;
  regenerate: () => void;
  isSaving: boolean;
  isGenerating: boolean;
  hasGeneratedQuiz: boolean;
}

const difficultyBadgeColor: Record<QuestionDifficulty, string> = {
    'Fácil': 'bg-green-500/80 hover:bg-green-500/90',
    'Intermediário': 'bg-amber-500/80 hover:bg-amber-500/90',
    'Difícil': 'bg-red-600/80 hover:bg-red-600/90',
};

export const QuizGenerator = forwardRef<QuizGeneratorHandles, QuizGeneratorProps>(
  ({ courseId, title, description, hasExistingQuiz, transcript: initialTranscript, onQuizSaved, onGenerateClick }, ref) => {
    const { toast } = useToast();
    const router = useRouter();
    const [isGenerating, startGenerating] = useTransition();
    const [isSaving, startSaving] = useTransition();

    const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);
    const [transcript, setTranscript] = useState(initialTranscript || "");

    useEffect(() => {
      if (initialTranscript) {
        setTranscript(initialTranscript);
      }
    }, [initialTranscript]);

    const handleGenerate = async () => {
      startGenerating(async () => {
        setGeneratedQuiz(null);

        const result: GenerateQuizResult = await generateQuiz({ title, description, transcript });
        
        if (result.success) {
          setGeneratedQuiz(result.quiz);
          toast({
            title: 'Questionário gerado!',
            description: 'Revise as perguntas e salve se estiverem de acordo.',
          });
        } else {
          console.error('AI quiz generation failed:', result.message);
          toast({
            variant: 'destructive',
            title: 'Ocorreu um erro na Geração',
            description: result.message,
          });
        }
      });
    };
    
    // Allow external trigger for generation (from the new parent component)
    const triggerGenerate = onGenerateClick || handleGenerate;

    const handleSave = async () => {
      if (!generatedQuiz) return;
      startSaving(async () => {
        try {
          const result = await saveQuiz(courseId, generatedQuiz);

          if (result.success) {
            toast({
              title: "Sucesso!",
              description: result.message,
            });
            setGeneratedQuiz(null);
            router.refresh();
            if (onQuizSaved) onQuizSaved();
          } else {
            toast({
              variant: "destructive",
              title: "Erro ao Salvar",
              description: result.message,
            });
          }
        } catch (error) {
            console.error('Failed to save quiz:', error);
            toast({
                variant: 'destructive',
                title: 'Ocorreu um erro',
                description: 'Não foi possível salvar o questionário. Tente novamente.',
            });
        }
      });
    };

    useImperativeHandle(ref, () => ({
      save: handleSave,
      generate: handleGenerate,
      regenerate: handleGenerate,
      isSaving: isSaving,
      isGenerating: isGenerating,
      hasGeneratedQuiz: !!generatedQuiz,
    }));

    return (
      <div className="flex-grow overflow-y-auto pr-4 -mr-4">
        {isGenerating && (
          <div className="flex flex-col items-center justify-center p-8 text-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 font-semibold mt-4">A IA está gerando as perguntas... Por favor, aguarde.</p>
            <p className="text-sm text-muted-foreground">Isso pode levar até 30 segundos.</p>
          </div>
        )}

        {!isGenerating && !generatedQuiz && (
            <div className="flex flex-col items-center justify-center gap-4 text-center p-4">
                <div className="w-full space-y-2 text-left">
                  <Label htmlFor="transcript">Transcrição do Vídeo (Opcional, mas recomendado)</Label>
                  <Textarea
                    id="transcript"
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Cole a legenda ou um resumo detalhado do conteúdo do vídeo aqui para obter perguntas mais precisas e aprofundadas. Se uma URL do YouTube foi usada, este campo pode ter sido preenchido automaticamente."
                    rows={8}
                    className="bg-background/50"
                  />
                  <p className="text-xs text-muted-foreground">Se este campo for deixado em branco, a IA usará apenas o título e a descrição do curso.</p>
                </div>
                <Button onClick={triggerGenerate} className="mt-4">
                    <Wand2 className="mr-2 h-4 w-4" />
                    {hasExistingQuiz ? 'Gerar Novo Questionário' : 'Gerar Questionário'}
                </Button>
            </div>
        )}

        {!isGenerating && generatedQuiz && (
          <div className="space-y-6">
            <Alert>
              <AlertTitle>Revise o Questionário Gerado</AlertTitle>
              <AlertDescription>
                Verifique se as perguntas e respostas estão corretas antes de salvar. Você pode gerar novamente se não estiver satisfeito.
              </AlertDescription>
            </Alert>
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
              {generatedQuiz.questions.map((q, index) => (
                <div key={index} className="space-y-2 rounded-lg border bg-background p-4">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold pr-4">
                      {index + 1}. {q.text}
                    </p>
                    {q.difficulty && (
                        <Badge className={cn("text-xs shrink-0", difficultyBadgeColor[q.difficulty])}>
                            {q.difficulty}
                        </Badge>
                    )}
                  </div>
                  <ul className="space-y-1 text-sm">
                    {q.options.map((opt, optIndex) => (
                      <li
                        key={optIndex}
                        className={cn(
                          'p-1 rounded',
                          opt === q.correctAnswer
                            ? 'font-bold bg-green-500/10 text-green-700 dark:text-green-400'
                            : 'text-muted-foreground'
                        )}
                      >
                        - {opt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

QuizGenerator.displayName = 'QuizGenerator';
