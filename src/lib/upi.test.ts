import { describe, expect, it } from 'vitest'
import { buildUpiLink, buildUpiUrl, isValidVpa, normalizeAmount } from '@/lib/upi'

describe('UPI ID validation', () => {
  it('accepts common VPA shapes', () => {
    for (const id of ['shop@okaxis', 'user.name@okhdfcbank', 'user-name@paytm', 'user_name@ibl', '9876543210@ybl', 'A.B@okaxis']) {
      expect(isValidVpa(id)).toBe(true)
    }
  })

  it('rejects malformed VPAs', () => {
    for (const id of ['', 'shop', '@okaxis', 'shop@', 'shop@@okaxis', 'shop name@paytm', 'a@ok', '.shop@okaxis', 'shop.@okaxis', 'shop..name@okaxis', 'shop@1axis', `ok@${'a'.repeat(80)}`]) {
      expect(isValidVpa(id)).toBe(false)
    }
  })
})

describe('upi://pay links', () => {
  it('builds a stable link and omits blank amount and note', () => {
    const result = buildUpiLink({ pa: ' shop@okaxis ', pn: ' Ravi Stores ', am: '', tn: '   ' })
    expect(result).toEqual({
      ok: true,
      url: 'upi://pay?pa=shop%40okaxis&pn=Ravi%20Stores&cu=INR',
      pa: 'shop@okaxis',
      pn: 'Ravi Stores',
      am: null,
      tn: null,
      highAmount: false,
    })
  })

  it('encodes amount, note, and punctuation in the name', () => {
    const result = buildUpiLink({
      pa: 'shop@okaxis',
      pn: 'Agarwal & Sons',
      am: '₹ 1,250.50',
      tn: 'Table 3',
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.am).toBe('1250.50')
      expect(result.url).toBe(
        'upi://pay?pa=shop%40okaxis&pn=Agarwal%20%26%20Sons&am=1250.50&cu=INR&tn=Table%203',
      )
      expect(result.highAmount).toBe(false)
    }
  })

  it('keeps currency INR even when the amount is a whole number', () => {
    expect(buildUpiUrl({ pa: 'a@ok', pn: 'A', am: '10', tn: null })).toBe(
      'upi://pay?pa=a%40ok&pn=A&am=10&cu=INR',
    )
  })

  it('warns above one lakh and rejects zero, negatives, and extra decimals', () => {
    const high = buildUpiLink({ pa: 'shop@okaxis', pn: 'Ravi Stores', am: '150000', tn: '' })
    expect(high.ok).toBe(true)
    if (high.ok) expect(high.highAmount).toBe(true)

    expect(normalizeAmount('100000')).toMatchObject({ ok: true, high: false, value: '100000' })
    expect(buildUpiLink({ pa: 'shop@okaxis', pn: 'Ravi Stores', am: '0', tn: '' }).ok).toBe(false)
    expect(buildUpiLink({ pa: 'shop@okaxis', pn: 'Ravi Stores', am: '-5', tn: '' }).ok).toBe(false)
    expect(buildUpiLink({ pa: 'shop@okaxis', pn: 'Ravi Stores', am: '10.999', tn: '' }).ok).toBe(false)
    expect(buildUpiLink({ pa: 'shop@okaxis', pn: 'Ravi Stores', am: '10.', tn: '' }).ok).toBe(false)
    expect(buildUpiLink({ pa: 'shop@okaxis', pn: 'Ravi Stores', am: '1000001', tn: '' }).ok).toBe(false)
  })

  it('rejects an empty name, a long note, and a name that is only punctuation', () => {
    expect(buildUpiLink({ pa: 'shop@okaxis', pn: '   ', am: '', tn: '' })).toMatchObject({ ok: false, field: 'pn' })
    expect(buildUpiLink({ pa: 'shop@okaxis', pn: '...', am: '', tn: '' })).toMatchObject({ ok: false, field: 'pn' })
    expect(buildUpiLink({ pa: 'shop@okaxis', pn: 'Ravi Stores', am: '', tn: 'x'.repeat(51) })).toMatchObject({
      ok: false,
      field: 'tn',
    })
  })

  it('percent-encodes a non-Latin payee name', () => {
    const result = buildUpiLink({ pa: 'shop@upi', pn: 'कैफे', am: '', tn: '' })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.url).toContain('pn=%E0%A4%95')
      expect(decodeURIComponent(result.url.split('pn=')[1].split('&')[0])).toBe('कैफे')
    }
  })
})
