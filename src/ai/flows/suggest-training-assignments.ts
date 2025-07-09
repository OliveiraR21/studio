'use server';
/**
 * @fileOverview Um fluxo de IA para sugerir treinamentos com base no perfil do usuário.
 *
 * - suggestTrainingAssignments - Recomenda cursos para um usuário.
 * - SuggestTrainingInput - O tipo de entrada para a função suggestTrainingAssignments.
 * - SuggestTrainingOutput - O tipo de retorno para a função suggestTrainingAssignments.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestTrainingInputSchema = z.object({
  userRole: z.string().describe('O cargo do usuário (ex: Analista, Gerente).'),
  userArea: z.string().describe('A área ou departamento do usuário (ex: Comercial, Logística).'),
  completedTrainingIds: z.array(z.string()).describe('Uma lista de IDs de cursos que o usuário já concluiu.'),
  availableTraining: z.array(z.object({
      id: z.string().describe('O ID único do curso.'),
      title: z.string().describe('O título do curso.'),
      description: z.string().describe('A descrição do curso.'),
  })).describe('Uma lista de todos os cursos disponíveis que o usuário tem permissão para acessar.'),
});
export type SuggestTrainingInput = z.infer<typeof SuggestTrainingInputSchema>;


const SuggestTrainingOutputSchema = z.object({
  suggestedTrainingIds: z.array(z.string()).describe('Uma lista de 2 a 3 IDs de cursos recomendados.'),
});
export type SuggestTrainingOutput = z.infer<typeof SuggestTrainingOutputSchema>;

export async function suggestTrainingAssignments(input: SuggestTrainingInput): Promise<SuggestTrainingOutput> {
  return suggestTrainingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTrainingPrompt',
  input: { schema: SuggestTrainingInputSchema },
  output: { schema: SuggestTrainingOutputSchema },
  prompt: `Você é um especialista em desenvolvimento profissional e consultor de carreira em uma plataforma de e-learning corporativa.
Sua tarefa é analisar o perfil de um usuário e a lista de cursos disponíveis para recomendar os treinamentos mais relevantes e impactantes para ele.

**Perfil do Usuário:**
- Cargo: {{{userRole}}}
- Área: {{{userArea}}}
- Cursos já concluídos (IDs): {{#each completedTrainingIds}}- {{{this}}}\n{{/each}}

**Cursos Disponíveis (que o usuário pode acessar):**
{{#each availableTraining}}
- ID: {{{id}}}, Título: "{{{title}}}", Descrição: "{{{description}}}"
{{/each}}

**Instruções:**
1.  Analise o cargo e a área do usuário para entender suas responsabilidades e possíveis necessidades de desenvolvimento.
2.  Leve em consideração os cursos que ele já concluiu para evitar redundância. **NÃO recomende cursos que estão na lista de concluídos.**
3.  Com base na análise, selecione de 2 a 3 cursos da lista de "Cursos Disponíveis" que seriam mais benéficos.
4.  Dê preferência a cursos que complementem as habilidades do usuário ou o preparem para o próximo nível em sua carreira.
5.  Seu resultado deve ser um objeto JSON contendo apenas a chave "suggestedTrainingIds" com uma lista dos IDs dos cursos recomendados.`,
});

const suggestTrainingFlow = ai.defineFlow(
  {
    name: 'suggestTrainingFlow',
    inputSchema: SuggestTrainingInputSchema,
    outputSchema: SuggestTrainingOutputSchema,
  },
  async (input) => {
    // Filter out completed courses from the available list before sending to the AI
    const uncompletedCourses = input.availableTraining.filter(
      (course) => !input.completedTrainingIds.includes(course.id)
    );
    
    if (uncompletedCourses.length === 0) {
      return { suggestedTrainingIds: [] };
    }

    const { output } = await prompt({ ...input, availableTraining: uncompletedCourses });
    return output!;
  }
);
