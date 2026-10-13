// ---------------------------------------------------------------------------
// Homepage CMS (Content Management System) data model.
//
// The admin dashboard manages the public homepage through this model:
//   • CmsSection        → a homepage section (visibility, order, heading text)
//   • CmsCollectionItem → repeatable content items (features, testimonials, FAQs)
//   • CmsSiteSettings   → global brand / contact / copyright content
// ---------------------------------------------------------------------------

export type CmsCollectionKey = 'features' | 'testimonials' | 'faqs';

export type CmsSectionKind = 'standard' | 'collection';

export interface CmsSection {
  /** Stable identifier used as the anchor / render key. */
  id: string;
  /** Human readable name shown in the admin controller. */
  label: string;
  kind: CmsSectionKind;
  /** Which collection powers the section when kind === 'collection'. */
  collectionKey?: CmsCollectionKey;
  title: string;
  subtitle: string;
  body: string;
  /** Optional call-to-action label override used by standard sections. */
  ctaLabel: string;
  visible: boolean;
  order: number;
  updatedAt?: string;
}

export interface CmsCollectionItem {
  id: string;
  collection: CmsCollectionKey;
  title: string;
  subtitle?: string;
  body: string;
  imageUrl?: string;
  badge?: string;
  order: number;
  updatedAt?: string;
}

export interface CmsSiteSettings {
  brandName: string;
  legalName: string;
  tagline: string;
  supportPhone: string;
  supportEmail: string;
  corporateAddress: string;
  footerNote: string;
  copyrightText: string;
  updatedAt?: string;
}
