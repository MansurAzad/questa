import React, { useEffect, useState } from 'react';
import { Camera, Play, Maximize2, X, MapPin, Calendar, Film } from 'lucide-react';
import { Language } from '../../types';
import {
  GALLERY_MEDIA,
  GalleryMediaItem,
  GalleryMediaKind,
  GalleryMediaCategory
} from '../../data/galleryMedia';

export interface MediaGalleryFilter {
  kind?: GalleryMediaKind;
  category?: GalleryMediaCategory;
}

interface MediaGalleryProps {
  language: Language;
  /** Anchor id used by the header navigation and footer links. */
  sectionId?: string;
  /** CMS-driven copy. */
  cmsTitle?: string;
  cmsSubtitle?: string;
  cmsBody?: string;
  /** Which slice of the shared media library this section renders. */
  filter?: MediaGalleryFilter;
  /** Small uppercase badge shown above the title. */
  badge?: string;
  /** Alternate the section background for visual rhythm between stacked sections. */
  tone?: 'light' | 'muted';
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  sectionId = 'gallery',
  cmsTitle,
  cmsSubtitle,
  cmsBody,
  filter,
  badge,
  tone = 'light'
}) => {
  const [lightboxItem, setLightboxItem] = useState<GalleryMediaItem | null>(null);

  const items = GALLERY_MEDIA.filter(item => {
    if (!filter) return true;
    if (filter.kind && item.kind !== filter.kind) return false;
    if (filter.category && item.category !== filter.category) return false;
    return true;
  });

  const isVideoSection = items.length > 0 && items.every(i => i.kind === 'video');

  // Lock background scroll + close on Escape while the lightbox is open.
  useEffect(() => {
    if (!lightboxItem) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxItem(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [lightboxItem]);

  if (items.length === 0) return null;

  return (
    <section
      id={sectionId}
      className={`scroll-mt-20 pt-6 pb-10 sm:pt-8 sm:pb-14 md:pt-11 md:pb-20 border-b border-slate-200 dark:border-slate-800 transition-colors ${
        tone === 'muted' ? 'bg-slate-50 dark:bg-slate-950' : 'bg-white dark:bg-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">

        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
            {isVideoSection ? <Film className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
            <span>{badge || (isVideoSection ? 'Video Tours' : 'Project Media')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {cmsTitle || 'Project Media Gallery'}
          </h2>
          {cmsSubtitle && (
            <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300">
              {cmsSubtitle}
            </p>
          )}
          {cmsBody && (
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {cmsBody}
            </p>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {items.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightboxItem(item)}
              aria-label={`Open ${item.title}`}
              className="group relative text-left overflow-hidden rounded-2xl bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

              {/* Video play affordance */}
              {item.kind === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="w-14 h-14 rounded-full bg-amber-600/90 text-white flex items-center justify-center shadow-lg ring-4 ring-white/20 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 translate-x-0.5" fill="currentColor" />
                  </span>
                </div>
              )}

              {/* Content on Image */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between pointer-events-none">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                    {item.tag}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-amber-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-amber-300 font-medium">
                    {item.project} · {item.date}
                  </span>
                  <h3 className="font-bold text-white text-sm line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          onClick={() => setLightboxItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="max-w-4xl w-full bg-slate-900 rounded-2xl sm:rounded-3xl max-h-[90vh] overflow-y-auto border border-slate-800 shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxItem(null)}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-video bg-black">
              {lightboxItem.kind === 'video' && lightboxItem.videoUrl ? (
                <video
                  src={lightboxItem.videoUrl}
                  poster={lightboxItem.imageUrl}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={lightboxItem.imageUrl}
                  alt={lightboxItem.title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-amber-400 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {lightboxItem.project}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {lightboxItem.date}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {lightboxItem.title}
                </h3>
              </div>

              <button
                onClick={() => setLightboxItem(null)}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shrink-0"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
