import ClientPage from './page.client';

export async function generateStaticParams() {
  return [{ tourId: '1' }];
}

export default function Page() {
  return <ClientPage />;
}
