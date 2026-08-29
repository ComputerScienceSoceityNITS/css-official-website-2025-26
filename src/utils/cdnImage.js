/**
 * Ask Cloudinary for a right-sized image instead of the original.
 *
 * Every URL in gallery.json points at an untransformed original — full
 * resolution camera JPEGs, megabytes each. Inserting a transform segment
 * after `/image/upload/` makes Cloudinary render and cache a derived copy:
 *
 *   f_auto   modern format (AVIF/WebP) when the browser accepts it
 *   q_auto   quality chosen per image
 *   c_limit  never upscale, preserve aspect ratio
 *   w_<n>    cap the width
 *
 * Anything that is not a plain Cloudinary upload URL is returned untouched,
 * and callers should keep the original as an onError fallback.
 */
const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/

export function cdnImage(url, width, extra = '') {
  if (typeof url !== 'string') return url
  const m = url.match(CLOUDINARY_UPLOAD)
  if (!m) return url

  const [, base, rest] = m
  // Only touch URLs that carry no transform yet — `rest` should start with the
  // version segment (v1234567/...). Anything else already has directives.
  if (!/^v\d+\//.test(rest)) return url

  const params = ['f_auto', 'q_auto', 'c_limit', `w_${width}`]
  if (extra) params.push(extra)
  return `${base}${params.join(',')}/${rest}`
}

/** Widths used across the gallery. */
export const IMG = {
  tile: 480, // grid thumbnails
  wall: 320, // drifting hero tiles
  full: 1600, // lightbox
}

/** srcSet for the grid so dense screens get a sharper file when they need it. */
export function cdnSrcSet(url, base = IMG.tile) {
  const a = cdnImage(url, base)
  const b = cdnImage(url, base * 2)
  return a === b ? undefined : `${a} 1x, ${b} 2x`
}
