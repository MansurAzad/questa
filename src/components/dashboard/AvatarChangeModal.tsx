import React, { useState, useRef } from 'react';
import { X, Upload, Camera, Check, User as UserIcon, Sparkles, AlertCircle } from 'lucide-react';
import { User, Language } from '../../types';
import { StorageService } from '../../services/storage';

interface AvatarChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  language: Language;
  onAvatarUpdated: (newAvatarUrl: string) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80'
];

export const AvatarChangeModal: React.FC<AvatarChangeModalProps> = ({
  isOpen,
  onClose,
  user,
  language,
  onAvatarUpdated
}) => {
  const isBn = language === 'bn';
  const [selectedAvatar, setSelectedAvatar] = useState<string>(user.avatar);
  const [previewError, setPreviewError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files (PNG, JPG or WebP) can be uploaded.');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError(`That image is ${(file.size / (1024 * 1024)).toFixed(1)}MB — the maximum allowed size is 5MB.`);
      e.target.value = '';
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedAvatar(event.target.result as string);
        setPreviewError(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setIsSaving(true);
    StorageService.updateUser({ avatar: selectedAvatar });

    // Also sync localStorage user session
    try {
      const stored = localStorage.getItem('qw_user_session_enc');
      if (stored) {
        const parsed = JSON.parse(decodeURIComponent(atob(stored)));
        parsed.avatar = selectedAvatar;
        localStorage.setItem('qw_user_session_enc', btoa(encodeURIComponent(JSON.stringify(parsed))));
      }
    } catch {
      // ignore
    }

    onAvatarUpdated(selectedAvatar);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              { 'Change Profile Picture'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Preview */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="relative">
            <img
              src={selectedAvatar}
              alt={user.fullName}
              onError={() => setPreviewError(true)}
              className="w-24 h-24 rounded-full object-cover border-4 border-amber-500 shadow-md shadow-amber-900/20"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-slate-900 text-white border-2 border-white dark:border-slate-800 hover:bg-amber-600 transition-colors shadow-sm"
              title={ 'Upload photo'}
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{user.fullName}</h4>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono">{user.memberId}</span>
          </div>
        </div>

        {/* Upload Custom Photo Option */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 rounded-xl border border-dashed border-amber-500/60 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Upload className="w-4 h-4 text-amber-500" />
            <span>{ 'Upload Photo from Device'}</span>
          </button>
          <span className="text-[10px] text-slate-400 block text-center mt-1">
            { 'PNG, JPG or WebP (Max 5MB)'}
          </span>
          {uploadError && (
            <p className="mt-1 flex items-start justify-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400" role="alert">
              <AlertCircle className="w-3 h-3 mt-[1px] shrink-0" />
              <span>{uploadError}</span>
            </p>
          )}
        </div>

        {/* Curated Presets */}
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
            Or Choose from Preset Avatars:
          </label>
          <div className="grid grid-cols-4 gap-2.5">
            {PRESET_AVATARS.map((url, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => { setSelectedAvatar(url); setUploadError(null); }}
                className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                  selectedAvatar === url
                    ? 'border-amber-500 ring-2 ring-amber-500 shadow-md scale-105'
                    : 'border-slate-200 dark:border-slate-800 hover:border-amber-400 opacity-80 hover:opacity-100'
                }`}
              >
                <img src={url} alt="Preset avatar" className="w-full h-full object-cover" />
                {selectedAvatar === url && (
                  <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white drop-shadow-md" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
          >
            { 'Cancel'}
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>{isSaving ? ( 'Saving...') : ( 'Save Picture')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
