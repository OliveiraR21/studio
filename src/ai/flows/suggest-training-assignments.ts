'use server';

/**
 * @fileOverview This file implements an AI-powered tool that suggests appropriate training assignments for new users in a group,
 * considering their role and completed training, to avoid duplication and ensure relevant training is assigned automatically.
 *
 * - suggestTrainingAssignments - A function that suggests training assignments for a user.
 * - SuggestTrainingAssignmentsInput - The input type for the suggestTrainingAssignments function.
 * - SuggestTrainingAssignmentsOutput - The return type for the suggestTrainingAssignments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTrainingAssignmentsInputSchema = z.object({
  userRole: z.string().describe('The role of the user in the group.'),
  completedTraining: z.array(z.string()).describe('A list of IDs of training modules already completed by the user.'),
  availableTraining: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
  })).describe('A list of available training modules with their IDs, titles, descriptions, and optional tags.'),
});
export type SuggestTrainingAssignmentsInput = z.infer<typeof SuggestTrainingAssignmentsInputSchema>;

const SuggestTrainingAssignmentsOutputSchema = z.object({
  suggestedTrainingIds: z.array(z.string()).describe('A list of IDs of training modules suggested for the user, excluding those already completed.'),
});
export type SuggestTrainingAssignmentsOutput = z.infer<typeof SuggestTrainingAssignmentsOutputSchema>;

export async function suggestTrainingAssignments(input: SuggestTrainingAssignmentsInput): Promise<SuggestTrainingAssignmentsOutput> {
  return suggestTrainingAssignmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTrainingAssignmentsPrompt',
  input: {schema: SuggestTrainingAssignmentsInputSchema},
  output: {schema: SuggestTrainingAssignmentsOutputSchema},
  prompt: `You are an AI assistant that suggests relevant training assignments for new users in a group, considering their role and completed training.

  The user's role is: {{{userRole}}}
  The user has completed the following training modules (IDs): {{#if completedTraining}}{{{completedTraining}}}{{else}}None{{/if}}
  Available training modules are:
  {{#each availableTraining}}
  - ID: {{{this.id}}}, Title: {{{this.title}}}, Description: {{{this.description}}}, Tags: {{#if this.tags}}{{{this.tags}}}{{else}}None{{/if}}
  {{/each}}

  Based on the user's role and completed training, suggest the most relevant training modules (by ID) from the available training modules, excluding those already completed.  Return only the list of IDs.
  Ensure that the suggested training aligns with the user's role and is not redundant with their completed training.
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
