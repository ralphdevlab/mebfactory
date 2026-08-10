import { useState, type FormEvent } from 'react'
import Button from '../components/Button'
import FormField from '../components/FormField'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-2xl font-medium text-ink">Contact Us</h1>
      <p className="mt-2 text-sm font-normal text-muted">
        Have a question about an order or a product? Send us a message and we'll get back to you.
      </p>

      {sent ? (
        <p className="mt-8 text-sm font-normal text-ink">
          Thanks for reaching out — we'll be in touch soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <FormField label="Name" value={name} onChange={setName} required autoComplete="name" />
          <FormField label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" />

          <label className="flex flex-col gap-2">
            <span className="label text-ink">Message</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className="border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-charcoal focus:outline-none"
            />
          </label>

          <Button type="submit" variant="primary" className="mt-2">
            Send Message
          </Button>
        </form>
      )}
    </div>
  )
}
