import ThemeToggleButton from './ThemeToggleButton';

export default function Header() {
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
      <div
        style={{
          fontSize: '1.25rem',
          fontWeight: '600',
        }}
      >
        My App
      </div>
      <ThemeToggleButton />
    </header>
  );
}
