import { CUSTOM_PRESET_ID, getPreset } from '@/data/presets'

export type CalcMode = 'cgpa' | 'pct' | 'sgpa'

export interface SemesterDraft {
  sgpa: string
  credits: string
}

export interface ShareState {
  preset: string
  scheme: string
  mode: CalcMode
  cgpa: string
  pct: string
  semesters: SemesterDraft[]
  slope: string
  intercept: string
  scale: string
}

function isMode(value: string | null): value is CalcMode {
  return value === 'cgpa' || value === 'pct' || value === 'sgpa'
}

export function buildSharePath(state: ShareState): string {
  const params = new URLSearchParams()
  const preset = state.preset === CUSTOM_PRESET_ID ? undefined : getPreset(state.preset)
  const path = preset ? `/cgpa-to-percentage/${preset.slug}/` : '/cgpa-to-percentage/'

  if (!preset) {
    params.set('preset', CUSTOM_PRESET_ID)
    if (state.slope.trim()) params.set('slope', state.slope.trim())
    if (state.intercept.trim()) params.set('intercept', state.intercept.trim())
    if (state.scale.trim() && state.scale.trim() !== '10') params.set('scale', state.scale.trim())
  } else if (preset.schemes.length > 1 && state.scheme) {
    params.set('scheme', state.scheme)
  }

  params.set('mode', state.mode)
  if (state.mode === 'cgpa' && state.cgpa.trim()) params.set('cgpa', state.cgpa.trim())
  if (state.mode === 'pct' && state.pct.trim()) params.set('pct', state.pct.trim())
  if (state.mode === 'sgpa') {
    const encoded = state.semesters
      .filter((row) => row.sgpa.trim() || row.credits.trim())
      .map((row) => `${row.sgpa.trim()}:${row.credits.trim()}`)
      .join(',')
    if (encoded) params.set('sem', encoded)
  }

  const query = params.toString()
  return query ? `${path}?${query}` : path
}

export function parseShareSearch(search: string): Partial<ShareState> {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const partial: Partial<ShareState> = {}
  const preset = params.get('preset')
  if (preset) partial.preset = preset
  const scheme = params.get('scheme')
  if (scheme) partial.scheme = scheme
  const mode = params.get('mode')
  if (isMode(mode)) partial.mode = mode
  const cgpa = params.get('cgpa')
  if (cgpa) partial.cgpa = cgpa
  const pct = params.get('pct')
  if (pct) partial.pct = pct
  const slope = params.get('slope')
  if (slope) partial.slope = slope
  const intercept = params.get('intercept')
  if (intercept) partial.intercept = intercept
  const scale = params.get('scale')
  if (scale) partial.scale = scale
  const sem = params.get('sem')
  if (sem) {
    partial.semesters = sem.split(',').map((pair) => {
      const [sgpa = '', credits = ''] = pair.split(':')
      return { sgpa, credits }
    })
  }
  return partial
}
