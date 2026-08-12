import ClientPage from './page.client';

export async function generateStaticParams() {
  return [{ id: '1', tourId: '1' }];
}

export default function Page() {
  return <ClientPage />;
}
