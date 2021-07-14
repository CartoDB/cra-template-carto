import Header from 'components/common/Header';

export default function DefaultView({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
