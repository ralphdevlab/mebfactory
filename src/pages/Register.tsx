import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import FormField from '../components/FormField'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await register(email, password, firstName, lastName)
      navigate('/')
    } catch {
      setError('Could not create an account with those details.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-2xl font-medium text-ink">Create an Account</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div className="flex gap-4">
          <FormField label="First Name" value={firstName} onChange={setFirstName} autoComplete="given-name" />
          <FormField label="Last Name" value={lastName} onChange={setLastName} autoComplete="family-name" />
        </div>
        <FormField label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" />
        <FormField
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          required
          autoComplete="new-password"
        />

        {error && <p className="text-sm font-normal text-red-600">{error}</p>}

        <Button type="submit" variant="primary" className="mt-2" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Register'}
        </Button>
      </form>

      <p className="mt-6 text-sm font-normal text-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-ink underline">
          Log In
        </Link>
      </p>
    </div>
  )
}
