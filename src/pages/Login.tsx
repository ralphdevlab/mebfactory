import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import FormField from '../components/FormField'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('Invalid email or password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-2xl font-medium text-ink">Log In</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <FormField label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" />
        <FormField
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          required
          autoComplete="current-password"
        />

        {error && <p className="text-sm font-normal text-red-600">{error}</p>}

        <Button type="submit" variant="primary" className="mt-2" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Log In'}
        </Button>
      </form>

      <p className="mt-6 text-sm font-normal text-muted">
        Don't have an account?{' '}
        <Link to="/register" className="text-ink underline">
          Register
        </Link>
      </p>
    </div>
  )
}
