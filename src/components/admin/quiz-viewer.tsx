import type { Quiz, QuestionDifficulty } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';


interface QuizViewerProps {
    quiz: Quiz;
    courseTitle: string;
}

const difficultyBadgeColor: Record<QuestionDifficulty, string> = {
    'Fácil': 'bg-green-500/80 hover:bg-green-500/90',
    'Intermediário': 'bg-amber-500/80 hover:bg-amber-500/90',
    'Difícil': 'bg-red-600/80 hover:bg-red-600/90',
};


export function QuizViewer({ quiz, courseTitle }: QuizViewerProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <div>
                <CardTitle>Questionário Salvo para: {courseTitle}</CardTitle>
                <CardDescription>
                    Este é o questionário atualmente salvo para o curso. Para gerar um novo, use a ferramenta de IA abaixo. Salvar um novo questionário substituirá este.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[60vh] space-y-4 overflow-y-auto p-1 pr-4">
          {quiz.questions.map((q, index) => (
            <div key={index} className="space-y-2 rounded-lg border bg-muted/10 p-4">
              <div className="flex justify-between items-start">
                <p className="font-semibold pr-4">
                  {index + 1}. {q.text}
                </p>
                {q.difficulty && (
                    <Badge className={cn("text-xs", difficultyBadgeColor[q.difficulty])}>
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
                        ? 'font-bold text-green-700 dark:text-green-400'
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
      </CardContent>
    </Card>
  );
}
