export const UPI_VPA_MAX = 255
export const UPI_NAME_MAX = 80
export const UPI_NOTE_MAX = 50
export const UPI_AMOUNT_MAX = 1_000_000
export const UPI_AMOUNT_WARN = 100_000

const VPA_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._-]{1,254}@[a-zA-Z][a-zA-Z0-9]{1,63}$/
const NAME_PATTERN = /^[\p{L}\p{M}\p{N} .&'’(),/-]{1,80}$/u

export type UpiField = 'pa' | 'pn' | 'am' | 'tn'

export type UpiLinkOk = {
  ok: true
  url: string
  pa: string
  pn: string
  am: string | null
  tn: string | null
  highAmount: boolean
}

export type UpiLinkErr = { ok: false; field: UpiField; message: string }

export type UpiLinkResult = UpiLinkOk | UpiLinkErr

export interface UpiLinkInput {
  pa: string
  pn: string
  am?: string
  tn?: string
}

export function isValidVpa(value: string): boolean {
  if (value.length < 5 || value.length > UPI_VPA_MAX) return false
  if (!VPA_PATTERN.test(value)) return false
  const at = value.indexOf('@')
  const local = value.slice(0, at)
  if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false
  return true
}

function cleanName(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f]/g, '').trim()
}

function cleanNote(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim()
}

export function normalizeAmount(input: string): { ok: true; value: string | null; high: boolean } | { ok: false; message: string } {
  const trimmed = input.trim()
  if (!trimmed) return { ok: true, value: null, high: false }
  const cleaned = trimmed.replace(/[₹,\s]/g, '')
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(cleaned)) {
    return {
      ok: false,
      message: 'Enter an amount in rupees with up to 2 decimal places, or leave it blank.',
    }
  }
  const decimals = cleaned.includes('.') ? cleaned.split('.')[1].length : 0
  const amount = Number(cleaned)
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, message: 'A fixed amount has to be greater than zero. Leave it blank to let the payer decide.' }
  }
  if (amount > UPI_AMOUNT_MAX) {
    return { ok: false, message: 'Enter an amount up to ₹10,00,000.' }
  }
  const value = decimals === 0 ? String(amount) : amount.toFixed(decimals)
  return { ok: true, value, high: amount > UPI_AMOUNT_WARN }
}

function encodeParam(value: string): string {
  return encodeURIComponent(value)
}

export function buildUpiUrl(fields: { pa: string; pn: string; am: string | null; tn: string | null }): string {
  const pairs: [string, string][] = [
    ['pa', fields.pa],
    ['pn', fields.pn],
  ]
  if (fields.am) pairs.push(['am', fields.am])
  pairs.push(['cu', 'INR'])
  if (fields.tn) pairs.push(['tn', fields.tn])
  return `upi://pay?${pairs.map(([key, value]) => `${key}=${encodeParam(value)}`).join('&')}`
}

export function buildUpiLink(input: UpiLinkInput): UpiLinkResult {
  const pa = input.pa.trim()
  const pn = cleanName(input.pn)
  const tn = cleanNote(input.tn ?? '')

  if (!pa) {
    return { ok: false, field: 'pa', message: 'Enter a UPI ID, such as name@okaxis or 9876543210@ybl.' }
  }
  if (!isValidVpa(pa)) {
    return {
      ok: false,
      field: 'pa',
      message: 'Use a UPI ID like name@okaxis: letters or digits, then @, then the handle. No spaces.',
    }
  }
  if (!pn) {
    return { ok: false, field: 'pn', message: 'Enter the payee name people should see.' }
  }
  if (pn.length > UPI_NAME_MAX || !NAME_PATTERN.test(pn) || !/[\p{L}\p{N}]/u.test(pn)) {
    return {
      ok: false,
      field: 'pn',
      message: `Enter a name up to ${UPI_NAME_MAX} characters, using letters, numbers, and simple punctuation.`,
    }
  }
  const amount = normalizeAmount(input.am ?? '')
  if (!amount.ok) return { ok: false, field: 'am', message: amount.message }
  if (tn.length > UPI_NOTE_MAX) {
    return { ok: false, field: 'tn', message: `Keep the note to ${UPI_NOTE_MAX} characters.` }
  }

  return {
    ok: true,
    url: buildUpiUrl({ pa, pn, am: amount.value, tn: tn || null }),
    pa,
    pn,
    am: amount.value,
    tn: tn || null,
    highAmount: amount.high,
  }
}

export function downloadSlug(name: string): string {
  const slug = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
  return slug || 'upi'
}
