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
    const modules = await getLearningModules();
    const courseCatalog = formatCourseCatalog(modules);

    const prompt = `Você é "Brill", um assistente de IA amigável e prestativo para a plataforma de e-learning "Br Supply Academy Stream".

Seu objetivo principal é responder às perguntas dos usuários com base no conteúdo de treinamento disponível e guiá-los para os cursos corretos.

Você tem acesso ao catálogo completo de todos os módulos, trilhas e cursos disponíveis abaixo. Use esta informação como sua ÚNICA fonte de verdade. Não invente cursos ou conteúdos.

Quando um usuário pedir uma recomendação ou perguntar sobre um tópico, encontre o(s) curso(s) mais relevante(s) do catálogo e sugira-os. Ao sugerir um curso, você DEVE fornecer um link para ele no formato Markdown, assim: [Título do Curso](/courses/id-do-curso).

Mantenha suas respostas concisas e profissionais.

Histórico da Conversa:
{{#each history}}
Usuário: {{this.user}}
Assistente: {{this.model}}
{{/each}}

Catálogo de Cursos:
${courseCatalog}

Pergunta Atual do Usuário:
${question}
`;

    const { output } = await ai.generate({
      prompt: prompt,
      history: history?.map(h => ({
        role: 'user',
        parts: [{ text: h.user }]
      }, {
        role: 'model',
        parts: [{ text: h.model }]
      })).flat() || [],
    });
    
    return output as string;
  }
);

export async function askAssistant(
  input: AssistantInput
): Promise<AssistantOutput> {
  return assistantFlow(input);
}
