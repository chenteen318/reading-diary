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
      getEntry(params.id as string)
        .then(found => setEntry(found))
        .catch(() => setEntry(null));
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (entry && confirm('Are you sure you want to delete this entry?')) {
      await deleteEntry(entry.id);
      router.push('/diary');
    }
  };

  if (!entry) {
    return (
      <div className="page-container" style={styles.container}>
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

  const pageImageStyle: React.CSSProperties = showOriginal ? {} : { filter: antiqueFilter };
  const coverImageStyle: React.CSSProperties = showCoverOriginal ? {} : { filter: antiqueFilter };

  return (
    <div className="page-container" style={styles.container}>
      <Link href="/diary" style={styles.backLink}>
        ← Back to Diary
      </Link>

      <div className="entry-layout">
        {/* Main Image */}
        <div className="entry-image-col">
          {displayPageImage ? (
            <div style={styles.mainImageWrapper}>
              <img
                src={displayPageImage}
                alt="Page"
                style={{ ...styles.mainImage, ...pageImageStyle }}
              />
              <button
                style={styles.toggleButton}
                onClick={() => setShowOriginal(v => !v)}
              >
                {showOriginal ? '🎨 Show Styled' : '🖼 Show Original'}
              </button>
            </div>
          ) : (
            <div style={styles.imagePlaceholder}>📖</div>
          )}

          {entry.coverImage && (
            <div style={styles.coverWrapper}>
              <p style={styles.coverLabel}>Book Cover</p>
              <div style={styles.coverImageContainer}>
                <img
                  src={displayCoverImage || entry.coverImage}
                  alt="Cover"
                  style={{ ...styles.coverImage, ...coverImageStyle }}
                />
              </div>
              <button
                style={styles.coverToggleButton}
                onClick={() => setShowCoverOriginal(v => !v)}
              >
                {showCoverOriginal ? '🎨 Styled' : '🖼 Original'}
              </button>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="entry-details-col">
          <div style={styles.meta}>
            <h1 style={styles.bookTitle}>{entry.bookTitle}</h1>
            <p style={styles.author}>by {entry.author}</p>
          </div>

          <div style={styles.thoughtBox}>
            <p style={styles.thoughtLabel}>My Thought</p>
            <p style={styles.thought}>{entry.thought}</p>
          </div>

          {entry.tags.length > 0 && (
            <div style={styles.tagsSection}>
              <p style={styles.tagsLabel}>Tags</p>
              <div style={styles.tags}>
                {entry.tags.map((tag, i) => (
                  <span key={i} style={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          )}

          <div style={styles.dateLine}>
            <span style={styles.dateLabel}>Captured on</span>
            <span style={styles.date}>
              {new Date(entry.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <button
            style={styles.deleteButton}
            onClick={handleDelete}
          >
            🗑 Delete Entry
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  loading: {
    fontFamily: "'Crimson Text', serif",
    fontSize: '18px',
    color: '#7A6555',
    textAlign: 'center',
    paddingTop: '80px',
  },
  backLink: {
    display: 'inline-block',
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '14px',
    fontWeight: 500,
    color: '#8B4513',
    textDecoration: 'none',
    marginBottom: '32px',
  },
  mainImageWrapper: {
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(61, 41, 20, 0.12)',
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    display: 'block',
    objectFit: 'cover',
    maxHeight: '400px',
  },
  imagePlaceholder: {
    height: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '64px',
    backgroundColor: '#F0E8D8',
    borderRadius: '8px',
  },
  toggleButton: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    backgroundColor: 'rgba(255,253,248,0.9)',
    border: '1px solid #D4A574',
    borderRadius: '4px',
    padding: '6px 14px',
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '13px',
    color: '#8B4513',
    cursor: 'pointer',
  },
  coverWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  coverLabel: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '12px',
    fontWeight: 600,
    color: '#7A6555',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  coverImageContainer: {
    borderRadius: '6px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(61, 41, 20, 0.08)',
  },
  coverImage: {
    width: '100%',
    display: 'block',
    objectFit: 'cover',
    maxHeight: '160px',
  },
  coverToggleButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    border: '1px solid #D4A574',
    borderRadius: '4px',
    padding: '4px 12px',
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '12px',
    color: '#8B4513',
    cursor: 'pointer',
  },
  meta: {
    borderBottom: '1px solid #E0D5C5',
    paddingBottom: '20px',
  },
  bookTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '32px',
    fontWeight: 700,
    color: '#3D2914',
    marginBottom: '6px',
    lineHeight: 1.25,
  },
  author: {
    fontFamily: "'Crimson Text', serif",
    fontSize: '18px',
    color: '#7A6555',
    fontStyle: 'italic',
  },
  thoughtBox: {
    backgroundColor: '#FFFDF8',
    border: '1px solid #E0D5C5',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(61, 41, 20, 0.06)',
  },
  thoughtLabel: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '12px',
    fontWeight: 600,
    color: '#8B4513',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '10px',
  },
  thought: {
    fontFamily: "'Crimson Text', serif",
    fontSize: '19px',
    color: '#3D2914',
    lineHeight: 1.7,
  },
  tagsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  tagsLabel: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '12px',
    fontWeight: 600,
    color: '#7A6555',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  tag: {
    backgroundColor: '#F5EFE4',
    border: '1px solid #D4A574',
    borderRadius: '12px',
    padding: '4px 14px',
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '13px',
    color: '#8B4513',
  },
  dateLine: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  dateLabel: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '12px',
    fontWeight: 600,
    color: '#7A6555',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  date: {
    fontFamily: "'Crimson Text', serif",
    fontSize: '17px',
    color: '#3D2914',
  },
  deleteButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    border: '1px solid #c0392b',
    borderRadius: '4px',
    padding: '8px 18px',
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '14px',
    color: '#c0392b',
    cursor: 'pointer',
    marginTop: '8px',
  },
};
