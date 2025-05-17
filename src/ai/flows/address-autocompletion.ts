// src/ai/flows/address-autocompletion.ts
'use server';

/**
 * @fileOverview Address autocompletion flow using Genkit and Gemini.
 *
 * This file defines a Genkit flow that provides address autocompletion suggestions
 * based on user input.
 *
 * @interface AddressAutocompletionInput - Defines the input schema for the address autocompletion flow.
 * @interface AddressAutocompletionOutput - Defines the output schema for the address autocompletion flow.
 * @function addressAutocompletion - The main function that triggers the address autocompletion flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AddressAutocompletionInputSchema = z.object({
  partialAddress: z
    .string()
    .describe('The partial address entered by the user.'),
});
export type AddressAutocompletionInput = z.infer<
  typeof AddressAutocompletionInputSchema
>;

const AddressAutocompletionOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of address suggestions.'),
});
export type AddressAutocompletionOutput = z.infer<
  typeof AddressAutocompletionOutputSchema
>;

const addressAutocompletionPrompt = ai.definePrompt({
  name: 'addressAutocompletionPrompt',
  input: {schema: AddressAutocompletionInputSchema},
  output: {schema: AddressAutocompletionOutputSchema},
  prompt: `You are an address autocompletion service. Given a partial address,
  suggest a list of possible complete addresses. Return a JSON array of strings.

  Partial Address: {{{partialAddress}}}
  `,
});

const addressAutocompletionFlow = ai.defineFlow(
  {
    name: 'addressAutocompletionFlow',
    inputSchema: AddressAutocompletionInputSchema,
    outputSchema: AddressAutocompletionOutputSchema,
  },
  async input => {
    const {output} = await addressAutocompletionPrompt(input);
    return output!;
  }
);

export async function addressAutocompletion(
  input: AddressAutocompletionInput
): Promise<AddressAutocompletionOutput> {
  return addressAutocompletionFlow(input);
}
