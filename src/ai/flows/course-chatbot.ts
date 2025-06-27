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
    // The history must alternate between user and model messages.
    // The Gemini API requires the history to start with a user message.
    // We'll remove any leading model messages to ensure correctness.
    let conversationHistory = [...history];
    while (conversationHistory.length > 0 && conversationHistory[0].role === 'model') {
      conversationHistory.shift();
    }

    const llmResponse = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        system: `Você é um "Assistente de Carreira" amigável e prestativo para a plataforma Br Supply Academy.
Sua principal função é conversar com os usuários, entender suas necessidades de aprendizado e recomendar cursos relevantes da lista fornecida.
Responda de forma concisa e útil. Se um curso específico for uma boa opção, mencione o título e explique brevemente por que ele é relevante. Não invente cursos que não existem na lista.
Seja sempre cordial e encorajador.

Aqui está a lista de cursos disponíveis para sua referência:
${JSON.stringify(availableCourses, null, 2)}
`,
        history: conversationHistory as Message[],
        config: {
            safetySettings: [
              {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_ONLY_HIGH',
              },
              {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_NONE',
              },
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE',
              },
              {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_LOW_AND_ABOVE',
              },
            ],
        },
    });

    return llmResponse.text;
  }
);
