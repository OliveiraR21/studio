"use client";

import { useState } from 'react';
import type { Quiz } from '@/lib/types';
import { generateQuiz } from '@/ai/flows/generate-quiz-flow';
import { saveQuiz } from '@/actions/course-actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Wand2, Loader2, Save, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface QuizGeneratorProps {
  courseId: string;
  title: string;
  description: string;
}

export function QuizGenerator({ courseId, title, description }: QuizGeneratorProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);
  const [transcript, setTranscript] = useState("");

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedQuiz(null);

    try {
      const result = await generateQuiz({ title, description, transcript });
      setGeneratedQuiz(result);
      toast({
        title: 'Questionário gerado!',
        description:
          'Revise as perguntas e salve se estiverem de acordo.',
      });
    } catch (error) {
      console.error('AI quiz generation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Ocorreu um erro',
        description:
          'Não foi possível gerar o questionário. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedQuiz) return;
    setIsSaving(true);
    
    try {
      const result = await saveQuiz(courseId, generatedQuiz);

      if (result.success) {
        toast({
          title: "Sucesso!",
          description: result.message,
        });
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
            description:
            'Não foi possível salvar o questionário. Tente novamente.',
        });
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <div className="flex items-center gap-3">
            <Wand2 className="h-6 w-6 text-primary" />
            <div>
                <CardTitle>Gerador de Questionário com IA</CardTitle>
                <CardDescription>
                Crie um questionário automaticamente com base no título e descrição do curso, ou forneça uma transcrição para maior precisão.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 font-semibold">A IA está gerando as perguntas... Por favor, aguarde.</p>
          </div>
        )}

        {!isLoading && !generatedQuiz && (
            <div className="flex flex-col items-center justify-center gap-4 text-center p-4">
                <div className="w-full space-y-2 text-left">
                  <Label htmlFor="transcript">Transcrição do Vídeo (Opcional)</Label>
                  <Textarea
                    id="transcript"
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Cole a legenda ou um resumo detalhado do conteúdo do vídeo aqui para obter perguntas mais precisas e aprofundadas."
                    rows={6}
                    className="bg-background/50"
                  />
                  <p className="text-xs text-muted-foreground">Se este campo for deixado em branco, a IA usará apenas o título e a descrição.</p>
                </div>
                <Button onClick={handleGenerate} className="mt-4">
                    <Wand2 className="mr-2 h-4 w-4" />
                    Gerar Questionário
                </Button>
            </div>
        )}

        {!isLoading && generatedQuiz && (
          <div className="space-y-6">
            <Alert>
              <AlertTitle>Revise o Questionário</AlertTitle>
              <AlertDescription>
                As perguntas foram geradas por IA. Verifique se estão corretas e fazem sentido antes de salvar.
              </AlertDescription>
            </Alert>
            <div className="space-y-4 max-h-[50vh] overflow-y-auto p-1 pr-4">
              {generatedQuiz.questions.map((q, index) => (
                <div key={index} className="space-y-2 rounded-lg border bg-background p-4">
                  <p className="font-semibold">
                    {index + 1}. {q.text}
                  </p>
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
      </CardContent>
       {generatedQuiz && !isLoading && (
        <CardFooter className="flex justify-end gap-3 border-t pt-6">
            <Button variant="ghost" onClick={handleGenerate} disabled={isSaving}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Gerar Novamente
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isSaving ? 'Salvando...' : 'Salvar Questionário'}
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
