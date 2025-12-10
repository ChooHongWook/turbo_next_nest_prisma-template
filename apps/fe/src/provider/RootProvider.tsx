import ReactQueryProvider from './ReactQueryProvider';
import ThemeProvider from './ThemeProvider';

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </ThemeProvider>
  );
};

export default RootProvider;
