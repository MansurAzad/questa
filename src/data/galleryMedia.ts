// ---------------------------------------------------------------------------
// Public homepage media library.
//
// The public site is composed of a handful of photo & video gallery sections.
// Every section renders a curated slice of this single library (see the CMS
// section ids `gallery`, `gallery-videos`, `gallery-renders`).
//
// Real on-site photographs live in `public/gallery/` and are referenced with
// root-relative paths (e.g. `/gallery/gallery-01.jpeg`).
//
// Real site videos live in `public/videos/` (compressed for web playback) with
// poster frames in `public/videos/posters/`.
// ---------------------------------------------------------------------------

export type GalleryMediaKind = 'photo' | 'video';

export type GalleryMediaCategory = 'construction' | 'aerial' | 'event' | 'render';

export interface GalleryMediaItem {
  id: string;
  kind: GalleryMediaKind;
  category: GalleryMediaCategory;
  title: string;
  project: string;
  date: string;
  tag: string;
  /** The photo itself, or the poster frame shown before a video plays. */
  imageUrl: string;
  /** Only present when `kind === 'video'`. */
  videoUrl?: string;
}

/** Number of real on-site photographs shipped in `public/gallery/`. */
const SITE_PHOTO_COUNT = 19;

const SITE_PHOTOS: GalleryMediaItem[] = Array.from(
  { length: SITE_PHOTO_COUNT },
  (_, index): GalleryMediaItem => {
    const n = String(index + 1).padStart(2, '0');
    return {
      id: `site-${n}`,
      kind: 'photo',
      category: 'construction',
      title: `Questra World Project Site — Progress Photo ${n}`,
      project: 'Questra World Development',
      date: 'October 2026',
      tag: 'Site Photo',
      imageUrl: `/gallery/gallery-${n}.jpeg`
    };
  }
);

export const GALLERY_MEDIA: GalleryMediaItem[] = [
  // --------------------------- SITE PHOTOS -------------------------------
  ...SITE_PHOTOS,

  // --------------------------- 3D RENDERS --------------------------------
  {
    id: 'rend-1',
    kind: 'photo',
    category: 'render',
    title: 'Architectural 3D Render — Oceanfront Infinity Pool & Sky Lounge',
    project: 'Questra Royal Bay Hotel & Suites',
    date: 'May 2026',
    tag: '3D Render',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'rend-2',
    kind: 'photo',
    category: 'render',
    title: 'Commercial Center Concept — Double-Height Retail Atrium',
    project: 'Questra World Commercial Center - Mirpur',
    date: 'March 2026',
    tag: '3D Render',
    imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'rend-3',
    kind: 'photo',
    category: 'render',
    title: 'Resort Master Plan — Landscape, Boardwalk & Amenity Deck',
    project: 'Questra Royal Bay Hotel & Suites',
    date: 'February 2026',
    tag: 'Master Plan',
    imageUrl: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&auto=format&fit=crop&q=80'
  },

  // ----------------------------- VIDEOS ----------------------------------
  ...Array.from({ length: 6 }, (_, index): GalleryMediaItem => {
    const n = String(index + 1).padStart(2, '0');
    return {
      id: `video-${n}`,
      kind: 'video',
      category: 'construction',
      title: `Questra World Project Site — Video Tour ${n}`,
      project: 'Questra World Development',
      date: 'October 2026',
      tag: 'Site Video',
      imageUrl: `/videos/posters/tour-${n}.jpg`,
      videoUrl: `/videos/tour-${n}.mp4`
    };
  })
];
