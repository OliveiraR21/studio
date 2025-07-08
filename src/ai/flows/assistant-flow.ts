'use server';
/**
 * @fileOverview Um fluxo de IA para um assistente de chat que ajuda os usuários a navegar pela plataforma.
 *
 * - askAssistant - Responde a perguntas do usuário com base no conteúdo do curso.
 * - AssistantInput - O tipo de entrada para a função askAssistant.
 * - AssistantOutput - O tipo de retorno para a função askAssistant.
 */

import { ai } from '@/ai/genkit';
import { getLearningModules } from '@/lib/data-access';
import type { Course, Module, Track } from '@/lib/types';
import { z } from 'genkit';

const AssistantInputSchema = z.object({
  question: z.string().describe('A pergunta atual do usuário.'),
  history: z
    .array(z.object({ user: z.string(), model: z.string() }))
    .optional()
    .describe('O histórico da conversa anterior.'),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

export type AssistantOutput = string;

function formatCourseCatalog(modules: Module[]): string {
  let catalog = '';
  modules.forEach((module) => {
    catalog += `Módulo: ${module.title}\n`;
    module.tracks.forEach((track) => {
      catalog += `  - Trilha: ${track.title}\n`;
      track.courses.forEach((course) => {
        catalog += `    - Curso: "${course.title}" (ID: ${course.id})\n`;
      });
    });
    catalog += '\n';
  });
  return catalog;
}

const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: z.string(),
  },
  async ({ question, history }) => {
    const maxRetries = 3;
    let lastError: Error | undefined;

    const modules = await getLearningModules();
    const courseCatalog = formatCourseCatalog(modules);

    // The prompt now only contains the core instructions and the course catalog.
    // The conversation history is passed separately in the `history` parameter.
    const prompt = `Você é "Brill", um assistente de IA amigável e prestativo para a plataforma de e-learning "Br Supply Academy Stream".

Seu objetivo principal é responder às perguntas dos usuários com base no conteúdo de treinamento disponível e guiá-los para os cursos corretos.

Você tem acesso ao catálogo completo de todos os módulos, trilhas e cursos disponíveis abaixo. Use esta informação como sua ÚNICA fonte de verdade. Não invente cursos ou conteúdos.

Quando um usuário pedir uma recomendação ou perguntar sobre um tópico, encontre o(s) curso(s) mais relevante(s) do catálogo e sugira-os. Ao sugerir um curso, você DEVE fornecer um link para ele no formato Markdown, assim: [Título do Curso](/courses/id-do-curso).

Mantenha suas respostas concisas e profissionais. O histórico da conversa é fornecido separadamente para contexto.

Catálogo de Cursos:
${courseCatalog}

Pergunta Atual do Usuário:
${question}
`;
    
    const generateConfig = {
        prompt: prompt,
        history: history?.map(h => ([
            { role: 'user' as const, parts: [{ text: h.user }] },
            { role: 'model' as const, parts: [{ text: h.model }] }
        ])).flat() || [],
    };

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const { output } = await ai.generate(generateConfig);
            
            if (output) {
                return output as string;
            }
            throw new Error('A IA retornou uma resposta vazia.');

        } catch (error: any) {
            lastError = error;
            const isOverloaded =
              error.message?.includes('503') ||
              error.message?.toLowerCase().includes('overloaded');
            
            if (isOverloaded && attempt < maxRetries) {
              const delay = 1000 * (2 ** (attempt - 1));
              console.log(
                `Tentativa do assistente ${attempt}/${maxRetries} falhou por sobrecarga. Tentando novamente em ${delay / 1000}s...`
              );
              await new Promise((resolve) => setTimeout(resolve, delay));
            } else {
              console.error(`Geração do assistente falhou após ${attempt} tentativas. Erro final:`, error);
              throw error;
            }
        }
    }
    
    throw lastError || new Error('Falha ao gerar resposta do assistente após múltiplas tentativas.');
  }
);

export async function askAssistant(
  input: AssistantInput
): Promise<AssistantOutput> {
  return assistantFlow(input);
}
