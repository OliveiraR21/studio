'use server';

/**
 * @fileOverview Este arquivo implementa uma ferramenta com IA que sugere atribuições de treinamento apropriadas para novos usuários em um grupo,
 * considerando sua função e treinamentos concluídos, para evitar duplicação e garantir que treinamentos relevantes sejam atribuídos automaticamente.
 *
 * - suggestTrainingAssignments - Uma função que sugere atribuições de treinamento para um usuário.
 * - SuggestTrainingAssignmentsInput - O tipo de entrada para a função suggestTrainingAssignments.
 * - SuggestTrainingAssignmentsOutput - O tipo de retorno para a função suggestTrainingAssignments.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTrainingAssignmentsInputSchema = z.object({
  userRole: z.string().describe('A função do usuário no grupo.'),
  completedTraining: z.array(z.string()).describe('Uma lista de IDs de módulos de treinamento já concluídos pelo usuário.'),
  availableTraining: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
  })).describe('Uma lista de módulos de treinamento disponíveis com seus IDs, títulos, descrições e tags opcionais.'),
});
export type SuggestTrainingAssignmentsInput = z.infer<typeof SuggestTrainingAssignmentsInputSchema>;

const SuggestTrainingAssignmentsOutputSchema = z.object({
  suggestedTrainingIds: z.array(z.string()).describe('Uma lista de IDs de módulos de treinamento sugeridos para o usuário, excluindo aqueles já concluídos.'),
});
export type SuggestTrainingAssignmentsOutput = z.infer<typeof SuggestTrainingAssignmentsOutputSchema>;

export async function suggestTrainingAssignments(input: SuggestTrainingAssignmentsInput): Promise<SuggestTrainingAssignmentsOutput> {
  return suggestTrainingAssignmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTrainingAssignmentsPrompt',
  input: {schema: SuggestTrainingAssignmentsInputSchema},
  output: {schema: SuggestTrainingAssignmentsOutputSchema},
  prompt: `Você é um assistente de IA que sugere atribuições de treinamento relevantes para novos usuários em um grupo, considerando sua função e treinamentos concluídos.

  A função do usuário é: {{{userRole}}}
  O usuário concluiu os seguintes módulos de treinamento (IDs): {{#if completedTraining}}{{{completedTraining}}}{{else}}Nenhum{{/if}}
  Os módulos de treinamento disponíveis são:
  {{#each availableTraining}}
  - ID: {{{this.id}}}, Título: {{{this.title}}}, Descrição: {{{this.description}}}, Tags: {{#if this.tags}}{{{this.tags}}}{{else}}Nenhuma{{/if}}
  {{/each}}

  Com base na função do usuário e nos treinamentos concluídos, sugira os módulos de treinamento mais relevantes (por ID) a partir dos módulos disponíveis, excluindo os que já foram concluídos. Retorne apenas a lista de IDs.
  Garanta que o treinamento sugerido esteja alinhado com a função do usuário e não seja redundante com os treinamentos já concluídos.
  `,config: {
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

const suggestTrainingAssignmentsFlow = ai.defineFlow(
  {
    name: 'suggestTrainingAssignmentsFlow',
    inputSchema: SuggestTrainingAssignmentsInputSchema,
    outputSchema: SuggestTrainingAssignmentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
