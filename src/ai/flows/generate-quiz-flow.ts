'use server';
/**
 * @fileOverview Um fluxo de IA para gerar um questionário com base no título e descrição de um curso.
 *
 * - generateQuiz - Gera um questionário a partir do título e da descrição de um curso.
 * - GenerateQuizInput - O tipo de entrada para a função generateQuiz.
 * - GenerateQuizOutput - O tipo de retorno para a função generateQuiz.
 */

import { ai } from '@/ai/genkit';
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
});

const GenerateQuizOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('Um banco de questões com aproximadamente 15 perguntas para o questionário.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;


export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GenerateQuizOutputSchema },
  prompt: `Você é um especialista em design instrucional encarregado de criar conteúdo educacional para uma plataforma de e-learning corporativa.

Sua tarefa é criar um grande banco de questões de múltipla escolha com base no conteúdo de um curso fornecido.

Gere um banco de questões relevante com 15 perguntas. Cada pergunta deve ter 4 opções, e uma delas deve ser a resposta correta. As perguntas devem testar a compreensão dos principais conceitos apresentados.

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

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async (input) => {
    const maxRetries = 3;
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { output } = await prompt(input);
        // If the call succeeds with valid output, return immediately.
        if (output) {
          return output;
        }
        // If output is null/undefined, treat it as an error to trigger a retry.
        throw new Error('A IA retornou uma resposta vazia.');
      } catch (error: any) {
        lastError = error;
        const isOverloaded =
          error.message?.includes('503') ||
          error.message?.toLowerCase().includes('overloaded');
        
        if (isOverloaded && attempt < maxRetries) {
          // Use exponential backoff for retries: 1s, 2s
          const delay = 1000 * (2 ** (attempt - 1));
          console.log(
            `Tentativa ${attempt}/${maxRetries} falhou por sobrecarga. Tentando novamente em ${delay / 1000}s...`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          // Re-throw the error if it's not recoverable or if we've run out of retries.
          console.error(`Geração do questionário falhou após ${attempt} tentativas. Erro final:`, error);
          throw error;
        }
      }
    }
    
    // This fallback should ideally not be reached.
    throw lastError || new Error('Falha ao gerar o questionário após múltiplas tentativas.');
  }
);
