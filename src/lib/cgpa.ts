export type Rounding = 'none' | 'ceil-integer'

export type Formula =
  | { kind: 'multiply'; factor: number; rounding: Rounding }
  | { kind: 'offset'; offset: number; factor: number; rounding: Rounding }
  | { kind: 'linear'; slope: number; intercept: number; rounding: Rounding }

export interface SemesterInput {
  sgpa: number
  credits: number
}

export type EvalOk = {
  ok: true
  cgpa: number
  raw: number
  percentage: number
  steps: string
  totalCredits?: number
}

export type EvalErr = { ok: false; message: string }

export type EvalResult = EvalOk | EvalErr

export function stable(n: number): number {
  return Math.round(n * 1e9) / 1e9
}

export function formatNumber(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return ''
  let text = stable(value).toFixed(digits)
  if (text.includes('.')) {
    text = text.replace(/0+$/, '').replace(/\.$/, '')
  }
  return text
}

export function formulaSlope(formula: Formula): number {
  return formula.kind === 'linear' ? formula.slope : formula.factor
}

function rawValue(cgpa: number, formula: Formula): number {
  switch (formula.kind) {
    case 'multiply':
      return formula.factor * cgpa
    case 'offset':
      return (cgpa - formula.offset) * formula.factor
    case 'linear':
      return formula.slope * cgpa + formula.intercept
  }
}

function ceilInteger(n: number): number {
  const nearest = Math.round(n)
  if (Math.abs(n - nearest) < 1e-8) return nearest
  return Math.ceil(n)
}

export function cgpaToPercentage(
  cgpa: number,
  formula: Formula,
): { raw: number; percentage: number } {
  const raw = stable(rawValue(cgpa, formula))
  const percentage = formula.rounding === 'ceil-integer' ? ceilInteger(raw) : raw
  return { raw, percentage }
}

export function percentageToCgpa(percentage: number, formula: Formula): number {
  const slope = formulaSlope(formula)
  if (!Number.isFinite(slope) || slope === 0) {
    throw new Error('Formula slope must not be zero.')
  }
  if (formula.kind === 'multiply') return stable(percentage / formula.factor)
  if (formula.kind === 'offset') return stable(percentage / formula.factor + formula.offset)
  return stable((percentage - formula.intercept) / formula.slope)
}

export function formulaExpression(formula: Formula): string {
  if (formula.kind === 'multiply') {
    return `Percentage = CGPA × ${formatNumber(formula.factor)}`
  }
  if (formula.kind === 'offset') {
    return `Percentage = (CGPA − ${formatNumber(formula.offset)}) × ${formatNumber(formula.factor)}`
  }
  if (formula.intercept === 0) {
    return `Percentage = ${formatNumber(formula.slope)} × CGPA`
  }
  if (formula.intercept < 0) {
    return `Percentage = ${formatNumber(formula.slope)} × CGPA − ${formatNumber(Math.abs(formula.intercept))}`
  }
  return `Percentage = ${formatNumber(formula.slope)} × CGPA + ${formatNumber(formula.intercept)}`
}

export function inverseExpression(formula: Formula): string {
  if (formula.kind === 'multiply') {
    return `CGPA = Percentage ÷ ${formatNumber(formula.factor)}`
  }
  if (formula.kind === 'offset') {
    return `CGPA = Percentage ÷ ${formatNumber(formula.factor)} + ${formatNumber(formula.offset)}`
  }
  if (formula.intercept === 0) {
    return `CGPA = Percentage ÷ ${formatNumber(formula.slope)}`
  }
  if (formula.intercept < 0) {
    return `CGPA = (Percentage + ${formatNumber(Math.abs(formula.intercept))}) ÷ ${formatNumber(formula.slope)}`
  }
  return `CGPA = (Percentage − ${formatNumber(formula.intercept)}) ÷ ${formatNumber(formula.slope)}`
}

export function formulaSteps(cgpa: number, formula: Formula): string {
  const { raw, percentage } = cgpaToPercentage(cgpa, formula)
  const c = formatNumber(cgpa)
  const r = formatNumber(raw)
  let base: string
  if (formula.kind === 'multiply') {
    base = `${c} × ${formatNumber(formula.factor)} = ${r}`
  } else if (formula.kind === 'offset') {
    base = `(${c} − ${formatNumber(formula.offset)}) × ${formatNumber(formula.factor)} = ${r}`
  } else if (formula.intercept === 0) {
    base = `${formatNumber(formula.slope)} × ${c} = ${r}`
  } else if (formula.intercept < 0) {
    base = `${formatNumber(formula.slope)} × ${c} − ${formatNumber(Math.abs(formula.intercept))} = ${r}`
  } else {
    base = `${formatNumber(formula.slope)} × ${c} + ${formatNumber(formula.intercept)} = ${r}`
  }
  if (formula.rounding === 'ceil-integer' && Math.abs(percentage - raw) > 1e-9) {
    return `${base}, rounded up to ${formatNumber(percentage)}`
  }
  return base
}

