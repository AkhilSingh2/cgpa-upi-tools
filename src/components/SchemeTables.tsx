import { ComparisonTable } from '@sutra-ui/react'
import { PRESETS, getScheme, type Preset } from '@/data/presets'
import { cgpaToPercentage, formatNumber, formulaExpression } from '@/lib/cgpa'

const SAMPLE_POINTS = [7, 8, 8.5, 9, 10]

export function SameCgpaTable({ cgpa = 8.5 }: { cgpa?: number }) {
  return (
    <ComparisonTable
      caption={`A CGPA of ${formatNumber(cgpa)} under each institution’s default formula`}
      rowHeader="Institution"
      highlight="percentage"
      columns={[
        { key: 'formula', header: 'Default formula' },
        { key: 'percentage', header: 'Percentage' },
      ]}
      rows={PRESETS.map((preset) => {
        const scheme = getScheme(preset, preset.defaultScheme)
        const percentage = cgpaToPercentage(cgpa, scheme.formula).percentage
        return {
          label: preset.shortName,
          values: {
            formula: formulaExpression(scheme.formula),
            percentage: `${formatNumber(percentage)}%`,
          },
        }
      })}
    />
  )
}

export function PresetSchemeTable({ preset }: { preset: Preset }) {
  const points = [...SAMPLE_POINTS]
  for (const scheme of preset.schemes) {
    if (!points.includes(scheme.exampleCgpa)) points.push(scheme.exampleCgpa)
  }
  points.sort((a, b) => a - b)

  return (
    <ComparisonTable
      caption={`${preset.shortName} percentage for sample CGPAs`}
      rowHeader="CGPA"
      highlight={preset.defaultScheme}
      columns={preset.schemes.map((scheme) => ({ key: scheme.id, header: scheme.label }))}
      rows={points.map((cgpa) => ({
        label: formatNumber(cgpa),
        values: Object.fromEntries(
          preset.schemes.map((scheme) => [scheme.id, `${formatNumber(cgpaToPercentage(cgpa, scheme.formula).percentage)}%`]),
        ),
      }))}
    />
  )
}
