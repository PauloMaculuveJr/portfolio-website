'use server'

// Sends contact form messages to your inbox through Resend (https://resend.com).
// Setup: create a free Resend account and API key, then set these environment variables
// (locally in .env.local, and in Vercel > Project > Settings > Environment Variables):
//   RESEND_API_KEY  your Resend API key
//   CONTACT_EMAIL   the inbox that should receive messages
//   CONTACT_FROM    optional sender, e.g. "Portfolio <hello@yourdomain.com>" once you verify a
//                   domain; defaults to Resend's test sender, which can mail your own account

import { TOPICS, type ContactState } from './shared'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()
  const topic = String(formData.get('topic') ?? '')

  // Honeypot: a hidden field real people never fill in. Pretend success so bots move on.
  if (formData.get('company')) return { status: 'success', message: 'Thanks!' }

  const fieldErrors: ContactState['fieldErrors'] = {}
  if (name.length < 2 || name.length > 100) fieldErrors.name = 'I’ll need a name to reply to.'
  if (!EMAIL.test(email) || email.length > 200)
    fieldErrors.email = 'That email doesn’t look quite right.'
  if (message.length < 10) fieldErrors.message = 'Give me at least a sentence to go on.'
  if (message.length > 5000) fieldErrors.message = 'That’s a lot! Keep it under 5,000 characters.'
  if (Object.keys(fieldErrors).length) {
    return {
      status: 'error',
      message: 'Almost there, just a couple of blanks to fix.',
      fieldErrors,
    }
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_EMAIL
  if (!apiKey || !to) {
    console.error('Contact form: RESEND_API_KEY or CONTACT_EMAIL is not set')
    return {
      status: 'error',
      message: "Sorry, the contact form isn't connected yet. Please reach out on GitHub for now.",
    }
  }

  const safeTopic = (TOPICS as readonly string[]).includes(topic) ? topic : TOPICS[0]
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? 'Portfolio <onboarding@resend.dev>',
        to: [to],
        reply_to: email,
        subject: `${name} is reaching out about ${safeTopic}`,
        text: `From: ${name} <${email}>\nAbout: ${safeTopic}\n\n${message}`,
      }),
    })
    if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`)
  } catch (error) {
    console.error('Contact form: failed to send', error)
    return {
      status: 'error',
      message: 'Something went wrong sending your message. Please try again.',
    }
  }

  return {
    status: 'success',
    message: `Thanks, ${name.split(' ')[0]}. Your note is in my inbox, and I read every one myself.`,
  }
}
