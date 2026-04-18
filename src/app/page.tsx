import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const store = await cookies();
  const session = store.get('session');

  if (session?.value) {
    redirect('/servers');
  }

  redirect('/login');
}
