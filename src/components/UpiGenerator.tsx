'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { buildUpiLink, downloadSlug, UPI_NOTE_MAX, type UpiLinkResult } from '@/lib/upi'

const QR_OPTIONS = {
  errorCorrectionLevel: 'H' as const,
  margin: 4,
  color: { dark: '#14221c', light: '#ffffff' },
}

async function copyText(value: string) {
  await navigator.clipboard.writeText(value)
}

function saveFile(filename: string, href: string) {
  const link = document.createElement('a')
  link.href = href
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export function UpiGenerator() {
  const fieldId = useId()
  const [pa, setPa] = useState('')
  const [pn, setPn] = useState('')
  const [am, setAm] = useState('')
  const [tn, setTn] = useState('')
  const [logo, setLogo] = useState('')
  const [logoError, setLogoError] = useState('')
  const [svg, setSvg] = useState('')
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle')
  const [touched, setTouched] = useState(false)

  const result: UpiLinkResult = useMemo(() => buildUpiLink({ pa, pn, am, tn }), [am, pa, pn, tn])
  const started = pa.trim() !== '' || pn.trim() !== '' || am.trim() !== '' || tn.trim() !== ''

  useEffect(() => {
    if (!result.ok) {
      setSvg('')
      return
    }
    let cancelled = false
    QRCode.toString(result.url, { ...QR_OPTIONS, type: 'svg' })
      .then((markup) => {
        if (!cancelled) setSvg(markup.replace(/^<\?xml[^>]*>\s*/i, ''))
      })
      .catch(() => {
        if (!cancelled) setSvg('')
      })
    return () => {
      cancelled = true
    }
  }, [result])

  function onLogo(file: File | undefined) {
    setLogoError('')
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setLogoError('Choose a PNG, JPEG, WebP, or SVG image.')
      return
    }
    if (file.size > 1_500_000) {
      setLogoError('Choose an image under 1.5 MB. It stays on this device either way.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setLogo(typeof reader.result === 'string' ? reader.result : '')
    reader.onerror = () => setLogoError('That image could not be read. Try a different file.')
    reader.readAsDataURL(file)
  }

  async function copyLink() {
    if (!result.ok) return
    try {
      await copyText(result.url)
      setCopyState('copied')
    } catch {
      setCopyState('manual')
    }
    window.setTimeout(() => setCopyState('idle'), 2500)
  }

  async function downloadPng() {
    if (!result.ok) return
    const dataUrl = await QRCode.toDataURL(result.url, { ...QR_OPTIONS, width: 1024 })
    saveFile(`upi-${downloadSlug(result.pn)}.png`, dataUrl)
  }

  function downloadSvg() {
    if (!result.ok || !svg) return
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const href = URL.createObjectURL(blob)
    saveFile(`upi-${downloadSlug(result.pn)}.svg`, href)
    URL.revokeObjectURL(href)
  }

  const showError = touched || started
  const fieldError = showError && !result.ok ? result : null

  return (
    <div className="upi-layout">
      <div className="no-print">
        <p className="privacy-callout">
          <strong>Nothing leaves this browser.</strong> The UPI ID, name, amount, note, and logo are used only on this device to build the QR code. Hundredmark is not affiliated with NPCI, BHIM, or any bank or UPI app.
        </p>
        <form
          className="tool-form"
          onSubmit={(event) => {
            event.preventDefault()
            setTouched(true)
          }}
        >
          <div className="field">
            <label htmlFor={`${fieldId}-pa`}>UPI ID</label>
            <input
              id={`${fieldId}-pa`}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="shop@okaxis"
              value={pa}
              aria-invalid={fieldError?.field === 'pa'}
              aria-describedby={fieldError?.field === 'pa' ? `${fieldId}-error` : `${fieldId}-pa-hint`}
              onBlur={() => setTouched(true)}
              onChange={(event) => setPa(event.target.value)}
            />
            <p className="hint" id={`${fieldId}-pa-hint`}>
              The address people pay, such as name@okhdfcbank or 9876543210@ybl.
            </p>
          </div>
          <div className="field">
            <label htmlFor={`${fieldId}-pn`}>Payee name</label>
            <input
              id={`${fieldId}-pn`}
              autoComplete="organization"
              placeholder="Ravi Stores"
              value={pn}
              aria-invalid={fieldError?.field === 'pn'}
              aria-describedby={fieldError?.field === 'pn' ? `${fieldId}-error` : `${fieldId}-pn-hint`}
              onBlur={() => setTouched(true)}
              onChange={(event) => setPn(event.target.value)}
            />
            <p className="hint" id={`${fieldId}-pn-hint`}>
              This name is stored in the QR and printed on the poster.
            </p>
          </div>
          <div className="split">
            <div className="field">
              <label htmlFor={`${fieldId}-am`}>Amount in ₹, optional</label>
              <input
                id={`${fieldId}-am`}
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
                placeholder="Leave blank"
                value={am}
                aria-invalid={fieldError?.field === 'am'}
                aria-describedby={fieldError?.field === 'am' ? `${fieldId}-error` : `${fieldId}-am-hint`}
                onChange={(event) => setAm(event.target.value)}
              />
              <p className="hint" id={`${fieldId}-am-hint`}>
                Leave this blank and the payer types the amount in their app.
              </p>
            </div>
            <div className="field">
              <label htmlFor={`${fieldId}-tn`}>Note, optional</label>
              <input
                id={`${fieldId}-tn`}
                maxLength={UPI_NOTE_MAX}
                value={tn}
                aria-invalid={fieldError?.field === 'tn'}
                aria-describedby={fieldError?.field === 'tn' ? `${fieldId}-error` : undefined}
                placeholder="Counter 2"
                onChange={(event) => setTn(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor={`${fieldId}-logo`}>Logo for the poster, optional</label>
            <input
              id={`${fieldId}-logo`}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={(event) => onLogo(event.target.files?.[0])}
            />
            <p className="hint">The file is not uploaded. Remove it any time.</p>
            {logo ? (
              <button type="button" className="text-button" onClick={() => setLogo('')}>
                Remove logo
              </button>
            ) : null}
            {logoError ? (
              <p className="error" role="alert">
                {logoError}
              </p>
            ) : null}
          </div>
          {fieldError ? (
            <p className="error" id={`${fieldId}-error`} role="alert">
              {fieldError.message}
            </p>
          ) : null}
          {result.ok && result.highAmount ? (
            <p className="hint">Many banks cap one UPI payment at ₹1,00,000. The QR still contains this amount.</p>
          ) : null}
          <div className="actions">
            <button type="button" className="primary" disabled={!result.ok} onClick={copyLink}>
              Copy UPI link
            </button>
            <button type="button" className="secondary" disabled={!result.ok} onClick={downloadPng}>
              Download PNG
            </button>
            <button type="button" className="secondary" disabled={!result.ok || !svg} onClick={downloadSvg}>
              Download SVG
            </button>
            <button type="button" className="secondary" disabled={!result.ok} onClick={() => window.print()}>
              Print poster
            </button>
          </div>
          <div className="share-box">
            <label htmlFor={`${fieldId}-link`}>UPI payment link</label>
            <input id={`${fieldId}-link`} readOnly value={result.ok ? result.url : ''} onFocus={(event) => event.currentTarget.select()} />
            <p className="hint" aria-live="polite">
              {copyState === 'copied' ? 'Copied UPI link.' : copyState === 'manual' ? 'Select the link and copy it.' : 'A standard upi://pay link. No server is involved.'}
            </p>
          </div>
        </form>
      </div>

      <article className="standee" aria-label="Printable payment poster">
        <div className="standee-bar">Scan to pay</div>
        {logo ? <img className="standee-logo" src={logo} alt={pn.trim() ? `${pn.trim()} logo` : 'Payee logo'} /> : null}
        <h2>{result.ok ? result.pn : 'Your name'}</h2>
        {svg ? (
          <div
            className="qr-frame"
            role="img"
            aria-label={result.ok ? `UPI QR code for ${result.pn}, ${result.pa}` : 'UPI QR code'}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div className="qr-frame" role="img" aria-label="QR code waiting for a valid UPI ID and name">
            <p>Add a valid UPI ID and name to preview the poster.</p>
          </div>
        )}
        {result.ok && result.am ? <p className="standee-amount">₹{result.am}</p> : <p className="standee-amount quiet">Payer enters the amount</p>}
        {result.ok && result.tn ? <p className="standee-note">{result.tn}</p> : null}
        <p className="standee-vpa">{result.ok ? result.pa : 'name@upi'}</p>
        <p className="standee-foot">Any UPI app. Not an NPCI product. Made in your browser.</p>
      </article>
    </div>
  )
}
