
'use server';
/**
 * @fileOverview Um fluxo de IA para gerar um questionário com base no título e descrição de um curso.
 *
 * - generateQuiz - Gera um questionário a partir do título e da descrição de um curso.
 * - GenerateQuizInput - O tipo de entrada para a função generateQuiz.
 * - GenerateQuizOutput - O tipo de retorno para a função generateQuiz.
 */

import { ai } from '@/ai/genkit';
import type { QuestionDifficulty } from '@/lib/types';
import { z } from 'genkit';

const GenerateQuizInputSchema = z.object({
  title: z.string().describe('O título do curso.'),
  description: z.string().describe('A descrição detalhada do curso.'),
  transcript: z.string().optional().describe('A transcrição ou legenda completa do conteúdo do vídeo.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const QuestionSchema = z.object({
    text: z.string().describe('O texto da pergunta do questionário.'),
    options: z.array(z.string()).length(4).describe('Uma lista de exatamente 4 respostas possíveis.'),
    correctAnswer: z.string().describe('A resposta correta, que deve ser uma das strings no array de opções.'),
    difficulty: z.enum(['Fácil', 'Intermediário', 'Difícil']).describe('O nível de dificuldade da pergunta.'),
});

const GenerateQuizOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('Um banco de questões com aproximadamente 40 perguntas para o questionário.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;


export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GenerateQuizOutputSchema },
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `Você é um especialista em design instrucional encarregado de criar conteúdo educacional para uma plataforma de e-learning corporativa.

Sua tarefa é criar um banco de questões de múltipla escolha com base no conteúdo de um curso fornecido.

Gere um banco de aproximadamente 40 perguntas. Cada pergunta deve ter 4 opções, e uma delas deve ser a resposta correta. As perguntas devem testar a compreensão dos principais conceitos apresentados.

Para cada pergunta, você deve atribuir um nível de dificuldade: 'Fácil', 'Intermediário' ou 'Difícil'. Tente criar uma distribuição equilibrada entre os níveis de dificuldade.

{{#if transcript}}
Use a seguinte transcrição do vídeo como a fonte PRIMÁRIA de informação para criar as perguntas. O título e a descrição podem ser usados como contexto adicional.
Transcrição do Vídeo: {{{transcript}}}
{{else}}
Você não tem acesso ao vídeo, então deve basear as perguntas estritamente no título e na descrição fornecidos.
{{/if}}

Título do Curso: {{{title}}}
Descrição do Curso: {{{description}}}

Seu resultado deve ser um objeto JSON que siga estritamente o esquema de saída fornecido.`,
});

// Helper function to shuffle an array in-place
const shuffleArray = <T,>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async (input) => {
    // This retry logic is necessary to handle transient API errors like 503 or 429.
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { output } = await prompt(input);
        
        // If the call succeeds with valid output, process and return.
        if (output) {
          // Shuffle the options for each question to avoid predictability
          output.questions.forEach(question => {
            question.options = shuffleArray(question.options);
          });
          return output;
        }
      } catch (e: any) {
        // Log the error for debugging.
        console.error(`Attempt ${attempt} failed:`, e.message);

        // If it's the last attempt, throw a final, user-friendly error.
        if (attempt === maxRetries) {
          throw new Error('A IA não conseguiu gerar o questionário após várias tentativas. O serviço pode estar sobrecarregado. Por favor, tente novamente mais tarde.');
        }

        // Exponential backoff: wait 1s, then 2s.
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // This part should be unreachable if the loop is correct, but it's a safeguard.
    throw new Error('A IA não retornou um questionário. A resposta pode ter sido bloqueada ou estar vazia. Tente novamente com um conteúdo diferente.');
  }
);
