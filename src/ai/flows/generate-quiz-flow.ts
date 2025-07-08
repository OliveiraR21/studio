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

type Question = z.infer<typeof QuestionSchema>;

// Schema for the smaller, batched response from the LLM.
const GeneratePartialQuizOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('Um banco de 10 perguntas de múltipla escolha para o questionário.'),
});

// Final output schema for the user-facing function, containing all questions.
const GenerateQuizOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('Um banco de questões com aproximadamente 40 perguntas para o questionário.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;


export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

// This prompt asks for a smaller batch of 10 questions to avoid timeouts.
const batchPrompt = ai.definePrompt({
  name: 'generateQuizBatchPrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GeneratePartialQuizOutputSchema },
  model: 'googleai/gemini-1.5-pro-latest',
  prompt: `Você é um especialista em design instrucional encarregado de criar conteúdo educacional para uma plataforma de e-learning corporativa.

Sua tarefa é criar um banco de questões de múltipla escolha com base no conteúdo de um curso fornecido.

Gere um conjunto relevante de 10 perguntas. Cada pergunta deve ter 4 opções, e uma delas deve ser a resposta correta. As perguntas devem testar a compreensão dos principais conceitos apresentados. Para garantir variedade, evite repetir perguntas que seriam geradas a partir do mesmo conteúdo se você fosse chamado várias vezes.

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
    const allQuestions: Question[] = [];
    const numberOfBatches = 4; // 4 batches * 10 questions = 40

    for (let i = 0; i < numberOfBatches; i++) {
      try {
        const { output } = await batchPrompt(input);
        if (output?.questions) {
          allQuestions.push(...output.questions);
        } else {
          // If a batch returns no questions, something is wrong. Fail fast.
          throw new Error(`O lote ${i + 1} não retornou nenhuma pergunta.`);
        }
      } catch (error) {
        console.error(`Erro ao gerar o lote de questionário ${i + 1}:`, error);
        // If any batch fails, we throw a user-friendly error for the whole process.
        throw new Error('A IA não conseguiu gerar o questionário completo. O serviço pode estar sobrecarregado ou encontrou um erro. Por favor, tente novamente.');
      }
    }

    if (allQuestions.length === 0) {
        throw new Error('A IA não conseguiu gerar nenhuma pergunta.');
    }
    
    // De-duplicate questions, just in case the model repeats itself on different batches.
    const uniqueQuestions = Array.from(new Map(allQuestions.map(q => [q.text, q])).values());

    return { questions: uniqueQuestions };
  }
);
