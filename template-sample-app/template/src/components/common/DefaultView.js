import Header from './Header';

export default function DefaultView({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
