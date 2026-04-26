'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.badge}>📚 Your Personal Reading Journal</div>
        <h1 style={styles.title}>
          Capture meaningful<br />
          <span style={styles.highlight}>reading moments</span>
        </h1>
        <p style={styles.subtitle}>
          Turn your favorite book passages and cover art into a warm, 
          antique-styled diary that preserves your reading journey.
        </p>
        <div style={styles.actions}>
          <Link href="/create" style={styles.primaryButton}>
            ✨ Create New Entry
          </Link>
          <Link href="/diary" style={styles.secondaryButton}>
            📖 View My Diary
          </Link>
        </div>
      </div>
      
      <div style={styles.features}>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>📷</div>
          <h3 style={styles.featureTitle}>Upload Photos</h3>
          <p style={styles.featureText}>
            Capture book pages and covers with your camera
          </p>
        </div>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🎨</div>
          <h3 style={styles.featureTitle}>Antique Style</h3>
          <p style={styles.featureText}>
            Automatic warm, sepia-toned visual enhancement
          </p>
        </div>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>💭</div>
          <h3 style={styles.featureTitle}>Add Your Thoughts</h3>
          <p style={styles.featureText}>
            Record your reflections and favorite quotes
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '48px 24px',
  },
  hero: {
    textAlign: 'center' as const,
    marginBottom: '64px',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#FFFDF8',
    border: '1px solid #E0D5C5',
    borderRadius: '24px',
    padding: '8px 20px',
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '14px',
    color: '#7A6555',
    marginBottom: '24px',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '56px',
    fontWeight: 700,
    color: '#3D2914',
    lineHeight: 1.2,
    marginBottom: '24px',
  },
  highlight: {
    color: '#8B4513',
  },
  subtitle: {
    fontFamily: "'Crimson Text', serif",
    fontSize: '20px',
    color: '#7A6555',
    maxWidth: '600px',
    margin: '0 auto 32px',
    lineHeight: 1.7,
  },
  actions: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
  },
  // ...other styles
};