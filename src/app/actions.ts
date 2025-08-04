'use server';

import { simplifyEquation, type SimplifyEquationOutput } from '@/ai/flows/simplify-equation';
import { z } from 'zod';

const EquationSchema = z.object({
  equation: z.string().min(1, { message: 'Equation cannot be empty.' }),
});

export interface EquationSimplifierState {
  result?: SimplifyEquationOutput;
  error?: string;
}

export async function getSimplifiedEquation(
  prevState: EquationSimplifierState,
  formData: FormData
): Promise<EquationSimplifierState> {

  const validatedFields = EquationSchema.safeParse({
    equation: formData.get('equation'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.equation?.join(', '),
    };
  }

  try {
    const result = await simplifyEquation({ equation: validatedFields.data.equation });
    return { result };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred while simplifying the equation. Please try again.' };
  }
}
