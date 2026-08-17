const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const

interface MeasurementRow {
  label: string
  values: Record<(typeof SIZES)[number], string>
}

const MEN_ROWS: MeasurementRow[] = [
  {
    label: 'Chest',
    values: { XS: '32–34" / 81–86cm', S: '35–37" / 89–94cm', M: '38–40" / 97–102cm', L: '41–43" / 104–109cm', XL: '44–46" / 112–117cm', XXL: '47–49" / 119–124cm' },
  },
  {
    label: 'Waist',
    values: { XS: '26–28" / 66–71cm', S: '29–31" / 74–79cm', M: '32–34" / 81–86cm', L: '35–37" / 89–94cm', XL: '38–40" / 97–102cm', XXL: '41–43" / 104–109cm' },
  },
  {
    label: 'Hips',
    values: { XS: '33–35" / 84–89cm', S: '36–38" / 91–97cm', M: '39–41" / 99–104cm', L: '42–44" / 107–112cm', XL: '45–47" / 114–119cm', XXL: '48–50" / 122–127cm' },
  },
]

const WOMEN_ROWS: MeasurementRow[] = [
  {
    label: 'Chest',
    values: { XS: '31–32" / 79–81cm', S: '33–34" / 84–86cm', M: '35–36" / 89–91cm', L: '37–39" / 94–99cm', XL: '40–42" / 102–107cm', XXL: '43–45" / 109–114cm' },
  },
  {
    label: 'Waist',
    values: { XS: '24–25" / 61–64cm', S: '26–27" / 66–69cm', M: '28–29" / 71–74cm', L: '30–32" / 76–81cm', XL: '33–35" / 84–89cm', XXL: '36–38" / 91–97cm' },
  },
  {
    label: 'Hips',
    values: { XS: '34–35" / 86–89cm', S: '36–37" / 91–94cm', M: '38–39" / 97–99cm', L: '40–42" / 102–107cm', XL: '43–45" / 109–114cm', XXL: '46–48" / 117–122cm' },
  },
]

export default function SizeGuide() {
  return (
    <div className="mx-auto max-w-[1000px] px-6 py-12">
      <h1 className="border-b border-border pb-6 text-2xl font-medium text-ink">Size Guide</h1>
      <p className="mt-6 text-sm font-normal leading-relaxed text-muted">
        Measurements are body measurements, not garment measurements. If you're between sizes, we recommend
        sizing up for a more relaxed fit.
      </p>

      <SizeTable title="Men" rows={MEN_ROWS} />
      <SizeTable title="Women" rows={WOMEN_ROWS} />
    </div>
  )
}

function SizeTable({ title, rows }: { title: string; rows: MeasurementRow[] }) {
  return (
    <div className="mt-12">
      <h2 className="label text-ink">{title}</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="label py-3 pr-4 text-muted">Measurement</th>
              {SIZES.map((size) => (
                <th key={size} className="label py-3 pr-4 text-ink">
                  {size}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border">
                <td className="py-3 pr-4 font-medium text-ink">{row.label}</td>
                {SIZES.map((size) => (
                  <td key={size} className="whitespace-nowrap py-3 pr-4 font-normal text-muted">
                    {row.values[size]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
