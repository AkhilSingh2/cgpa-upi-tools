import Link from 'next/link'
import { PRESETS, getScheme, type Preset } from '@/data/presets'
import { cgpaToPercentage, formatNumber, formulaExpression } from '@/lib/cgpa'

const SAMPLE_POINTS = [7, 8, 8.5, 9, 10]

export function SameCgpaTable({ cgpa = 8.5 }: { cgpa?: number }) {
  return (
    <div className="table-wrap">
      <table>
        <caption>A CGPA of {formatNumber(cgpa)} under each institution’s default formula</caption>
        <thead>
          <tr>
            <th scope="col">Institution</th>
            <th scope="col">Default formula</th>
            <th scope="col">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {PRESETS.map((preset) => {
            const scheme = getScheme(preset, preset.defaultScheme)
            const percentage = cgpaToPercentage(cgpa, scheme.formula).percentage
            return (
              <tr key={preset.slug}>
                <th scope="row">
                  <Link href={`/cgpa-to-percentage/${preset.slug}/`}>{preset.shortName}</Link>
                </th>
                <td>{formulaExpression(scheme.formula)}</td>
                <td>{formatNumber(percentage)}%</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function PresetSchemeTable({ preset }: { preset: Preset }) {
  const points = [...SAMPLE_POINTS]
  for (const scheme of preset.schemes) {
    if (!points.includes(scheme.exampleCgpa)) points.push(scheme.exampleCgpa)
  }
  points.sort((a, b) => a - b)

  return (
    <div className="table-wrap">
      <table>
        <caption>{preset.shortName} percentage for sample CGPAs</caption>
        <thead>
          <tr>
            <th scope="col">CGPA</th>
            {preset.schemes.map((scheme) => (
              <th key={scheme.id} scope="col">
                {scheme.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {points.map((cgpa) => (
            <tr key={cgpa}>
              <th scope="row">{formatNumber(cgpa)}</th>
              {preset.schemes.map((scheme) => (
                <td key={scheme.id}>{formatNumber(cgpaToPercentage(cgpa, scheme.formula).percentage)}%</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
