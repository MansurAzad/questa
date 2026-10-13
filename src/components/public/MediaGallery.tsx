import React, { useState } from 'react';
import {
  Camera,
  Play,
  Maximize2,
  X,
  Compass,
  MapPin,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { Language } from '../../types';

interface MediaItem {
  id: string;
  title: string;
  titleBn: string;
  project: string;
  projectBn: string;
  category: 'construction' | 'aerial' | 'event' | 'render';
  imageUrl: string;
  date: string;
  tag: string;
  tagBn: string;
}

interface MediaGalleryProps {
  language: Language;
  /** CMS overrides */
  cmsTitle?: string;
  cmsSubtitle?: string;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({ language, cmsTitle, cmsSubtitle }) => {
  const isBn = language === 'bn';
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);

  const mediaItems: MediaItem[] = [
    {
      id: 'med-1',
      title: 'Questa Royal Bay Hotel & Suites - Hurricane-Grade Glass Façade Installation',
      titleBn: 'Questa Royal Bay Hotel & Suites - Hurricane-Resistant Glass Facade Installation',
      project: 'Questa Royal Bay Hotel & Suites',
      projectBn: 'Questa Royal Bay Hotel & Suites',
      category: 'construction',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80',
      date: 'September 2026',
      tag: 'Hospitality',
      tagBn: 'Hospitality'
    },
    {
      id: 'med-2',
      title: 'Questa Royal Bay Luxury Hotel & Suites - 12-Story Superstructure',
      titleBn: 'Questa Royal Bay Luxury Resort - 12-Story Superstructure',
      project: 'Questa Royal Bay Hotel & Suites',
      projectBn: 'Questa Royal Bay Hotel & Suites',
      category: 'construction',
      imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=80',
      date: 'August 2026',
      tag: 'Hospitality',
      tagBn: 'Hospitality'
    },
    {
      id: 'med-3',
      title: 'Aerial Drone View - Questa Royal Bay Beachfront Superstructure & Infinity Pool',
      titleBn: 'Drone View - Questa Royal Bay Beachfront Structure & Infinity Pool',
      project: 'Questa Royal Bay Hotel & Suites',
      projectBn: 'Questa Royal Bay Hotel & Suites',
      category: 'aerial',
      imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=800&auto=format&fit=crop&q=80',
      date: 'July 2026',
      tag: 'Aerial View',
      tagBn: 'Drone View'
    },
    {
      id: 'med-4',
      title: 'Share Ownership Certificate & Registered Deed Handover Ceremony',
      titleBn: 'Registered Deed & Share Certificate Handover to Investors',
      project: 'Corporate Event',
      projectBn: 'Corporate Event',
      category: 'event',
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
      date: 'June 2026',
      tag: 'Investor Meet',
      tagBn: 'Client Ceremony'
    },
    {
      id: 'med-5',
      title: 'Architectural 3D Renders: Oceanfront Infinity Pool & Sky Lounge',
      titleBn: 'Scenic 3D Design: Beachfront Infinity Pool & Sky Lounge',
      project: 'Questa Royal Bay Hotel & Suites',
      projectBn: 'Questa Royal Bay Hotel & Suites',
      category: 'render',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
      date: 'May 2026',
      tag: '3D Render',
      tagBn: '3D Design'
    },
    {
      id: 'med-6',
      title: 'Mirpur Pallabi Commercial Hub - Triple-Basement Deep Piling',
      titleBn: 'Pallabi Commercial Building - 3-Level Basement & Retail Space',
      project: 'Questa World Commercial Center - Mirpur',
      projectBn: 'Questa World Commercial Center - Mirpur',
      category: 'construction',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
      date: 'April 2026',
      tag: 'Commercial',
      tagBn: 'Commercial Building'
    }
  ];

  const filtered = activeCategory === 'all'
    ? mediaItems
    : mediaItems.filter(m => m.category === activeCategory);

  return (
    <section id="gallery" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5" />
              <span>{ 'Project Media & Video Tours'}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {cmsTitle || 'Live On-Site Development Progress'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {cmsSubtitle || (isBn
                ? 'Questa World Questa World, Questa World Questa World, Questa World Questa World Questa World Questa World Questa World Commercial Questa World Questa World Questa World Questa World।'
                : 'Witness transparent ground reality — deep piling, RCC superstructures, façade works, interior fitouts, and structural milestones.')}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label:  'All Media' },
              { id: 'construction', label:  'Construction' },
              { id: 'aerial', label:  'Aerial & Drone' },
              { id: 'event', label:  'Handover Events' },
              { id: 'render', label:  '3D Master Renders' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeCategory === tab.id
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="aspect-16/10 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

              {/* Content on Image */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                    { item.tag}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-amber-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-amber-300 font-medium">
                    { item.project} · {item.date}
                  </span>
                  <h3 className="font-bold text-white text-sm line-clamp-2">
                    { item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative animate-in fade-in zoom-in-95">
              
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-16/9 bg-black">
                <img
                  src={lightboxItem.imageUrl}
                  alt={lightboxItem.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
                    <span>{ lightboxItem.project}</span>
                    <span>·</span>
                    <span>{lightboxItem.date}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    { lightboxItem.title}
                  </h3>
                </div>

                <button
                  onClick={() => setLightboxItem(null)}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shrink-0"
                >
                  { 'Close Preview'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
