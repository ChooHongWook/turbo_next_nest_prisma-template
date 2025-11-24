import ReactQueryProvider from './ReactQueryProvider';

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </>
  );
};

export default Provider;
