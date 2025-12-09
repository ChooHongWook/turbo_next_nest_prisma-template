import ReactQueryProvider from './ReactQueryProvider';
import ThemeProvider from './ThemeProvider';

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </ThemeProvider>
  );
};

export default Provider;
