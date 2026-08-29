import galleryData from '../jsonData/gallery.json'
import { cdnImage, IMG } from '../utils/cdnImage'

/**
 * Event photo gallery, sourced from src/jsonData/gallery.json.
 *
 * The file's `images` array is heterogeneous:
 *   - most events:  [ "https://…", … ]
 *   - CSS Olympics: [ { game: "futsal", images: [ "https://…", … ] }, … ]
 *
 * Both are normalised into `groups` — a list of { label, photos } — so a page
 * can render sub-headings where they exist and a single grid where they don't.
 * `photos` is the flattened list for that event.
 */

const slugify = (s = '') =>
  String(s)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'event'

const isUrl = (v) => typeof v === 'string' && /^https?:\/\//.test(v)

const toGroups = (images) => {
  if (!Array.isArray(images)) return []

  const groups = []
  let loose = null

  for (const entry of images) {
    if (isUrl(entry)) {
      // ungrouped photos collect into one unlabelled group
      if (!loose) {
        loose = { label: null, photos: [] }
        groups.push(loose)
      }
      loose.photos.push(entry)
    } else if (entry && typeof entry === 'object' && Array.isArray(entry.images)) {
      const photos = entry.images.filter(isUrl)
      if (photos.length) {
        groups.push({ label: entry.game || entry.label || null, photos })
      }
    }
  }

  return groups.filter((g) => g.photos.length > 0)
}

export const GALLERY_EVENTS = (galleryData?.events ?? [])
  .map((event) => {
    const groups = toGroups(event?.images)
    const photos = groups.flatMap((g) => g.photos)
    return {
      slug: slugify(event?.name),
      name: event?.name ?? 'Untitled event',
      year: event?.year ?? '',
      groups,
      photos,
    }
  })
  .filter((event) => event.photos.length > 0)

/**
 * A spread sample for the drifting hero wall.
 *
 * The wall clones its columns to fill the viewport, so feeding it all 270
 * photos would put many hundreds of tiles in the DOM. Taking an even stride
 * through each event keeps every event represented while capping the cost.
 * Sized to give a wide screen (up to 12 columns) a few distinct images per
 * column rather than obvious repeats.
 */
const HERO_MAX = 44

export const ALL_PHOTOS = (() => {
  const perEvent = Math.max(1, Math.ceil(HERO_MAX / Math.max(1, GALLERY_EVENTS.length)))
  const picked = []

  for (const event of GALLERY_EVENTS) {
    const stride = Math.max(1, Math.floor(event.photos.length / perEvent))
    for (let i = 0, taken = 0; i < event.photos.length && taken < perEvent; i += stride, taken += 1) {
      // Request a wall-sized derivative — the wall clones tiles, so full-res
      // originals here were the single heaviest thing on the page.
      picked.push({ image: cdnImage(event.photos[i], IMG.wall), title: event.name })
    }
  }

  return picked.slice(0, HERO_MAX)
})()

export default GALLERY_EVENTS
