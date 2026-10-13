import React, { useMemo, useRef, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Save,
  X,
  RotateCcw,
  Layers,
  ListChecks,
  Settings as SettingsIcon,
  GripVertical,
  Check
} from 'lucide-react';
import {
  CmsSection,
  CmsCollectionItem,
  CmsCollectionKey,
  CmsSiteSettings
} from '../../types/cms';
import { StorageService } from '../../services/storage';
import {
  compose,
  required,
  minLength,
  maxLength,
  email as emailRule,
  phone as phoneRule,
  runRules,
  RuleSet,
  Rule
} from '../../utils/validation';
import { FieldError, ValidationSummary, FieldHint, withValidation, focusFirstInvalid } from '../ui/Validation';

interface CmsManagerProps {
  onToast: (msg: string) => void;
}

type SubTab = 'sections' | 'content' | 'settings';

const optionalUrl = (label: string): Rule => v => {
  const t = (v || '').trim();
  if (!t) return null;
  return /^https?:\/\//i.test(t) ? null : `${label} must start with http:// or https://`;
};

const COLLECTIONS: { key: CmsCollectionKey; label: string; hint: string }[] = [
  { key: 'features', label: 'Features', hint: 'Key selling points shown as a card grid.' },
  { key: 'testimonials', label: 'Testimonials', hint: 'Investor quotes. Title = name, Subtitle = role/city, Body = quote.' },
  { key: 'faqs', label: 'FAQs', hint: 'Questions & answers. Title = question, Body = answer.' }
];

const inputCls =
  'w-full px-3 py-2 text-xs rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 border-slate-200 dark:border-slate-700';
const cardCls = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs';
const btnPrimary =
  'inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors disabled:opacity-60';
const btnGhost =
  'inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors';

