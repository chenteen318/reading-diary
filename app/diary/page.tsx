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
      <div style={styles.container}>
        <p style={styles.loading}>Loading your diary...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Diary</h1>
          <p style={styles.subtitle}>{entries.length} reading moment{entries.length !== 1 ? 's' : ''}</p>
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

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '48px 24px',
  },
  // ...other styles
};