'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ReadingEntry } from '@/lib/types';
import { getDiaryData } from '@/lib/storage';
import { antiqueFilter } from '@/lib/imageUtils';

export default function DiaryPage() {
  const [entries, setEntries] = useState<ReadingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getDiaryData();
    setEntries(data.entries);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="page-container" style={styles.container}>
        <p style={styles.loading}>Loading your diary...</p>
      </div>
    );
  }

  return (
    <div className="page-container" style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Diary</h1>
          <p style={styles.subtitle}>
            {entries.length} reading moment{entries.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/create" style={styles.newButton}>
          + New Entry
        </Link>
      </div>

      {entries.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📚</div>
          <h2 style={styles.emptyTitle}>Your diary is empty</h2>
          <p style={styles.emptyText}>
            Start capturing your reading moments by creating your first entry.
          </p>
          <Link href="/create" style={styles.emptyButton}>
            Create First Entry
          </Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {entries.map(entry => (
            <Link
              key={entry.id}
              href={`/entry/${entry.id}`}
              style={styles.card}
            >
              <div style={styles.cardImageContainer}>
                {entry.styledPageImage || entry.styledCoverImage ? (
                  <img
                    src={entry.styledPageImage || entry.styledCoverImage}
                    alt={entry.bookTitle}
                    style={{ ...styles.cardImage, filter: antiqueFilter }}
                  />
                ) : (
                  <div style={styles.cardPlaceholder}>📖</div>
                )}
              </div>
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{entry.bookTitle}</h3>
                <p style={styles.cardAuthor}>{entry.author}</p>
                <p style={styles.cardThought}>{entry.thought}</p>
                {entry.tags.length > 0 && (
                  <div style={styles.cardTags}>
                    {entry.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} style={styles.cardTag}>{tag}</span>
                    ))}
                  </div>
                )}
                <p style={styles.cardDate}>
                  {new Date(entry.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  loading: {
    fontFamily: "'Crimson Text', serif",
    fontSize: '18px',
    color: '#7A6555',
    textAlign: 'center',
    paddingTop: '80px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '40px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '40px',
    fontWeight: 700,
    color: '#3D2914',
    marginBottom: '4px',
  },
  subtitle: {
    fontFamily: "'Crimson Text', serif",
    fontSize: '18px',
    color: '#7A6555',
  },
  newButton: {
    display: 'inline-block',
    backgroundColor: '#8B4513',
    color: '#FFFDF8',
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '15px',
    fontWeight: 600,
    padding: '10px 22px',
    borderRadius: '4px',
    textDecoration: 'none',
  },
  empty: {
    textAlign: 'center',
    padding: '80px 24px',
    backgroundColor: '#FFFDF8',
    borderRadius: '12px',
    border: '1px solid #E0D5C5',
  },
  emptyIcon: {
    fontSize: '56px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    color: '#3D2914',
    marginBottom: '12px',
  },
  emptyText: {
    fontFamily: "'Crimson Text', serif",
    fontSize: '18px',
    color: '#7A6555',
    maxWidth: '400px',
    margin: '0 auto 24px',
    lineHeight: 1.6,
  },
  emptyButton: {
    display: 'inline-block',
    backgroundColor: '#8B4513',
    color: '#FFFDF8',
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '15px',
    fontWeight: 600,
    padding: '12px 24px',
    borderRadius: '4px',
    textDecoration: 'none',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  card: {
    display: 'block',
    backgroundColor: '#FFFDF8',
    border: '1px solid #E0D5C5',
    borderRadius: '8px',
    overflow: 'hidden',
    textDecoration: 'none',
    boxShadow: '0 2px 8px rgba(61, 41, 20, 0.08)',
    transition: 'box-shadow 200ms ease-out, transform 200ms ease-out',
  },
  cardImageContainer: {
    height: '200px',
    overflow: 'hidden',
    backgroundColor: '#F0E8D8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  cardPlaceholder: {
    fontSize: '48px',
  },
  cardContent: {
    padding: '20px',
  },
  cardTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '18px',
    fontWeight: 600,
    color: '#3D2914',
    marginBottom: '4px',
  },
  cardAuthor: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '13px',
    color: '#7A6555',
    marginBottom: '10px',
  },
  cardThought: {
    fontFamily: "'Crimson Text', serif",
    fontSize: '16px',
    color: '#5A4030',
    lineHeight: 1.55,
    marginBottom: '12px',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  cardTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '12px',
  },
  cardTag: {
    backgroundColor: '#F5EFE4',
    border: '1px solid #D4A574',
    borderRadius: '12px',
    padding: '2px 10px',
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '12px',
    color: '#8B4513',
  },
  cardDate: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '12px',
    color: '#7A6555',
  },
};
