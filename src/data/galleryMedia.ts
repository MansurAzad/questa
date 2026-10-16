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
// NOTE: `videoUrl` values below point at public sample MP4s so the player is
// functional out of the box — replace them with the real project footage
// (CDN / S3 / YouTube embed) when available.
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
      title: `Questa World Project Site — Progress Photo ${n}`,
      project: 'Questa World Development',
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
    project: 'Questa Royal Bay Hotel & Suites',
    date: 'May 2026',
    tag: '3D Render',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'rend-2',
    kind: 'photo',
    category: 'render',
    title: 'Commercial Center Concept — Double-Height Retail Atrium',
    project: 'Questa World Commercial Center - Mirpur',
    date: 'March 2026',
    tag: '3D Render',
    imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'rend-3',
    kind: 'photo',
    category: 'render',
    title: 'Resort Master Plan — Landscape, Boardwalk & Amenity Deck',
    project: 'Questa Royal Bay Hotel & Suites',
    date: 'February 2026',
    tag: 'Master Plan',
    imageUrl: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&auto=format&fit=crop&q=80'
  },

  // ----------------------------- VIDEOS ----------------------------------
  {
    id: 'vid-1',
    kind: 'video',
    category: 'aerial',
    title: "Aerial Drone Flyover — Cox's Bazar Coastal Site",
    project: 'Questa Royal Bay Hotel & Suites',
    date: 'September 2026',
    tag: 'Drone Video',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=1200&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
  },
  {
    id: 'vid-2',
    kind: 'video',
    category: 'construction',
    title: 'Monthly Progress Walkthrough — Structural Floors & Façade',
    project: 'Questa Royal Bay Hotel & Suites',
    date: 'August 2026',
    tag: 'Site Walkthrough',
    imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1200&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
  },
  {
    id: 'vid-3',
    kind: 'video',
    category: 'render',
    title: '3D Concept Walkthrough — Questa World Commercial Center',
    project: 'Questa World Commercial Center - Mirpur',
    date: 'July 2026',
    tag: '3D Walkthrough',
    imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  }
];
