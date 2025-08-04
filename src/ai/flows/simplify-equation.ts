'use server';

/**
 * @fileOverview AI-powered equation simplification flow.
 *
 * - simplifyEquation - Simplifies a given complex equation using AI.
 * - SimplifyEquationInput - The input type for the simplifyEquation function.
 * - SimplifyEquationOutput - The return type for the simplifyEquation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimplifyEquationInputSchema = z.object({
  equation: z.string().describe('The complex equation to simplify.'),
});
export type SimplifyEquationInput = z.infer<typeof SimplifyEquationInputSchema>;

const SimplifyEquationOutputSchema = z.object({
  simplifiedEquation: z.string().describe('The simplified version of the equation.'),
  explanation: z.string().describe('An explanation of the simplifications made.'),
});
export type SimplifyEquationOutput = z.infer<typeof SimplifyEquationOutputSchema>;

export async function simplifyEquation(input: SimplifyEquationInput): Promise<SimplifyEquationOutput> {
  return simplifyEquationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simplifyEquationPrompt',
  input: {schema: SimplifyEquationInputSchema},
  output: {schema: SimplifyEquationOutputSchema},
  prompt: `You are an expert mathematician skilled at simplifying complex equations.

  Given the following equation, provide a simplified version and explain the steps taken to simplify it.

  Equation: {{{equation}}}
  `,
});

const simplifyEquationFlow = ai.defineFlow(
  {
    name: 'simplifyEquationFlow',
    inputSchema: SimplifyEquationInputSchema,
    outputSchema: SimplifyEquationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
