'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ReadingEntry } from '@/lib/types';
import { getEntry, deleteEntry } from '@/lib/storage';
import { antiqueFilter } from '@/lib/imageUtils';

export default function EntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [entry, setEntry] = useState<ReadingEntry | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [showCoverOriginal, setShowCoverOriginal] = useState(false);

  useEffect(() => {
    if (params.id) {
      const found = getEntry(params.id as string);
      setEntry(found);
    }
  }, [params.id]);

  const handleDelete = () => {
    if (entry && confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(entry.id);
      router.push('/diary');
    }
  };

  if (!entry) {
    return (
      <div style={styles.container}>
        <p style={styles.loading}>Loading...</p>
      </div>
    );
  }

  const displayPageImage = showOriginal 
    ? (entry.pageImage || entry.coverImage) 
    : (entry.styledPageImage || entry.styledCoverImage);
    
  const displayCoverImage = showCoverOriginal 
    ? entry.coverImage 
    : entry.styledCoverImage;

  const pageImageStyle = showOriginal ? {} : { filter: antiqueFilter };
  const coverImageStyle = showCoverOriginal ? {} : { filter: antiqueFilter };

  return (
    <div style={styles.container}>
      <Link href="/diary" style={styles.backLink}>
        ← Back to Diary
      </Link>

      <div style={styles.content}>
        {/* Main Image */}
        <div style={styles.imageSection}>/* ...existing code... */</div>
        {/* Details Section */}
        <div style={styles.detailsSection}>/* ...existing code... */</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '48px 24px',
  },
  // ...other styles
};