'use client'

import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { Alert, Button, Card, CardBody, Input } from '@sutra-ui/react'
import { buildUpiLink, downloadSlug, UPI_NOTE_MAX, type UpiLinkResult } from '@/lib/upi'

// Module colours stay dark on white so a phone can scan the code. They are not theme colours.
const QR_OPTIONS = {
  errorCorrectionLevel: 'H' as const,
  margin: 4,
  color: { dark: '#14221c', light: '#ffffff' },
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
      await navigator.clipboard.writeText(result.url)
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
    <div className="hm-tool">
      <div className="no-print hm-form">
        <Alert tone="info" title="Nothing leaves this browser.">
          The UPI ID, name, amount, note, and logo are used only on this device to build the QR code. Hundredmark is not affiliated with NPCI, BHIM, or any bank or UPI app.
        </Alert>
        <Card>
          <CardBody className="hm-form">
            <form
              className="hm-form"
              onSubmit={(event) => {
                event.preventDefault()
                setTouched(true)
              }}
            >
              <Input
                label="UPI ID"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder="shop@okaxis"
                value={pa}
                hint="The address people pay, such as name@okhdfcbank or 9876543210@ybl."
                error={fieldError?.field === 'pa' ? fieldError.message : undefined}
                onBlur={() => setTouched(true)}
                onChange={(event) => setPa(event.target.value)}
              />
              <Input
                label="Payee name"
                autoComplete="organization"
                placeholder="Ravi Stores"
                value={pn}
                hint="This name is stored in the QR and printed on the poster."
                error={fieldError?.field === 'pn' ? fieldError.message : undefined}
                onBlur={() => setTouched(true)}
                onChange={(event) => setPn(event.target.value)}
              />
              <div className="hm-split">
                <Input
                  label="Amount in ₹, optional"
                  inputMode="decimal"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="Leave blank"
                  value={am}
                  hint="Leave this blank and the payer types the amount in their app."
                  error={fieldError?.field === 'am' ? fieldError.message : undefined}
                  onChange={(event) => setAm(event.target.value)}
                />
                <Input
                  label="Note, optional"
                  maxLength={UPI_NOTE_MAX}
                  value={tn}
                  placeholder="Counter 2"
                  error={fieldError?.field === 'tn' ? fieldError.message : undefined}
                  onChange={(event) => setTn(event.target.value)}
                />
              </div>
              <Input
                label="Logo for the poster, optional"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                hint="The file is not uploaded. Remove it any time."
                error={logoError || undefined}
                onChange={(event) => onLogo(event.target.files?.[0])}
              />
              {logo ? (
                <Button type="button" variant="ghost" onClick={() => setLogo('')}>
                  Remove logo
                </Button>
              ) : null}
              {result.ok && result.highAmount ? (
                <Alert tone="warning" title="Above ₹1,00,000">
                  Many banks cap one UPI payment at ₹1,00,000. The QR still contains this amount.
                </Alert>
              ) : null}
              <div className="hm-actions">
                <Button type="button" variant="primary" disabled={!result.ok} onClick={copyLink}>
                  Copy UPI link
                </Button>
                <Button type="button" variant="secondary" disabled={!result.ok} onClick={downloadPng}>
                  Download PNG
                </Button>
                <Button type="button" variant="secondary" disabled={!result.ok || !svg} onClick={downloadSvg}>
                  Download SVG
                </Button>
                <Button type="button" variant="secondary" disabled={!result.ok} onClick={() => window.print()}>
                  Print poster
                </Button>
              </div>
              <Input className="hm-mono" label="UPI payment link" readOnly value={result.ok ? result.url : ''} onFocus={(event) => event.currentTarget.select()} />
              <p className="sutra-hint" aria-live="polite">
                {copyState === 'copied' ? 'Copied UPI link.' : copyState === 'manual' ? 'Select the link and copy it.' : 'A standard upi://pay link. No server is involved.'}
              </p>
            </form>
          </CardBody>
        </Card>
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
