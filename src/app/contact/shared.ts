// Shared by the contact form (client) and its server action. Kept out of actions.ts because
// a 'use server' module may only export async functions.

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message: string
  fieldErrors?: Partial<Record<'name' | 'email' | 'message', string>>
}

// Worded to finish the sentence "I'm reaching out about …" in the form
export const TOPICS = [
  'a project idea',
  'a job opportunity',
  'nothing big, just saying hi',
] as const
