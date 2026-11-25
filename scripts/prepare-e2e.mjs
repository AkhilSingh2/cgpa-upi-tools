import { cp, mkdir, rm } from 'node:fs/promises'

await rm('e2e-dist', { recursive: true, force: true })
await mkdir('e2e-dist/cgpa-upi-tools', { recursive: true })
await cp('out', 'e2e-dist/cgpa-upi-tools', { recursive: true })
