interface FormFieldProps {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  autoComplete?: string
}

export default function FormField({
  label,
  type = 'text',
  value,
  onChange,
  required,
  autoComplete,
}: FormFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label text-ink">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        className="border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-charcoal focus:outline-none"
      />
    </label>
  )
}
