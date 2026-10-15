import award1 from '../assets/certs/award-1.enc?url'
import award2 from '../assets/certs/award-2.enc?url'
import award3 from '../assets/certs/award-3.enc?url'
import award4 from '../assets/certs/award-4.enc?url'

/*
 * Certificates are stored AES-GCM encrypted (12-byte IV + ciphertext), so the repo and the
 * built page never hold a plain image file. They are decrypted in the browser only when opened.
 */
export const certFiles = [award1, award2, award3, award4]

const parts = ['=47R6QtMYyvGP7', '2dyN03aiPXiZXTH', 'oudujIWQey5wD4U']
let keyPromise: Promise<CryptoKey> | null = null
const key = () =>
  (keyPromise ??= crypto.subtle.importKey(
    'raw',
    Uint8Array.from(atob(parts[1] + parts[2].split('').reverse().join('') + parts[0].split('').reverse().join('')), (ch) => ch.charCodeAt(0)),
    'AES-GCM',
    false,
    ['decrypt'],
  ))

const cache = new Map<string, Promise<ImageBitmap>>()

export function loadCert(url: string): Promise<ImageBitmap> {
  let p = cache.get(url)
  if (!p) {
    p = (async () => {
      // decode the inlined data: URL by hand; fetch() on data: URLs is blocked on some hosts
      const b64 = url.slice(url.indexOf(',') + 1)
      const buf = Uint8Array.from(atob(b64), (ch) => ch.charCodeAt(0))
      const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: buf.slice(0, 12) }, await key(), buf.slice(12))
      return createImageBitmap(new Blob([plain], { type: 'image/webp' }))
    })()
    cache.set(url, p)
  }
  return p
}
