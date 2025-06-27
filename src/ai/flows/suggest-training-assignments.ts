'use server';

/**
 * @fileOverview Este arquivo implementa uma ferramenta com IA que sugere atribuições de treinamento apropriadas para novos usuários em um grupo,
 * considerando sua função, área e treinamentos concluídos, para evitar duplicação e garantir que treinamentos relevantes sejam atribuídos automaticamente.
 *
 * - suggestTrainingAssignments - Uma função que sugere atribuições de treinamento para um usuário.
 * - SuggestTrainingAssignmentsInput - O tipo de entrada para a função suggestTrainingAssignments.
 * - SuggestTrainingAssignmentsOutput - O tipo de retorno para a função suggestTrainingAssignments.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { UserRole } from '@/lib/types';

const SuggestTrainingAssignmentsInputSchema = z.object({
  userRole: z.string().describe('A função do usuário no grupo.'),
  userArea: z.string().describe('A área do usuário no grupo.'),
  completedTraining: z.array(z.string()).describe('Uma lista de IDs de módulos de treinamento já concluídos pelo usuário.'),
  availableTraining: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
    accessRoles: z.array(z.string()).optional(),
    accessAreas: z.array(z.string()).optional(),
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
  prompt: `Você é um assistente de IA especialista em desenvolvimento de carreira. Sua tarefa é sugerir os treinamentos mais relevantes para um usuário com base em sua função e histórico.

- Função do Usuário: {{{userRole}}}
- Área do Usuário: {{{userArea}}}
- Treinamentos Concluídos (IDs): {{#if completedTraining}}{{{json completedTraining}}}{{else}}Nenhum{{/if}}

- Cursos Pré-filtrados para este usuário (disponíveis para sua área e cargo com base na hierarquia):
{{#each availableTraining}}
  - ID: {{{this.id}}}, Título: {{{this.title}}}, Descrição: {{{this.description}}}, Tags: {{#if this.tags}}{{{json this.tags}}}{{else}}Nenhuma{{/if}}
{{/each}}

Analise a lista de cursos pré-filtrados e sugira os mais importantes para a função do usuário.
- Exclua os cursos que o usuário já concluiu.
- Retorne apenas a lista de IDs dos cursos sugeridos.
  `,
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

const hierarchy: UserRole[] = ['Assistente', 'Analista', 'Supervisor', 'Coordenador', 'Gerente', 'Diretor', 'Admin'];

const suggestTrainingAssignmentsFlow = ai.defineFlow(
  {
    name: 'suggestTrainingAssignmentsFlow',
    inputSchema: SuggestTrainingAssignmentsInputSchema,
    outputSchema: SuggestTrainingAssignmentsOutputSchema,
  },
  async (input) => {
    const userRoleIndex = hierarchy.indexOf(input.userRole as UserRole);

    const filteredTraining = input.availableTraining.filter(course => {
      // 1. Filter by Area
      if (course.accessAreas && course.accessAreas.length > 0) {
        if (!input.userArea || !course.accessAreas.includes(input.userArea)) {
          return false;
        }
      }

      // 2. Filter by Role Hierarchy
      if (course.accessRoles && course.accessRoles.length > 0) {
        // The user must have a role that is at least as high as one of the required roles.
        const hasAccess = course.accessRoles.some(requiredRole => {
          const requiredRoleIndex = hierarchy.indexOf(requiredRole as UserRole);
          return requiredRoleIndex !== -1 && userRoleIndex >= requiredRoleIndex;
        });
        if (!hasAccess) {
          return false;
        }
      }
      
      // If we pass all filters, the course is available
      return true;
    });

    const { output } = await prompt({
        ...input,
        availableTraining: filteredTraining,
    });

    return output!;
  }
);
