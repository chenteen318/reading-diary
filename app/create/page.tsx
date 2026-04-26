'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ReadingEntry } from '@/lib/types';
import { saveEntry, generateId } from '@/lib/storage';
import { fileToBase64, validateImage, antiqueFilter } from '@/lib/imageUtils';

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
      const base64 = await fileToBase64(file);
      if (type === 'cover') {
        setCoverImage(base64);
        setErrors(prev => ({ ...prev, cover: '' }));
      } else {
        setPageImage(base64);
        setErrors(prev => ({ ...prev, page: '' }));
      }
    } catch {
      setErrors(prev => ({ ...prev, [type]: 'Failed to load image' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
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
    
    saveEntry(entry);
    router.push('/diary');
  };

  const displayImage = showOriginal 
    ? (pageImage || coverImage) 
    : (pageImage || coverImage);
    
  const imageStyle = showOriginal 
    ? {} 
    : { filter: antiqueFilter };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Create New Entry</h1>
      <p style={styles.subtitle}>Capture a reading moment</p>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          {/* Image Upload Section */}
          <div style={styles.imageSection}>/* ...existing code... */</div>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '48px 24px',
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
    boxShadow: '0 2px 8px #e0d5c540',
  },
  row: {
    display: 'flex',
    gap: '32px',
    alignItems: 'flex-start',
  },
  imageSection: {
    flex: 1,
    minWidth: '200px',
  },
};