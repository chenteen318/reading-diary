'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();
  
  const links = [
    { href: '/', label: 'Home' },
    { href: '/create', label: 'Create Entry' },
    { href: '/diary', label: 'My Diary' },
  ];
  
  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link href="/" style={styles.logo}>
          📖 Reading Diary
        </Link>
        <div style={styles.links}>
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                ...styles.link,
                ...(pathname === link.href ? styles.linkActive : {}),
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: '#FFFDF8',
    borderBottom: '1px solid #E0D5C5',
    padding: '12px 0',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '24px',
    fontWeight: 600,
    color: '#8B4513',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    gap: '24px',
  },
  link: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '15px',
    fontWeight: 500,
    color: '#7A6555',
    textDecoration: 'none',
    padding: '8px 0',
    borderBottom: '2px solid transparent',
    transition: 'all 200ms ease-out',
  },
  linkActive: {
    color: '#8B4513',
    borderBottomColor: '#8B4513',
  },
};