export function inverseSteps(percentage: number, formula: Formula): string {
  const cgpa = percentageToCgpa(percentage, formula)
  const p = formatNumber(percentage)
  const c = formatNumber(cgpa)
  if (formula.kind === 'multiply') {
    return `${p} ÷ ${formatNumber(formula.factor)} = ${c}`
  }
  if (formula.kind === 'offset') {
    return `${p} ÷ ${formatNumber(formula.factor)} + ${formatNumber(formula.offset)} = ${c}`
  }
  if (formula.intercept === 0) {
    return `${p} ÷ ${formatNumber(formula.slope)} = ${c}`
  }
  if (formula.intercept < 0) {
    return `(${p} + ${formatNumber(Math.abs(formula.intercept))}) ÷ ${formatNumber(formula.slope)} = ${c}`
  }
  return `(${p} − ${formatNumber(formula.intercept)}) ÷ ${formatNumber(formula.slope)} = ${c}`
}

export function percentageRange(formula: Formula, scale: number): { min: number; max: number } {
  const low = cgpaToPercentage(0, formula).percentage
  const high = cgpaToPercentage(scale, formula).percentage
  return { min: Math.min(low, high), max: Math.max(low, high) }
}

function outOfRangeMessage(formula: Formula, scale: number): string {
  const range = percentageRange(formula, scale)
  return `On a 0–${formatNumber(scale)} scale this formula produces ${formatNumber(range.min)}% to ${formatNumber(range.max)}%.`
}

export function evaluateCgpa(cgpa: number, formula: Formula, scale: number): EvalResult {
  if (!Number.isFinite(cgpa)) {
    return { ok: false, message: 'Enter a CGPA.' }
  }
  if (cgpa < 0 || cgpa > scale) {
    return { ok: false, message: `Enter a CGPA from 0 to ${formatNumber(scale)}.` }
  }
  const { raw, percentage } = cgpaToPercentage(cgpa, formula)
  return {
    ok: true,
    cgpa,
    raw,
    percentage,
    steps: formulaSteps(cgpa, formula),
  }
}

export function evaluatePercentage(
  percentage: number,
  formula: Formula,
  scale: number,
): EvalResult {
  if (!Number.isFinite(percentage)) {
    return { ok: false, message: 'Enter a percentage.' }
  }
  if (formulaSlope(formula) === 0) {
    return { ok: false, message: 'The multiplier cannot be zero.' }
  }
  const cgpa = percentageToCgpa(percentage, formula)
  if (cgpa < -1e-6 || cgpa > scale + 1e-6) {
    return { ok: false, message: outOfRangeMessage(formula, scale) }
  }
  const clamped = Math.min(scale, Math.max(0, cgpa))
  const forward = cgpaToPercentage(clamped, formula)
  return {
    ok: true,
    cgpa: clamped,
    raw: forward.raw,
    percentage: forward.percentage,
    steps: inverseSteps(percentage, formula),
  }
}

export function averageSgpa(
  rows: SemesterInput[],
  scale: number,
): { cgpa: number; totalCredits: number } {
  if (rows.length === 0) {
    throw new Error('Add at least one semester.')
  }
  let points = 0
  let credits = 0
  for (const row of rows) {
    if (!Number.isFinite(row.sgpa) || !Number.isFinite(row.credits)) {
      throw new Error('Enter a number for every SGPA and credit value.')
    }
    if (row.sgpa < 0 || row.sgpa > scale) {
      throw new Error(`Enter an SGPA from 0 to ${formatNumber(scale)}.`)
    }
    if (row.credits <= 0) {
      throw new Error('Credits must be greater than zero.')
    }
    points += row.sgpa * row.credits
    credits += row.credits
  }
  const cgpa = stable(Number((points / credits).toFixed(2)))
  return { cgpa, totalCredits: stable(credits) }
}

export function evaluateSgpa(
  rows: SemesterInput[],
  formula: Formula,
  scale: number,
): EvalResult {
  try {
    const averaged = averageSgpa(rows, scale)
    const converted = evaluateCgpa(averaged.cgpa, formula, scale)
    if (!converted.ok) return converted
    return { ...converted, totalCredits: averaged.totalCredits }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Could not average those semesters.',
    }
  }
}

export function parseDecimal(input: string): number | null {
  const text = input.trim().replace(',', '.')
  if (!/^-?\d+(\.\d+)?$/.test(text)) return null
  const value = Number(text)
  return Number.isFinite(value) ? value : null
}

export interface ClassBand {
  min: number
  label: string
}

export function classLabel(value: number, bands: ClassBand[]): string | null {
  let best: ClassBand | null = null
  for (const band of bands) {
    if (value + 1e-9 >= band.min && (!best || band.min > best.min)) best = band
  }
  return best?.label ?? null
}

export function customFormula(slope: number, intercept: number): Formula {
  return { kind: 'linear', slope, intercept, rounding: 'none' }
}
