'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Button,
  Card,
  CardBody,
  Input,
  NumberInput,
  ResultPanel,
  Select,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '@sutra-ui/react'
import { ExternalLink } from '@/components/ExternalLink'
import { CUSTOM_PRESET_ID, PRESETS, getPreset, getScheme } from '@/data/presets'
import {
  classLabel,
  customFormula,
  evaluateCgpa,
  evaluatePercentage,
  evaluateSgpa,
  formatNumber,
  formulaExpression,
  inverseExpression,
  parseDecimal,
  type EvalResult,
  type Formula,
} from '@/lib/cgpa'
import { buildSharePath, parseShareSearch, type CalcMode, type SemesterDraft, type ShareState } from '@/lib/share'
import { withBasePath } from '@/lib/site'

const EMPTY_ROWS: SemesterDraft[] = [
  { sgpa: '', credits: '' },
  { sgpa: '', credits: '' },
]

const MODES = [
  ['cgpa', 'CGPA to %'],
  ['pct', 'Percentage to CGPA'],
  ['sgpa', 'SGPA to CGPA'],
] as const

function asNumber(text: string): number | null {
  const trimmed = text.trim()
  if (!trimmed) return null
  return parseDecimal(trimmed)
}

function asText(value: number | null): string {
  return value === null ? '' : String(value)
}

function parseSemesters(rows: SemesterDraft[]): { ok: true; rows: { sgpa: number; credits: number }[] } | { ok: false; message: string } | { ok: 'empty' } {
  const parsed: { sgpa: number; credits: number }[] = []
  for (let index = 0; index < rows.length; index += 1) {
    const sgpaText = rows[index].sgpa.trim()
    const creditText = rows[index].credits.trim()
    if (!sgpaText && !creditText) continue
    if (!sgpaText || !creditText) {
      return { ok: false, message: `Enter both SGPA and credits for semester ${index + 1}.` }
    }
    const sgpa = parseDecimal(sgpaText)
    const credits = parseDecimal(creditText)
    if (sgpa === null || credits === null) {
      return { ok: false, message: `Semester ${index + 1} needs ordinary numbers, such as 8.2 and 24.` }
    }
    parsed.push({ sgpa, credits })
  }
  if (parsed.length === 0) return { ok: 'empty' }
  return { ok: true, rows: parsed }
}

function errorTarget(message: string | null, mode: CalcMode): 'slope' | 'intercept' | 'scale' | CalcMode | null {
  if (!message) return null
  if (message.startsWith('Enter a scale')) return 'scale'
  if (message.startsWith('Enter a multiplier')) return 'slope'
  if (message.startsWith('Enter an adjustment')) return 'intercept'
  return mode
}

