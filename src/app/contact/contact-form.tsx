'use client'

import { useActionState, useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Magnetic } from '@/components/magnetic'
import { cn } from '@/lib/utils'
import { sendMessage } from './actions'
import { TOPICS, type ContactState } from './shared'

const initialState: ContactState = { status: 'idle', message: '' }
const MAX = 5000

// Underlined blanks that sit inside the sentence, like filling in a letter
const blank =
  'border-foreground/25 placeholder:text-muted-foreground/45 focus:border-accent aria-invalid:border-destructive inline-block h-[1.35em] max-w-full min-w-[4ch] border-b-2 bg-transparent px-0.5 py-0 align-baseline leading-tight font-medium transition-colors outline-none w-(--w) [field-sizing:content] supports-[field-sizing:content]:w-auto'

const sentence = 'text-[clamp(1.35rem,2.3vw,1.85rem)] leading-[2.1] font-medium tracking-[-0.01em]'

export function ContactForm() {
  // Remounting the form (new key) is how "write another" starts fresh
  const [round, setRound] = useState(0)
  return <Letter key={round} onReset={() => setRound((r) => r + 1)} />
}

function Letter({ onReset }: { onReset: () => void }) {
  const [state, formAction, pending] = useActionState(sendMessage, initialState)
  // Controlled fields: React resets uncontrolled forms after an action, which would wipe
  // what the visitor typed whenever validation fails
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [topic, setTopic] = useState(0)
  // An error disappears as soon as its field is edited after the submission that flagged it
  const [editedSince, setEditedSince] = useState<
    Partial<Record<keyof typeof values, ContactState>>
  >({})
  const set =
    (key: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }))
      setEditedSince((m) => ({ ...m, [key]: state }))
    }
  const errors = Object.fromEntries(
    Object.entries(state.fieldErrors ?? {}).filter(
      ([k]) => editedSince[k as keyof typeof values] !== state,
    ),
  ) as NonNullable<ContactState['fieldErrors']>
  const hasFieldErrors = Object.keys(errors).length > 0
  const sendFailed = state.status === 'error' && !state.fieldErrors

  // Inline blanks hug their text: browsers with field-sizing do it in CSS; elsewhere the
  // --w estimate from the character count applies (see the supports-[] class on `blank`)
  const width = (value: string, placeholder: string) =>
    ({ '--w': `${Math.max(value.length, placeholder.length) * 0.95 + 1}ch` }) as React.CSSProperties

  if (state.status === 'success') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 py-10 duration-500">
        <p className="font-display text-accent text-3xl italic">Sent.</p>
        <p className="mt-4 text-[clamp(1.4rem,2.4vw,1.9rem)] leading-snug font-medium">
          {state.message}
        </p>
        <p className="text-muted-foreground mt-4">
          Expect a reply at <span className="text-foreground">{values.email}</span>.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="text-muted-foreground hover:text-accent mt-10 text-sm underline underline-offset-4 transition-colors"
        >
          Write another note
        </button>
      </div>
    )
  }

  return (
    <form action={formAction} noValidate>
      <input type="hidden" name="topic" value={TOPICS[topic]} />

      <p className={sentence}>
        <span className="text-muted-foreground">Hey Paulo,</span> my name is{' '}
        <label htmlFor="name" className="sr-only">
          Your name
        </label>
        <input
          id="name"
          name="name"
          autoComplete="name"
          placeholder="your name"
          value={values.name}
          onChange={set('name')}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          style={width(values.name, 'your name')}
          className={blank}
        />{' '}
        and I&apos;m reaching out about{' '}
        <button
          type="button"
          onClick={() => setTopic((t) => (t + 1) % TOPICS.length)}
          aria-label={`Topic: ${TOPICS[topic]}. Click to change`}
          title="Click to change"
          className="text-accent decoration-accent/40 hover:decoration-accent inline underline decoration-wavy decoration-2 underline-offset-[6px] transition-colors"
        >
          {TOPICS[topic]}
        </button>
        .
      </p>

      <div className="mt-6">
        <label htmlFor="message" className={cn(sentence, 'text-muted-foreground')}>
          Here&apos;s what&apos;s on my mind:
        </label>
        {/* Ruled lines behind the text, like notebook paper */}
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={MAX}
          placeholder="Start typing…"
          value={values.message}
          onChange={set('message')}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className="placeholder:text-muted-foreground/45 mt-2 block [field-sizing:content] min-h-[9rem] w-full resize-none bg-[linear-gradient(to_bottom,transparent_calc(2.25rem-1px),var(--border)_calc(2.25rem-1px))] bg-[size:100%_2.25rem] bg-local text-lg leading-[2.25rem] outline-none"
        />
      </div>

      <p className={cn(sentence, 'mt-6')}>
        You can reply to me at{' '}
        <label htmlFor="email" className="sr-only">
          Your email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          value={values.email}
          onChange={set('email')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          style={width(values.email, 'you@email.com')}
          className={blank}
        />
        .
      </p>

      {/* Honeypot: hidden from people, irresistible to bots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {hasFieldErrors && (
        <ul className="text-destructive mt-6 space-y-1 text-sm">
          {errors.name && <li id="name-error">{errors.name}</li>}
          {errors.message && <li id="message-error">{errors.message}</li>}
          {errors.email && <li id="email-error">{errors.email}</li>}
        </ul>
      )}

      <div className="border-border mt-10 flex flex-wrap items-center justify-between gap-6 border-t pt-8">
        {/* Only shown when sending itself fails; blank-level errors are listed above */}
        <p aria-live="polite" className="text-destructive max-w-xs text-sm empty:hidden">
          {sendFailed ? state.message : ''}
        </p>
        <Magnetic className="ml-auto">
          <button
            type="submit"
            disabled={pending}
            className="group bg-foreground text-background hover:bg-accent focus-visible:ring-ring focus-visible:ring-offset-background inline-flex h-12 items-center gap-2 rounded-full px-7 font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-70"
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Sending…
              </>
            ) : (
              <>
                Send it
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </>
            )}
          </button>
        </Magnetic>
      </div>
    </form>
  )
}
