
import NavBar from '@src/components/NavBar/NavBar';
import './DefaultLayout.css'

type Props = {
  children: React.ReactNode
}
export default function DefaultLayout({ children }: Props ) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
