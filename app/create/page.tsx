'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ReadingEntry } from '@/lib/types';
import { saveEntry, generateId } from '@/lib/storage';
import { compressImage, validateImage, antiqueFilter } from '@/lib/imageUtils';

export default function CreateEntryPage() {
  const router = useRouter();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const pageInputRef = useRef<HTMLInputElement>(null);

  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [pageImage, setPageImage] = useState<string | null>(null);
  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [thought, setThought] = useState('');
  const [tags, setTags] = useState('');
  const [showOriginal, setShowOriginal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'cover' | 'page'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImage(file);
    if (!validation.valid) {
      setErrors(prev => ({ ...prev, [type]: validation.error! }));
      return;
    }

    try {
      const base64 = await compressImage(file);
      if (type === 'cover') {
        setCoverImage(base64);
        setErrors(prev => ({ ...prev, cover: '' }));
      } else {
        setPageImage(base64);
        setErrors(prev => ({ ...prev, page: '' }));
      }

      // Auto-detect book info from the image
      setIsDetecting(true);
      try {
        const res = await fetch('/api/extract-book-info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, mediaType: 'image/jpeg' }),
        });
        const json = await res.json();
        if (res.ok) {
          if (json.title) setBookTitle(prev => prev || json.title);
          if (json.author) setAuthor(prev => prev || json.author);
        } else {
          setErrors(prev => ({ ...prev, detect: `Detection failed: ${json.error || ''} ${json.detail || ''}` }));
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setErrors(prev => ({ ...prev, detect: `Detection error: ${msg}` }));
      } finally {
        setIsDetecting(false);
      }
    } catch {
      setErrors(prev => ({ ...prev, [type]: 'Failed to load image' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!thought.trim()) newErrors.thought = 'Please add your thought';
    if (!coverImage && !pageImage) newErrors.image = 'Please upload at least one image';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);

    const entry: ReadingEntry = {
      id: generateId(),
      bookTitle: bookTitle.trim() || 'Untitled',
      author: author.trim() || 'Unknown Author',
      thought: thought.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      coverImage: coverImage || '',
      pageImage: pageImage || '',
      styledCoverImage: coverImage || '',
      styledPageImage: pageImage || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      saveEntry(entry);
      router.push('/diary');
    } catch (err) {
      const isQuota = err instanceof DOMException && err.name === 'QuotaExceededError';
      setErrors({ save: isQuota
        ? 'Your diary is full. Please delete some old entries to make room.'
        : 'Failed to save entry. Please try again.' });
      setIsSaving(false);
    }
  };

  const previewImage = pageImage || coverImage;
  const imageStyle = showOriginal ? {} : { filter: antiqueFilter };

  return (
    <div className="page-container" style={styles.container}>
      <h1 style={styles.title}>Create New Entry</h1>
      <p style={styles.subtitle}>Capture a reading moment</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div className="form-row">
          {/* Image Upload Section */}
          <div className="form-image-col">
            <div style={styles.uploadZone} onClick={() => pageInputRef.current?.click()}>
              {previewImage ? (
                <div style={styles.previewContainer}>
                  <img
                    src={previewImage}
                    alt="Page preview"
                    style={{ ...styles.previewImage, ...imageStyle }}
                  />
                  <div style={styles.toggleRow}>
                    <button
                      type="button"
                      style={styles.toggleButton}
                      onClick={e => { e.stopPropagation(); setShowOriginal(v => !v); }}
                    >
                      {showOriginal ? '🎨 Show Styled' : '🖼 Show Original'}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={styles.uploadPlaceholder}>
                  <div style={styles.uploadIcon}>📄</div>
                  <p style={styles.uploadText}>Click to upload page photo</p>
                  <p style={styles.uploadHint}>JPG, PNG, WebP · max 5MB</p>
                </div>
              )}
            </div>
            <input
              ref={pageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={e => handleImageUpload(e, 'page')}
            />
            {errors.page && <p style={styles.error}>{errors.page}</p>}

            <div
              style={{ ...styles.uploadZone, ...styles.coverZone }}
              onClick={() => coverInputRef.current?.click()}
            >
              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Cover preview"
                  style={{ ...styles.coverPreview, ...imageStyle }}
                />
              ) : (
                <div style={styles.uploadPlaceholder}>
                  <div style={styles.uploadIcon}>📚</div>
                  <p style={styles.uploadText}>Click to upload cover photo</p>
                  <p style={styles.uploadHint}>Optional</p>
                </div>
              )}
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={e => handleImageUpload(e, 'cover')}
            />
            {errors.cover && <p style={styles.error}>{errors.cover}</p>}
            {errors.image && <p style={styles.error}>{errors.image}</p>}
          </div>

          {/* Details Section */}
          <div className="form-details-col">
            {isDetecting && (
              <p style={styles.detecting}>✨ Detecting book info from photo...</p>
            )}
            {errors.detect && (
              <p style={styles.error}>{errors.detect}</p>
            )}

            <div style={styles.field}>
              <label style={styles.label}>Book Title</label>
              <input
                type="text"
                value={bookTitle}
                onChange={e => setBookTitle(e.target.value)}
                placeholder={isDetecting ? 'Detecting...' : 'e.g. The Great Gatsby'}
                style={styles.input}
                disabled={isDetecting}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Author</label>
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder={isDetecting ? 'Detecting...' : 'e.g. F. Scott Fitzgerald'}
                style={styles.input}
                disabled={isDetecting}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Your Thought <span style={styles.required}>*</span></label>
              <textarea
                value={thought}
                onChange={e => setThought(e.target.value)}
                placeholder="What moved you about this passage or moment?"
                rows={5}
                style={{ ...styles.input, ...styles.textarea }}
              />
              {errors.thought && <p style={styles.error}>{errors.thought}</p>}
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Tags</label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="fiction, classics, poetry (comma-separated)"
                style={styles.input}
              />
            </div>

            {errors.save && <p style={styles.error}>{errors.save}</p>}
            <button
              type="submit"
              disabled={isSaving}
              style={{ ...styles.submitButton, ...(isSaving ? styles.submitDisabled : {}) }}
            >
              {isSaving ? 'Saving...' : '✨ Save Entry'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '820px',
    margin: '0 auto',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '40px',
    fontWeight: 700,
    color: '#3D2914',
    marginBottom: '12px',
  },
  subtitle: {
    fontFamily: "'Crimson Text', serif",
    fontSize: '18px',
    color: '#7A6555',
    marginBottom: '32px',
  },
  form: {
    background: '#FFFDF8',
    border: '1px solid #E0D5C5',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 2px 8px rgba(61,41,20,0.08)',
  },
  uploadZone: {
    border: '2px dashed #D4A574',
    borderRadius: '8px',
    cursor: 'pointer',
    overflow: 'hidden',
    backgroundColor: '#FAF6EF',
    minHeight: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'border-color 200ms ease-out',
  },
  coverZone: {
    minHeight: '140px',
  },
  uploadPlaceholder: {
    textAlign: 'center',
    padding: '24px',
  },
  uploadIcon: {
    fontSize: '32px',
    marginBottom: '8px',
  },
  uploadText: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '14px',
    fontWeight: 500,
    color: '#8B4513',
    marginBottom: '4px',
  },
  uploadHint: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '12px',
    color: '#7A6555',
  },
  previewContainer: {
    width: '100%',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    display: 'block',
    objectFit: 'cover',
    maxHeight: '260px',
  },
  coverPreview: {
    width: '100%',
    display: 'block',
    objectFit: 'cover',
    maxHeight: '140px',
  },
  toggleRow: {
    padding: '8px',
    textAlign: 'center',
    backgroundColor: 'rgba(255,253,248,0.85)',
  },
  toggleButton: {
    background: 'transparent',
    border: '1px solid #D4A574',
    borderRadius: '4px',
    padding: '4px 12px',
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '13px',
    color: '#8B4513',
    cursor: 'pointer',
  },
  detecting: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '13px',
    color: '#8B4513',
    fontStyle: 'italic',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '14px',
    fontWeight: 600,
    color: '#3D2914',
  },
  required: {
    color: '#8B4513',
  },
  input: {
    fontFamily: "'Crimson Text', serif",
    fontSize: '16px',
    color: '#3D2914',
    backgroundColor: '#FFFDF8',
    border: '1px solid #D4A574',
    borderRadius: '4px',
    padding: '10px 14px',
    outline: 'none',
    width: '100%',
  },
  textarea: {
    resize: 'vertical',
  },
  error: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '13px',
    color: '#c0392b',
    marginTop: '4px',
  },
  submitButton: {
    backgroundColor: '#8B4513',
    color: '#FFFDF8',
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '16px',
    fontWeight: 600,
    padding: '14px 28px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 200ms ease-out',
    alignSelf: 'flex-start',
  },
  submitDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
};
