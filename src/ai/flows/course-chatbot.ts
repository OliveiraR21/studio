'use server';

/**
 * @fileOverview Implements a conversational AI chatbot for course recommendations.
 * - courseChatbot - A flow that responds to user queries about courses.
 * - CourseChatbotInput - The input type for the courseChatbot function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Message } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  parts: z.array(z.object({
    text: z.string(),
  })),
});

const CourseChatbotInputSchema = z.object({
  history: z.array(MessageSchema).describe('The conversation history.'),
  availableCourses: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()).optional(),
      })
    )
    .describe('A list of available training modules.'),
});
export type CourseChatbotInput = z.infer<typeof CourseChatbotInputSchema>;

export async function courseChatbot(input: CourseChatbotInput): Promise<string> {
    return courseChatbotFlow(input);
}


const courseChatbotFlow = ai.defineFlow(
  {
    name: 'courseChatbotFlow',
    inputSchema: CourseChatbotInputSchema,
    outputSchema: z.string(),
  },
  async ({ history, availableCourses }) => {
    const llmResponse = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        system: `Você é um "Assistente de Carreira" amigável e prestativo para a plataforma Br Supply Academy.
Sua principal função é conversar com os usuários, entender suas necessidades de aprendizado e recomendar cursos relevantes da lista fornecida.
Responda de forma concisa e útil. Se um curso específico for uma boa opção, mencione o título e explique brevemente por que ele é relevante. Não invente cursos que não existem na lista.
Seja sempre cordial e encorajador.

Aqui está a lista de cursos disponíveis para sua referência:
${JSON.stringify(availableCourses, null, 2)}
`,
        history: history as Message[],
    });

    return llmResponse.text;
  }
);