export const CmsManager: React.FC<CmsManagerProps> = ({ onToast }) => {
  const [subTab, setSubTab] = useState<SubTab>('sections');

  const [sections, setSections] = useState<CmsSection[]>(() => StorageService.getCmsSections());
  const [items, setItems] = useState<CmsCollectionItem[]>(() => StorageService.getCmsCollections());
  const [settings, setSettings] = useState<CmsSiteSettings>(() => StorageService.getCmsSiteSettings());

  const refresh = () => {
    setSections(StorageService.getCmsSections());
    setItems(StorageService.getCmsCollections());
    setSettings(StorageService.getCmsSiteSettings());
  };

  // ------------------------------------------------------------------
  // SECTION EDIT STATE
  // ------------------------------------------------------------------
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionDraft, setSectionDraft] = useState<CmsSection | null>(null);
  const [sectionAttempt, setSectionAttempt] = useState(false);
  const sectionFormRef = useRef<HTMLFormElement>(null);

  const sectionRules: RuleSet = {
    title: compose(required('Section title'), minLength('Section title', 3)),
    subtitle: maxLength('Subtitle', 260)
  };
  const sectionResult = useMemo(
    () => runRules({ title: sectionDraft?.title ?? '', subtitle: sectionDraft?.subtitle ?? '' }, sectionRules),
    [sectionDraft]
  );

  const startEditSection = (s: CmsSection) => {
    setEditingSectionId(s.id);
    setSectionDraft({ ...s });
    setSectionAttempt(false);
  };

  const cancelEditSection = () => {
    setEditingSectionId(null);
    setSectionDraft(null);
    setSectionAttempt(false);
  };

  const saveSection = (e: React.FormEvent) => {
    e.preventDefault();
    setSectionAttempt(true);
    if (!sectionDraft) return;
    if (!sectionResult.isValid) {
      focusFirstInvalid(sectionFormRef.current);
      return;
    }
    const saved = StorageService.updateCmsSection(sectionDraft.id, {
      title: sectionDraft.title,
      subtitle: sectionDraft.subtitle,
      body: sectionDraft.body,
      ctaLabel: sectionDraft.ctaLabel
    });
    if (saved) {
      refresh();
      onToast(`Section "${saved.label}" updated.`);
      cancelEditSection();
    } else {
      onToast('Could not update the section.');
    }
  };

  const handleToggleSection = (s: CmsSection) => {
    const next = StorageService.toggleCmsSection(s.id);
    if (next) {
      refresh();
      onToast(`"${next.label}" is now ${next.visible ? 'visible' : 'hidden'} on the homepage.`);
    }
  };

  const handleMoveSection = (s: CmsSection, dir: -1 | 1) => {
    setSections(StorageService.moveCmsSection(s.id, dir));
  };

  const handleResetSections = () => {
    if (!window.confirm('Reset every homepage section (text, visibility and order) to the default content?')) return;
    setSections(StorageService.resetCmsSections());
    cancelEditSection();
    onToast('Homepage sections reset to defaults.');
  };

  // ------------------------------------------------------------------
  // COLLECTION ITEM STATE
  // ------------------------------------------------------------------
  const [selectedCollection, setSelectedCollection] = useState<CmsCollectionKey>('features');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemDraft, setItemDraft] = useState<Partial<CmsCollectionItem> | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [itemAttempt, setItemAttempt] = useState(false);
  const itemFormRef = useRef<HTMLFormElement>(null);

  const itemRules: RuleSet = {
    title: compose(required('Title'), minLength('Title', 2)),
    body: compose(required('Description'), minLength('Description', 4)),
    imageUrl: optionalUrl('Image URL')
  };
  const itemResult = useMemo(
    () =>
      runRules(
        {
          title: itemDraft?.title ?? '',
          body: itemDraft?.body ?? '',
          imageUrl: itemDraft?.imageUrl ?? ''
        },
        itemRules
      ),
    [itemDraft]
  );

  const collectionItems = useMemo(
    () =>
      items
        .filter(i => i.collection === selectedCollection)
        .sort((a, b) => a.order - b.order),
    [items, selectedCollection]
  );

  const startAddItem = () => {
    setEditingItemId(null);
    setIsAddingItem(true);
    setItemDraft({ collection: selectedCollection, title: '', subtitle: '', body: '', imageUrl: '', badge: '' });
    setItemAttempt(false);
  };

  const startEditItem = (item: CmsCollectionItem) => {
    setIsAddingItem(false);
    setEditingItemId(item.id);
    setItemDraft({ ...item });
    setItemAttempt(false);
  };

  const cancelItemEdit = () => {
    setEditingItemId(null);
    setIsAddingItem(false);
    setItemDraft(null);
    setItemAttempt(false);
  };

  const saveItem = (e: React.FormEvent) => {
    e.preventDefault();
    setItemAttempt(true);
    if (!itemDraft) return;
    if (!itemResult.isValid) {
      focusFirstInvalid(itemFormRef.current);
      return;
    }
    const payload = {
      collection: selectedCollection,
      title: itemDraft.title || '',
      subtitle: itemDraft.subtitle || '',
      body: itemDraft.body || '',
      imageUrl: itemDraft.imageUrl || '',
      badge: itemDraft.badge || ''
    };
    if (isAddingItem) {
      StorageService.addCmsItem(payload);
      onToast(`New ${selectedCollection} item added.`);
    } else if (editingItemId) {
      StorageService.updateCmsItem(editingItemId, payload);
      onToast('Content item updated.');
    }
    refresh();
    cancelItemEdit();
  };

  const handleDeleteItem = (item: CmsCollectionItem) => {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    if (StorageService.deleteCmsItem(item.id)) {
      refresh();
      onToast('Content item deleted.');
    }
  };

  const handleMoveItem = (item: CmsCollectionItem, dir: -1 | 1) => {
    setItems(StorageService.moveCmsItem(item.id, dir));
  };

  const handleResetCollection = () => {
    const meta = COLLECTIONS.find(c => c.key === selectedCollection);
    if (!window.confirm(`Reset all "${meta?.label}" content to the default items?`)) return;
    StorageService.resetCmsCollection(selectedCollection);
    refresh();
    onToast(`${meta?.label} content reset to defaults.`);
  };

  // ------------------------------------------------------------------
  // SETTINGS STATE
  // ------------------------------------------------------------------
  const [settingsDraft, setSettingsDraft] = useState<CmsSiteSettings>(settings);
  const [settingsAttempt, setSettingsAttempt] = useState(false);
  const settingsFormRef = useRef<HTMLFormElement>(null);

  const settingsRules: RuleSet = {
    brandName: compose(required('Brand name'), minLength('Brand name', 2)),
    legalName: compose(required('Legal name'), minLength('Legal name', 2)),
    supportEmail: emailRule('Support email'),
    supportPhone: phoneRule('Support phone', true),
    copyrightText: required('Copyright text')
  };
  const settingsResult = useMemo(
    () =>
      runRules(
        {
          brandName: settingsDraft.brandName,
          legalName: settingsDraft.legalName,
          supportEmail: settingsDraft.supportEmail,
          supportPhone: settingsDraft.supportPhone,
          copyrightText: settingsDraft.copyrightText
        },
        settingsRules
      ),
    [settingsDraft]
  );

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsAttempt(true);
    if (!settingsResult.isValid) {
      focusFirstInvalid(settingsFormRef.current);
      return;
    }
    const saved = StorageService.updateCmsSiteSettings(settingsDraft);
    setSettings(saved);
    setSettingsDraft(saved);
    onToast('Website settings saved.');
  };

  const setField = (field: keyof CmsSiteSettings, value: string) =>
    setSettingsDraft(prev => ({ ...prev, [field]: value }));

  // ------------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------------
  const subTabs: { id: SubTab; label: string; icon: any }[] = [
    { id: 'sections', label: 'Homepage Sections', icon: Layers },
    { id: 'content', label: 'Content Library', icon: ListChecks },
    { id: 'settings', label: 'Website Settings', icon: SettingsIcon }
  ];

  const visibleCount = sections.filter(s => s.visible).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            Homepage CMS
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Manage every homepage section, the content inside them, and global website settings. Changes publish to the
            public website instantly. Everything is stored encrypted in the central ledger.
          </p>
        </div>
      </div>

      {/* Sub-tab switcher */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 overflow-x-auto text-xs w-fit max-w-full">
        {subTabs.map(st => {
          const Icon = st.icon;
          const isActive = subTab === st.id;
          return (
            <button
              key={st.id}
              onClick={() => setSubTab(st.id)}
              className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                isActive ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{st.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================ SECTIONS ============================ */}
      {subTab === 'sections' && (
        <div className="space-y-4">
          <div className={`${cardCls} p-4 flex flex-wrap items-center justify-between gap-3`}>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <strong className="text-slate-900 dark:text-white">{visibleCount}</strong> of {sections.length} sections visible on the homepage.
              Use the arrows to reorder the page.
            </div>
            <button onClick={handleResetSections} className={btnGhost}>
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset all</span>
            </button>
          </div>

          <div className="space-y-3">
            {sections.map((s, idx) => (
              <div key={s.id} className={`${cardCls} overflow-hidden ${!s.visible ? 'opacity-70' : ''}`}>
                <div className="p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex flex-col">
                      <button
                        onClick={() => handleMoveSection(s, -1)}
                        disabled={idx === 0}
                        aria-label="Move section up"
                        className="p-0.5 text-slate-400 hover:text-amber-600 disabled:opacity-30 disabled:hover:text-slate-400"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveSection(s, 1)}
                        disabled={idx === sections.length - 1}
                        aria-label="Move section down"
                        className="p-0.5 text-slate-400 hover:text-amber-600 disabled:opacity-30 disabled:hover:text-slate-400"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 w-6">{idx + 1}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{s.label}</span>
                        {s.kind === 'collection' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            {s.collectionKey}
                          </span>
                        )}
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                            s.visible
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {s.visible ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-md">{s.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button onClick={() => handleToggleSection(s)} className={btnGhost} title={s.visible ? 'Hide from homepage' : 'Show on homepage'}>
                      {s.visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{s.visible ? 'Hide' : 'Show'}</span>
                    </button>
                    <button
                      onClick={() => (editingSectionId === s.id ? cancelEditSection() : startEditSection(s))}
                      className={btnGhost}
                    >
                      {editingSectionId === s.id ? <X className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
                      <span>{editingSectionId === s.id ? 'Close' : 'Edit'}</span>
                    </button>
                  </div>
                </div>

                {editingSectionId === s.id && sectionDraft && (
                  <form
                    ref={sectionFormRef}
                    onSubmit={saveSection}
                    noValidate
                    className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-3"
                  >
                    {sectionAttempt && !sectionResult.isValid && (
                      <ValidationSummary messages={sectionResult.messages} />
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Section title *</label>
                        <input
                          type="text"
                          value={sectionDraft.title}
                          onChange={e => setSectionDraft({ ...sectionDraft, title: e.target.value })}
                          aria-invalid={sectionAttempt && !!sectionResult.errors.title}
                          className={withValidation(inputCls, sectionAttempt && !!sectionResult.errors.title)}
                        />
                        <FieldError message={sectionAttempt ? sectionResult.errors.title : null} />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Eyebrow / CTA label</label>
                        <input
                          type="text"
                          value={sectionDraft.ctaLabel}
                          onChange={e => setSectionDraft({ ...sectionDraft, ctaLabel: e.target.value })}
                          className={inputCls}
                        />
                        <FieldHint>Optional short label shown near the section heading.</FieldHint>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Subtitle</label>
                      <textarea
                        rows={2}
                        value={sectionDraft.subtitle}
                        onChange={e => setSectionDraft({ ...sectionDraft, subtitle: e.target.value })}
                        aria-invalid={sectionAttempt && !!sectionResult.errors.subtitle}
                        className={withValidation(inputCls, sectionAttempt && !!sectionResult.errors.subtitle)}
                      />
                      <FieldError message={sectionAttempt ? sectionResult.errors.subtitle : null} />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Body / banner text</label>
                      <textarea
                        rows={2}
                        value={sectionDraft.body}
                        onChange={e => setSectionDraft({ ...sectionDraft, body: e.target.value })}
                        className={inputCls}
                      />
                      <FieldHint>Optional long-form copy or banner text for this section.</FieldHint>
                    </div>

                    <div className="flex items-center gap-2">
                      <button type="submit" className={btnPrimary} aria-disabled={sectionAttempt && !sectionResult.isValid}>
                        <Save className="w-3.5 h-3.5" />
                        <span>{sectionAttempt && !sectionResult.isValid ? `Fix ${sectionResult.messages.length} field(s) to save` : 'Save section'}</span>
                      </button>
                      <button type="button" onClick={cancelEditSection} className={btnGhost}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================ CONTENT ============================ */}
      {subTab === 'content' && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 overflow-x-auto text-xs w-fit max-w-full">
            {COLLECTIONS.map(c => (
              <button
                key={c.key}
                onClick={() => { setSelectedCollection(c.key); cancelItemEdit(); }}
                className={`px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  selectedCollection === c.key ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className={`${cardCls} p-4 flex flex-wrap items-center justify-between gap-3`}>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {COLLECTIONS.find(c => c.key === selectedCollection)?.hint}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={handleResetCollection} className={btnGhost}>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button onClick={startAddItem} className={btnPrimary}>
                <Plus className="w-3.5 h-3.5" />
                <span>Add item</span>
              </button>
            </div>
          </div>

          {(isAddingItem || editingItemId) && itemDraft && (
            <form ref={itemFormRef} onSubmit={saveItem} noValidate className={`${cardCls} p-4 space-y-3`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {isAddingItem ? `New ${selectedCollection} item` : 'Edit content item'}
                </span>
                <button type="button" onClick={cancelItemEdit} className="p-1 text-slate-400 hover:text-rose-500">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {itemAttempt && !itemResult.isValid && <ValidationSummary messages={itemResult.messages} />}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Title *</label>
                  <input
                    type="text"
                    value={itemDraft.title || ''}
                    onChange={e => setItemDraft({ ...itemDraft, title: e.target.value })}
                    aria-invalid={itemAttempt && !!itemResult.errors.title}
                    className={withValidation(inputCls, itemAttempt && !!itemResult.errors.title)}
                  />
                  <FieldError message={itemAttempt ? itemResult.errors.title : null} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Subtitle {selectedCollection === 'features' ? '(badge / sub-label)' : ''}
                  </label>
                  <input
                    type="text"
                    value={itemDraft.subtitle || ''}
                    onChange={e => setItemDraft({ ...itemDraft, subtitle: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {selectedCollection === 'faqs' ? 'Answer *' : 'Description / Quote *'}
                </label>
                <textarea
                  rows={3}
                  value={itemDraft.body || ''}
                  onChange={e => setItemDraft({ ...itemDraft, body: e.target.value })}
                  aria-invalid={itemAttempt && !!itemResult.errors.body}
                  className={withValidation(inputCls, itemAttempt && !!itemResult.errors.body)}
                />
                <FieldError message={itemAttempt ? itemResult.errors.body : null} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={itemDraft.imageUrl || ''}
                    onChange={e => setItemDraft({ ...itemDraft, imageUrl: e.target.value })}
                    aria-invalid={itemAttempt && !!itemResult.errors.imageUrl}
                    className={withValidation(inputCls, itemAttempt && !!itemResult.errors.imageUrl)}
                    placeholder="https://..."
                  />
                  <FieldError message={itemAttempt ? itemResult.errors.imageUrl : null} />
                </div>
                {selectedCollection === 'features' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Badge</label>
                    <input
                      type="text"
                      value={itemDraft.badge || ''}
                      onChange={e => setItemDraft({ ...itemDraft, badge: e.target.value })}
                      className={inputCls}
                      placeholder="e.g. 2X"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button type="submit" className={btnPrimary} aria-disabled={itemAttempt && !itemResult.isValid}>
                  <Check className="w-3.5 h-3.5" />
                  <span>{itemAttempt && !itemResult.isValid ? `Fix ${itemResult.messages.length} field(s) to save` : isAddingItem ? 'Add item' : 'Save changes'}</span>
                </button>
                <button type="button" onClick={cancelItemEdit} className={btnGhost}>Cancel</button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {collectionItems.map((item, idx) => (
              <div key={item.id} className={`${cardCls} p-3 flex items-start justify-between gap-3`}>
                <div className="flex items-start gap-3 min-w-0">
                  <GripVertical className="w-4 h-4 text-slate-300 dark:text-slate-600 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.subtitle && <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{item.subtitle}</span>}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 max-w-2xl">{item.body}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => handleMoveItem(item, -1)} disabled={idx === 0} className="p-1 text-slate-400 hover:text-amber-600 disabled:opacity-30" aria-label="Move up">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleMoveItem(item, 1)} disabled={idx === collectionItems.length - 1} className="p-1 text-slate-400 hover:text-amber-600 disabled:opacity-30" aria-label="Move down">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button onClick={() => startEditItem(item)} className="p-1.5 text-slate-400 hover:text-amber-600" aria-label="Edit">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDeleteItem(item)} className="p-1.5 text-slate-400 hover:text-rose-500" aria-label="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {collectionItems.length === 0 && (
              <div className={`${cardCls} p-8 text-center text-xs text-slate-500 dark:text-slate-400`}>
                No content items yet. Click <strong>Add item</strong> to create the first one.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================ SETTINGS ============================ */}
      {subTab === 'settings' && (
        <form ref={settingsFormRef} onSubmit={saveSettings} noValidate className={`${cardCls} p-5 space-y-4`}>
          {settingsAttempt && !settingsResult.isValid && <ValidationSummary messages={settingsResult.messages} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Brand name *</label>
              <input type="text" value={settingsDraft.brandName} onChange={e => setField('brandName', e.target.value)}
                aria-invalid={settingsAttempt && !!settingsResult.errors.brandName}
                className={withValidation(inputCls, settingsAttempt && !!settingsResult.errors.brandName)} />
              <FieldError message={settingsAttempt ? settingsResult.errors.brandName : null} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Legal / registered name *</label>
              <input type="text" value={settingsDraft.legalName} onChange={e => setField('legalName', e.target.value)}
                aria-invalid={settingsAttempt && !!settingsResult.errors.legalName}
                className={withValidation(inputCls, settingsAttempt && !!settingsResult.errors.legalName)} />
              <FieldError message={settingsAttempt ? settingsResult.errors.legalName : null} />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Tagline / kicker</label>
            <input type="text" value={settingsDraft.tagline} onChange={e => setField('tagline', e.target.value)} className={inputCls} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Support email *</label>
              <input type="email" value={settingsDraft.supportEmail} onChange={e => setField('supportEmail', e.target.value)}
                aria-invalid={settingsAttempt && !!settingsResult.errors.supportEmail}
                className={withValidation(inputCls, settingsAttempt && !!settingsResult.errors.supportEmail)} />
              <FieldError message={settingsAttempt ? settingsResult.errors.supportEmail : null} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Support phone *</label>
              <input type="text" value={settingsDraft.supportPhone} onChange={e => setField('supportPhone', e.target.value)}
                aria-invalid={settingsAttempt && !!settingsResult.errors.supportPhone}
                className={withValidation(inputCls, settingsAttempt && !!settingsResult.errors.supportPhone)} />
              <FieldError message={settingsAttempt ? settingsResult.errors.supportPhone : null} />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Corporate address</label>
            <input type="text" value={settingsDraft.corporateAddress} onChange={e => setField('corporateAddress', e.target.value)} className={inputCls} />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Footer note</label>
            <textarea rows={2} value={settingsDraft.footerNote} onChange={e => setField('footerNote', e.target.value)} className={inputCls} />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Copyright text *</label>
            <input type="text" value={settingsDraft.copyrightText} onChange={e => setField('copyrightText', e.target.value)}
              aria-invalid={settingsAttempt && !!settingsResult.errors.copyrightText}
              className={withValidation(inputCls, settingsAttempt && !!settingsResult.errors.copyrightText)} />
            <FieldHint>Use <code>{'{year}'}</code> where the current year should appear automatically.</FieldHint>
            <FieldError message={settingsAttempt ? settingsResult.errors.copyrightText : null} />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button type="submit" className={btnPrimary} aria-disabled={settingsAttempt && !settingsResult.isValid}>
              <Save className="w-3.5 h-3.5" />
              <span>{settingsAttempt && !settingsResult.isValid ? `Fix ${settingsResult.messages.length} field(s) to save` : 'Save settings'}</span>
            </button>
            <button type="button" onClick={() => setSettingsDraft(StorageService.getCmsSiteSettings())} className={btnGhost}>
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard changes</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