export function CgpaCalculator({
  initialPreset,
  navigateOnPresetChange,
}: {
  initialPreset: string
  navigateOnPresetChange: boolean
}) {
  const [presetId, setPresetId] = useState(initialPreset)
  const [schemeId, setSchemeId] = useState(() => getPreset(initialPreset)?.defaultScheme ?? '')
  const [mode, setMode] = useState<CalcMode>('cgpa')
  const [cgpa, setCgpa] = useState('')
  const [pct, setPct] = useState('')
  const [semesters, setSemesters] = useState<SemesterDraft[]>(EMPTY_ROWS)
  const [slope, setSlope] = useState('10')
  const [intercept, setIntercept] = useState('0')
  const [scaleText, setScaleText] = useState('10')
  const [origin, setOrigin] = useState('')
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle')

  useEffect(() => {
    setOrigin(window.location.origin)
    const parsed = parseShareSearch(window.location.search)
    let nextPreset = initialPreset
    if (!navigateOnPresetChange && parsed.preset && (parsed.preset === CUSTOM_PRESET_ID || getPreset(parsed.preset))) {
      nextPreset = parsed.preset
    }
    setPresetId(nextPreset)
    const resolved = getPreset(nextPreset)
    if (parsed.scheme && resolved?.schemes.some((scheme) => scheme.id === parsed.scheme)) {
      setSchemeId(parsed.scheme)
    } else if (resolved) {
      setSchemeId(resolved.defaultScheme)
    }
    if (parsed.mode) setMode(parsed.mode)
    if (parsed.cgpa) setCgpa(parsed.cgpa)
    if (parsed.pct) setPct(parsed.pct)
    if (parsed.slope) setSlope(parsed.slope)
    if (parsed.intercept) setIntercept(parsed.intercept)
    if (parsed.scale) setScaleText(parsed.scale)
    if (parsed.semesters?.length) setSemesters(parsed.semesters)
  }, [initialPreset, navigateOnPresetChange])

  const preset = presetId === CUSTOM_PRESET_ID ? undefined : getPreset(presetId)
  const scheme = preset ? getScheme(preset, schemeId) : undefined

  const shareState: ShareState = {
    preset: presetId,
    scheme: schemeId,
    mode,
    cgpa,
    pct,
    semesters,
    slope,
    intercept,
    scale: scaleText,
  }
  const sharePath = buildSharePath(shareState)
  const shareUrl = origin ? new URL(withBasePath(sharePath), origin).href : sharePath

  const evaluation = useMemo(() => {
    let formula: Formula | null = null
    let scale = preset?.scale ?? 10
    if (preset && scheme) {
      formula = scheme.formula
      scale = preset.scale
    } else {
      const parsedScale = parseDecimal(scaleText)
      const parsedSlope = parseDecimal(slope)
      const parsedIntercept = parseDecimal(intercept === '' ? '0' : intercept)
      if (parsedScale === null || parsedScale <= 0 || parsedScale > 100) {
        return { error: 'Enter a scale greater than 0 and at most 100.', result: null as EvalResult | null }
      }
      if (parsedSlope === null || parsedSlope === 0) {
        return { error: 'Enter a multiplier other than zero.', result: null as EvalResult | null }
      }
      if (parsedIntercept === null) {
        return { error: 'Enter an adjustment. Use 0 when the formula is a straight multiplication.', result: null as EvalResult | null }
      }
      scale = parsedScale
      formula = customFormula(parsedSlope, parsedIntercept)
    }

    if (mode === 'cgpa') {
      if (!cgpa.trim()) return { error: null, result: null }
      const value = parseDecimal(cgpa)
      if (value === null) return { error: 'Enter a CGPA as a number, such as 8.2.', result: null }
      return { error: null, result: evaluateCgpa(value, formula, scale) }
    }
    if (mode === 'pct') {
      if (!pct.trim()) return { error: null, result: null }
      const value = parseDecimal(pct)
      if (value === null) return { error: 'Enter a percentage as a number, such as 76.', result: null }
      return { error: null, result: evaluatePercentage(value, formula, scale) }
    }
    const parsedRows = parseSemesters(semesters)
    if (parsedRows.ok === 'empty') return { error: null, result: null }
    if (!parsedRows.ok) return { error: parsedRows.message, result: null }
    return { error: null, result: evaluateSgpa(parsedRows.rows, formula, scale) }
  }, [cgpa, intercept, mode, pct, preset, scaleText, scheme, semesters, slope])

  function onPresetChange(value: string) {
    if (navigateOnPresetChange) {
      const next = getPreset(value)
      const path = buildSharePath({
        ...shareState,
        preset: value,
        scheme: next?.defaultScheme ?? '',
      })
      window.location.assign(withBasePath(path))
      return
    }
    setPresetId(value)
    const next = getPreset(value)
    if (next) setSchemeId(next.defaultScheme)
  }

  async function copyLink() {
    const url = new URL(withBasePath(sharePath), window.location.origin).href
    try {
      await navigator.clipboard.writeText(url)
      setCopyState('copied')
    } catch {
      setCopyState('manual')
    }
    window.setTimeout(() => setCopyState('idle'), 2500)
  }

  const result = evaluation.result?.ok ? evaluation.result : null
  const resultError = evaluation.error ?? (evaluation.result && !evaluation.result.ok ? evaluation.result.message : null)
  const target = errorTarget(resultError, mode)
  const band =
    result && scheme?.equivalence
      ? classLabel(scheme.equivalence.basis === 'cgpa' ? result.cgpa : result.percentage, scheme.equivalence.bands)
      : null
  const expression = scheme ? formulaExpression(scheme.formula) : formulaExpression(customFormula(parseDecimal(slope) || 0, parseDecimal(intercept) || 0))
  const reverse = scheme ? inverseExpression(scheme.formula) : inverseExpression(customFormula(parseDecimal(slope) || 0, parseDecimal(intercept) || 0))
  const invalidCustom = !preset && (parseDecimal(slope) === null || parseDecimal(slope) === 0)
  const shownExpression = invalidCustom ? 'Percentage = multiplier × CGPA + adjustment' : expression
  const shownReverse = invalidCustom ? 'CGPA = (Percentage − adjustment) ÷ multiplier' : reverse
  const presetOptions = [
    ...PRESETS.filter((item) => item.kind === 'board').map((item) => ({ value: item.slug, label: item.shortName })),
    ...PRESETS.filter((item) => item.kind === 'university').map((item) => ({ value: item.slug, label: item.name })),
    { value: CUSTOM_PRESET_ID, label: 'Custom formula' },
  ]

  const resultValue = result ? (mode === 'cgpa' ? formatNumber(result.percentage) : formatNumber(result.cgpa)) : '—'
  const resultCaption = result
    ? mode === 'cgpa'
      ? `From CGPA ${formatNumber(result.cgpa)}`
      : mode === 'sgpa'
        ? `Percentage ${formatNumber(result.percentage)}% · ${formatNumber(result.totalCredits ?? 0)} credits`
        : `This formula publishes ${formatNumber(result.percentage)}% for that CGPA`
    : resultError
      ? 'Fix the highlighted value to see a result.'
      : 'Enter a value. The result appears here.'

  return (
    <div className="hm-tool">
      <Card>
        <CardBody className="hm-form">
          <Select
            label="University or board"
            hint="Boards, then universities, then a formula you type."
            value={preset ? preset.slug : CUSTOM_PRESET_ID}
            options={presetOptions}
            onChange={(event) => onPresetChange(event.target.value)}
          />

          {preset && preset.schemes.length > 1 ? (
            <Select
              label="Scheme"
              hint={scheme?.appliesTo}
              value={scheme?.id ?? ''}
              options={preset.schemes.map((item) => ({ value: item.id, label: item.label }))}
              onChange={(event) => setSchemeId(event.target.value)}
            />
          ) : null}

          {!preset ? (
            <div className="hm-split">
              <NumberInput
                label="Multiplier"
                decimals={2}
                showScale={false}
                value={asNumber(slope)}
                error={target === 'slope' ? resultError ?? undefined : undefined}
                onValueChange={(value) => setSlope(asText(value))}
              />
              <NumberInput
                label="Adjustment"
                decimals={2}
                showScale={false}
                value={asNumber(intercept)}
                error={target === 'intercept' ? resultError ?? undefined : undefined}
                onValueChange={(value) => setIntercept(asText(value))}
              />
              <NumberInput
                label="Scale"
                decimals={2}
                showScale={false}
                value={asNumber(scaleText)}
                error={target === 'scale' ? resultError ?? undefined : undefined}
                onValueChange={(value) => setScaleText(asText(value))}
              />
            </div>
          ) : null}

          <p className="hm-formula">
            {shownExpression}
            {scheme?.formula.rounding === 'ceil-integer' ? '. Then round up to the next whole number.' : ''}
          </p>
          <p className="sutra-hint">Reverse: {shownReverse}</p>

          <Tabs value={mode} onValueChange={(value) => setMode(value as CalcMode)}>
            <TabList label="Conversion">
              {MODES.map(([value, label]) => (
                <Tab key={value} value={value}>
                  {label}
                </Tab>
              ))}
            </TabList>
            <TabPanel value="cgpa">
              <NumberInput
                label="CGPA"
                decimals={2}
                showScale={false}
                placeholder="8.20"
                value={asNumber(cgpa)}
                error={target === 'cgpa' ? resultError ?? undefined : undefined}
                onValueChange={(value) => setCgpa(asText(value))}
              />
            </TabPanel>
            <TabPanel value="pct">
              <NumberInput
                label="Percentage"
                decimals={2}
                showScale={false}
                placeholder="76"
                value={asNumber(pct)}
                error={target === 'pct' ? resultError ?? undefined : undefined}
                onValueChange={(value) => setPct(asText(value))}
              />
            </TabPanel>
            <TabPanel value="sgpa">
              <fieldset className="hm-semesters">
                <legend className="sutra-label">Semesters</legend>
                {semesters.map((row, index) => (
                  <div className="hm-semester" key={`sem-${index}`}>
                    <NumberInput
                      label={`Semester ${index + 1} SGPA`}
                      decimals={2}
                      showScale={false}
                      value={asNumber(row.sgpa)}
                      onValueChange={(value) =>
                        setSemesters((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, sgpa: asText(value) } : item)))
                      }
                    />
                    <NumberInput
                      label="Credits"
                      decimals={2}
                      showScale={false}
                      value={asNumber(row.credits)}
                      onValueChange={(value) =>
                        setSemesters((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, credits: asText(value) } : item)))
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={semesters.length === 1}
                      onClick={() => setSemesters((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                    >
                      Remove semester {index + 1}
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  disabled={semesters.length >= 12}
                  onClick={() => setSemesters((current) => [...current, { sgpa: '', credits: '' }])}
                >
                  Add semester
                </Button>
                {target === 'sgpa' && resultError ? <p className="sutra-error" role="alert">{resultError}</p> : null}
              </fieldset>
            </TabPanel>
          </Tabs>
        </CardBody>
      </Card>

      <div className="hm-result" aria-live="polite">
        <ResultPanel
          label={mode === 'cgpa' ? 'Percentage' : 'CGPA'}
          value={resultValue}
          unit={result && mode === 'cgpa' ? '%' : undefined}
          caption={resultCaption}
          tone={result ? 'primary' : resultError ? 'danger' : 'default'}
          breakdown={
            result
              ? [
                  { label: 'Steps', value: result.steps },
                  ...(band ? [{ label: 'Class', value: band }] : []),
                ]
              : undefined
          }
        />
        <Card>
          <CardBody className="hm-form">
            <Input className="hm-mono" label="Shareable result link" readOnly value={shareUrl} onFocus={(event) => event.currentTarget.select()} />
            <Button type="button" variant="primary" onClick={copyLink}>
              Copy result link
            </Button>
            <p className="sutra-hint" aria-live="polite">
              {copyState === 'copied' ? 'Copied result link.' : copyState === 'manual' ? 'Select the link and copy it.' : 'The link reopens this preset, scheme, and value.'}
            </p>
          </CardBody>
        </Card>
      </div>

      {scheme ? (
        <div className="hm-prose hm-span">
          <p>{scheme.caveat}</p>
          <p>
            Source: <ExternalLink href={scheme.source.url}>{scheme.source.title}</ExternalLink>
            <span className="sutra-hint"> Checked {scheme.source.accessed}.</span>
          </p>
          {preset && !navigateOnPresetChange ? (
            <p>
              <Link href={sharePath}>Open the {preset.shortName} page</Link>
            </p>
          ) : null}
        </div>
      ) : (
        <p className="sutra-hint hm-span">Custom results are not a university rule. CBSE is multiplier 9.5 and adjustment 0. VTU’s older scheme is multiplier 10 and adjustment −7.5.</p>
      )}
    </div>
  )
}
