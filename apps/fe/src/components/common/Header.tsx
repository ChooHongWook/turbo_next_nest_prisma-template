'use client';

import ThemeToggleButton from './ThemeToggleButton';
import { UserProfile } from './UserProfile';
import { LogoutButton } from '../auth/LogoutButton';
import { useAuthStore } from '@/store';
import Link from 'next/link';

export default function Header() {
  const { isAuthenticated } = useAuthStore();

  return (
    <header
      style={{
        borderBottom: '1px solid var(--foreground)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      <Link
        href="/"
        style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          cursor: 'pointer',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        My App
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ThemeToggleButton />

        {isAuthenticated ? (
          <>
            <UserProfile />
            <LogoutButton />
          </>
        ) : (
          <Link
            href="/auth/login"
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--foreground)',
              color: 'var(--background)',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
