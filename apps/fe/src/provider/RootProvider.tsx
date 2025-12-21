import ReactQueryProvider from './ReactQueryProvider';
import ThemeProvider from './ThemeProvider';
import AuthProvider from './AuthProvider';

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <ReactQueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
};

export default RootProvider;
