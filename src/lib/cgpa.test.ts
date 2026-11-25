import { describe, expect, it } from 'vitest'
import { PRESETS, getScheme } from '@/data/presets'
import {
  averageSgpa,
  cgpaToPercentage,
  classLabel,
  customFormula,
  evaluateCgpa,
  evaluatePercentage,
  evaluateSgpa,
  formatNumber,
  parseDecimal,
  percentageToCgpa,
} from '@/lib/cgpa'

const official: Record<string, { cgpa: number; percentage: number }> = {
  'cbse:cce-2010': { cgpa: 8, percentage: 76 },
  'vtu:2022': { cgpa: 8.2, percentage: 82 },
  'vtu:2018': { cgpa: 8.2, percentage: 74.5 },
  'aktu:2018-revised': { cgpa: 8.66, percentage: 86.6 },
  'anna-university:r2021': { cgpa: 8.5, percentage: 85 },
  'mumbai-university:2019': { cgpa: 8, percentage: 68 },
  'mumbai-university:2018': { cgpa: 8, percentage: 69 },
  'gtu:2012': { cgpa: 7.5, percentage: 70 },
  'ktu:2023': { cgpa: 8.5, percentage: 85 },
  'ktu:pre-2023': { cgpa: 8.5, percentage: 82.5 },
  'jntuh:r22': { cgpa: 8, percentage: 75 },
}

describe('published formulas', () => {
  it('matches every cited illustration', () => {
    for (const [key, expected] of Object.entries(official)) {
      const [slug, schemeId] = key.split(':')
      const preset = PRESETS.find((item) => item.slug === slug)
      expect(preset, slug).toBeTruthy()
      const scheme = getScheme(preset!, schemeId)
      expect(scheme.id).toBe(schemeId)
      expect(scheme.exampleCgpa).toBe(expected.cgpa)
      const result = cgpaToPercentage(expected.cgpa, scheme.formula)
      expect(result.percentage).toBeCloseTo(expected.percentage, 8)
    }
  })

  it('keeps Mumbai University from rounding an exact integer upward', () => {
    const scheme = getScheme(PRESETS.find((item) => item.slug === 'mumbai-university')!, '2019')
    const atTen = cgpaToPercentage(10, scheme.formula)
    expect(atTen.raw).toBeCloseTo(82, 8)
    expect(atTen.percentage).toBe(82)
    const eight = cgpaToPercentage(8, scheme.formula)
    expect(eight.raw).toBeCloseTo(67.8, 8)
    expect(eight.percentage).toBe(68)
  })

  it('round-trips multiply, offset, and linear formulas', () => {
    const samples = [
      getScheme(PRESETS.find((item) => item.slug === 'cbse')!, 'cce-2010').formula,
      getScheme(PRESETS.find((item) => item.slug === 'vtu')!, '2018').formula,
      getScheme(PRESETS.find((item) => item.slug === 'ktu')!, 'pre-2023').formula,
      customFormula(9.5, 0),
    ]
    for (const formula of samples) {
      for (const cgpa of [0, 4, 7.25, 8.66, 10]) {
        const forward = cgpaToPercentage(cgpa, formula)
        expect(percentageToCgpa(forward.raw, formula)).toBeCloseTo(cgpa, 6)
      }
    }
  })

  it('rejects a CBSE percentage the 9.5 rule cannot produce', () => {
    const formula = getScheme(PRESETS.find((item) => item.slug === 'cbse')!, 'cce-2010').formula
    const result = evaluatePercentage(100, formula, 10)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toContain('95')
  })

  it('inverts the Mumbai formula before rounding', () => {
    const formula = getScheme(PRESETS.find((item) => item.slug === 'mumbai-university')!, '2019').formula
    expect(percentageToCgpa(67.8, formula)).toBeCloseTo(8, 6)
    const reversed = evaluatePercentage(68, formula, 10)
    expect(reversed.ok).toBe(true)
    if (reversed.ok) expect(reversed.cgpa).toBeGreaterThan(8)
  })
})

describe('SGPA averaging', () => {
  it('weights semesters by credits and rounds CGPA to two decimals', () => {
    const averaged = averageSgpa(
      [
        { sgpa: 8, credits: 20 },
        { sgpa: 9, credits: 20 },
      ],
      10,
    )
    expect(averaged.cgpa).toBe(8.5)
    expect(averaged.totalCredits).toBe(40)

    const uneven = averageSgpa(
      [
        { sgpa: 8.21, credits: 24 },
        { sgpa: 7.64, credits: 18 },
      ],
      10,
    )
    expect(uneven.totalCredits).toBe(42)
    expect(uneven.cgpa).toBe(7.97)
  })

  it('converts the rounded CGPA with the selected formula', () => {
    const formula = getScheme(PRESETS.find((item) => item.slug === 'vtu')!, '2018').formula
    const result = evaluateSgpa(
      [
        { sgpa: 8.2, credits: 24 },
        { sgpa: 8.2, credits: 24 },
      ],
      formula,
      10,
    )
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.cgpa).toBe(8.2)
      expect(result.percentage).toBeCloseTo(74.5, 8)
      expect(result.steps).toBe('(8.2 − 0.75) × 10 = 74.5')
    }
  })

  it('rejects empty input, zero credits, and an SGPA above the scale', () => {
    expect(evaluateSgpa([], customFormula(10, 0), 10).ok).toBe(false)
    expect(evaluateSgpa([{ sgpa: 8, credits: 0 }], customFormula(10, 0), 10).ok).toBe(false)
    expect(evaluateSgpa([{ sgpa: 11, credits: 20 }], customFormula(10, 0), 10).ok).toBe(false)
    expect(evaluateCgpa(10.1, customFormula(10, 0), 10).ok).toBe(false)
    expect(evaluateCgpa(10, customFormula(10, 0), 10)).toMatchObject({ ok: true, percentage: 100 })
  })
})

describe('class labels and formatting', () => {
  it('labels VTU 2022 and GTU from their own bands', () => {
    const vtu = getScheme(PRESETS.find((item) => item.slug === 'vtu')!, '2022')
    expect(classLabel(82, vtu.equivalence!.bands)).toBe('First Class with Distinction')
    expect(classLabel(39, vtu.equivalence!.bands)).toBeNull()
    const gtu = getScheme(PRESETS.find((item) => item.slug === 'gtu')!, '2012')
    expect(classLabel(7.1, gtu.equivalence!.bands)).toBe('First Class with Distinction')
    expect(classLabel(5.4, gtu.equivalence!.bands)).toBe('Pass Class')
  })

  it('accepts a negative custom adjustment, which is how an offset formula is written', () => {
    const formula = customFormula(10, -7.5)
    expect(cgpaToPercentage(8.2, formula).percentage).toBeCloseTo(74.5, 8)
    expect(parseDecimal('-7.5')).toBe(-7.5)
    expect(parseDecimal('8,20')).toBe(8.2)
  })

  it('formats decimals without trailing zeros', () => {
    expect(formatNumber(74.5)).toBe('74.5')
    expect(formatNumber(82)).toBe('82')
    expect(formatNumber(86.6)).toBe('86.6')
    expect(formatNumber(7.1)).toBe('7.1')
  })
})
