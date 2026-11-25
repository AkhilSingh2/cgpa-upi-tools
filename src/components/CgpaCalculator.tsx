'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import Link from 'next/link'
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
import { ExternalLink } from '@/components/ExternalLink'

const EMPTY_ROWS: SemesterDraft[] = [
  { sgpa: '', credits: '' },
  { sgpa: '', credits: '' },
]

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

export function CgpaCalculator({
  initialPreset,
  navigateOnPresetChange,
}: {
  initialPreset: string
  navigateOnPresetChange: boolean
}) {
  const fieldId = useId()
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
  const band =
    result && scheme?.equivalence
      ? classLabel(scheme.equivalence.basis === 'cgpa' ? result.cgpa : result.percentage, scheme.equivalence.bands)
      : null
  const expression = scheme ? formulaExpression(scheme.formula) : formulaExpression(customFormula(parseDecimal(slope) || 0, parseDecimal(intercept) || 0))
  const reverse = scheme ? inverseExpression(scheme.formula) : inverseExpression(customFormula(parseDecimal(slope) || 0, parseDecimal(intercept) || 0))
  const invalidCustom = !preset && (parseDecimal(slope) === null || parseDecimal(slope) === 0)
  const shownExpression = invalidCustom ? 'Percentage = multiplier × CGPA + adjustment' : expression
  const shownReverse = invalidCustom ? 'CGPA = (Percentage − adjustment) ÷ multiplier' : reverse

  return (
    <div className="tool-layout">
      <form className="tool-form" onSubmit={(event) => event.preventDefault()}>
        <div className="field">
          <label htmlFor={`${fieldId}-preset`}>University or board</label>
          <select id={`${fieldId}-preset`} value={preset ? preset.slug : CUSTOM_PRESET_ID} onChange={(event) => onPresetChange(event.target.value)}>
            <optgroup label="Board">
              {PRESETS.filter((item) => item.kind === 'board').map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.shortName}
                </option>
              ))}
            </optgroup>
            <optgroup label="University">
              {PRESETS.filter((item) => item.kind === 'university').map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Other">
              <option value={CUSTOM_PRESET_ID}>Custom formula</option>
            </optgroup>
          </select>
        </div>

        {preset && preset.schemes.length > 1 ? (
          <fieldset className="choice-list">
            <legend>Scheme</legend>
            {preset.schemes.map((item) => (
              <label key={item.id} className="choice">
                <input
                  type="radio"
                  name={`${fieldId}-scheme`}
                  value={item.id}
                  checked={scheme?.id === item.id}
                  onChange={() => setSchemeId(item.id)}
                />
                <span>
                  <strong>{item.label}</strong>
                  <span className="choice-note">{item.appliesTo}</span>
                </span>
              </label>
            ))}
          </fieldset>
        ) : null}

        {!preset ? (
          <div className="split">
            <div className="field">
              <label htmlFor={`${fieldId}-slope`}>Multiplier</label>
              <input id={`${fieldId}-slope`} inputMode="decimal" autoComplete="off" spellCheck={false} value={slope} onChange={(event) => setSlope(event.target.value)} />
            </div>
            <div className="field">
              <label htmlFor={`${fieldId}-intercept`}>Adjustment</label>
              <input id={`${fieldId}-intercept`} inputMode="decimal" autoComplete="off" spellCheck={false} value={intercept} onChange={(event) => setIntercept(event.target.value)} />
            </div>
            <div className="field">
              <label htmlFor={`${fieldId}-scale`}>Scale</label>
              <input id={`${fieldId}-scale`} inputMode="decimal" autoComplete="off" spellCheck={false} value={scaleText} onChange={(event) => setScaleText(event.target.value)} />
            </div>
          </div>
        ) : null}

        <p className="formula-line" id={`${fieldId}-formula`}>
          {shownExpression}
          {scheme?.formula.rounding === 'ceil-integer' ? '. Then round up to the next whole number.' : ''}
        </p>
        <p className="hint">Reverse: {shownReverse}</p>

        <fieldset className="segment-wrap">
          <legend>Conversion</legend>
          <div className="segment" role="radiogroup" aria-label="Conversion">
            {(
              [
                ['cgpa', 'CGPA to %'],
                ['pct', 'Percentage to CGPA'],
                ['sgpa', 'SGPA to CGPA'],
              ] as const
            ).map(([value, label]) => (
              <label key={value}>
                <input type="radio" name={`${fieldId}-mode`} value={value} checked={mode === value} onChange={() => setMode(value)} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {mode === 'cgpa' ? (
          <div className="field">
            <label htmlFor={`${fieldId}-cgpa`}>CGPA</label>
            <input
              id={`${fieldId}-cgpa`}
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              placeholder="8.20"
              value={cgpa}
              aria-invalid={mode === 'cgpa' && Boolean(resultError)}
              aria-describedby={`${fieldId}-formula${resultError ? ` ${fieldId}-error` : ''}`}
              onChange={(event) => setCgpa(event.target.value)}
            />
          </div>
        ) : null}

        {mode === 'pct' ? (
          <div className="field">
            <label htmlFor={`${fieldId}-pct`}>Percentage</label>
            <input
              id={`${fieldId}-pct`}
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              placeholder="76"
              value={pct}
              aria-invalid={Boolean(resultError)}
              aria-describedby={`${fieldId}-formula${resultError ? ` ${fieldId}-error` : ''}`}
              onChange={(event) => setPct(event.target.value)}
            />
          </div>
        ) : null}

        {mode === 'sgpa' ? (
          <fieldset className="semesters" aria-describedby={resultError ? `${fieldId}-error` : undefined}>
            <legend>Semesters</legend>
            {semesters.map((row, index) => (
              <div className="semester" key={`${fieldId}-sem-${index}`}>
                <div className="field">
                  <label htmlFor={`${fieldId}-sgpa-${index}`}>Semester {index + 1} SGPA</label>
                  <input
                    id={`${fieldId}-sgpa-${index}`}
                    inputMode="decimal"
                    autoComplete="off"
                    spellCheck={false}
                    value={row.sgpa}
                    onChange={(event) =>
                      setSemesters((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, sgpa: event.target.value } : item)))
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor={`${fieldId}-credits-${index}`}>Credits</label>
                  <input
                    id={`${fieldId}-credits-${index}`}
                    inputMode="decimal"
                    autoComplete="off"
                    spellCheck={false}
                    value={row.credits}
                    onChange={(event) =>
                      setSemesters((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, credits: event.target.value } : item)))
                    }
                  />
                </div>
                <button
                  type="button"
                  className="text-button"
                  disabled={semesters.length === 1}
                  onClick={() => setSemesters((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                >
                  Remove semester {index + 1}
                </button>
              </div>
            ))}
            <button
              type="button"
              className="secondary"
              disabled={semesters.length >= 12}
              onClick={() => setSemesters((current) => [...current, { sgpa: '', credits: '' }])}
            >
              Add semester
            </button>
          </fieldset>
        ) : null}

        {resultError ? (
          <p className="error" id={`${fieldId}-error`} role="alert">
            {resultError}
          </p>
        ) : null}
      </form>

      <aside className="result-card" aria-live="polite">
        <p className="eyebrow">{mode === 'cgpa' ? 'Percentage' : 'CGPA'}</p>
        {result ? (
          <>
            <p className="result-value">
              {mode === 'cgpa' ? (
                <>
                  {formatNumber(result.percentage)}
                  <span className="unit">%</span>
                </>
              ) : (
                formatNumber(result.cgpa)
              )}
            </p>
            <p className="result-detail">
              {mode === 'cgpa'
                ? `From CGPA ${formatNumber(result.cgpa)}`
                : mode === 'sgpa'
                  ? `Percentage ${formatNumber(result.percentage)}% · ${formatNumber(result.totalCredits ?? 0)} credits`
                  : `This formula publishes ${formatNumber(result.percentage)}% for that CGPA`}
            </p>
            <p className="steps">{result.steps}</p>
            {band ? <p className="band">{band}</p> : null}
          </>
        ) : (
          <p className="result-empty">{resultError ? 'Fix the highlighted value to see a result.' : 'Enter a value. The result appears here.'}</p>
        )}
        <div className="share-box">
          <label htmlFor={`${fieldId}-share`}>Shareable result link</label>
          <input id={`${fieldId}-share`} readOnly value={shareUrl} onFocus={(event) => event.currentTarget.select()} />
          <button type="button" className="primary" onClick={copyLink}>
            Copy result link
          </button>
          <p className="hint" aria-live="polite">
            {copyState === 'copied' ? 'Copied result link.' : copyState === 'manual' ? 'Select the link and copy it.' : 'The link reopens this preset, scheme, and value.'}
          </p>
        </div>
      </aside>
      {scheme ? (
        <div className="citation tool-span">
          <p>{scheme.caveat}</p>
          <p>
            Source: <ExternalLink href={scheme.source.url}>{scheme.source.title}</ExternalLink>
            <span className="hint"> Checked {scheme.source.accessed}.</span>
          </p>
          {preset && !navigateOnPresetChange ? (
            <p>
              <Link href={sharePath}>Open the {preset.shortName} page</Link>
            </p>
          ) : null}
        </div>
      ) : (
        <p className="hint tool-span">Custom results are not a university rule. CBSE is multiplier 9.5 and adjustment 0. VTU’s older scheme is multiplier 10 and adjustment −7.5.</p>
      )}
    </div>
  )
}
