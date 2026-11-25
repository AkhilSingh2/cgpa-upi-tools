import { describe, expect, it } from 'vitest'
import { PRESETS } from '@/data/presets'
import { formulaExpression } from '@/lib/cgpa'

describe('preset catalogue', () => {
  it('has unique slugs, a real source for every scheme, and indexable titles', () => {
    const slugs = PRESETS.map((preset) => preset.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const preset of PRESETS) {
      expect(preset.title.length).toBeLessThanOrEqual(42)
      expect(preset.description.length).toBeGreaterThanOrEqual(110)
      expect(preset.description.length).toBeLessThanOrEqual(170)
      expect(preset.h1.toLowerCase()).toContain(preset.shortName.toLowerCase().split(' ')[0].toLowerCase())
      expect(preset.faqs.length).toBeGreaterThanOrEqual(4)
      expect(preset.schemes.map((scheme) => scheme.id)).toContain(preset.defaultScheme)
      for (const scheme of preset.schemes) {
        expect(scheme.source.url.startsWith('https://')).toBe(true)
        expect(scheme.source.quote.length).toBeGreaterThan(20)
        expect(formulaExpression(scheme.formula).length).toBeGreaterThan(10)
        expect(scheme.formula.kind === 'linear' ? scheme.formula.slope : scheme.formula.factor).not.toBe(0)
      }
    }
  })
})
