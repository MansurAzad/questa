// ---------------------------------------------------------------------------
// Public homepage media library.
//
// The public homepage is composed of a handful of photo & video gallery sections.
// Every section renders a curated slice of this single library (see the CMS
// section ids `gallery` and `gallery-videos`).
//
// Real progress photographs live in `public/gallery/` and are referenced with
// root-relative paths (e.g. `/gallery/gallery-01.jpeg`).
//
// Real project videos live in `public/videos/` (compressed for web playback) with
// poster frames in `public/videos/posters/`.
// ---------------------------------------------------------------------------

export type GalleryMediaKind = 'photo' | 'video';

export type GalleryMediaCategory = 'development' | 'aerial' | 'event';

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

/** Number of real progress photographs shipped in `public/gallery/`. */
const SITE_PHOTO_COUNT = 19;

const SITE_PHOTOS: GalleryMediaItem[] = Array.from(
  { length: SITE_PHOTO_COUNT },
  (_, index): GalleryMediaItem => {
    const n = String(index + 1).padStart(2, '0');
    return {
      id: `project-${n}`,
      kind: 'photo',
      category: 'development',
      title: `Questra World Project — Progress Photo ${n}`,
      project: 'Questra World Development',
      date: 'October 2026',
      tag: 'Project Photo',
      imageUrl: `/gallery/gallery-${n}.jpeg`
    };
  }
);

export const GALLERY_MEDIA: GalleryMediaItem[] = [
  // --------------------------- PROJECT PHOTOS -------------------------------
  ...SITE_PHOTOS,

  // ----------------------------- VIDEOS ----------------------------------
  ...Array.from({ length: 6 }, (_, index): GalleryMediaItem => {
    const n = String(index + 1).padStart(2, '0');
    return {
      id: `video-${n}`,
      kind: 'video',
      category: 'development',
      title: `Questra World Project — Video Tour ${n}`,
      project: 'Questra World Development',
      date: 'October 2026',
      tag: 'Project Video',
      imageUrl: `/videos/posters/tour-${n}.jpg`,
      videoUrl: `/videos/tour-${n}.mp4`
    };
  })
];
