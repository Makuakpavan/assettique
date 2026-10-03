import { redirect } from 'next/navigation';
import CreateListingPage from '@/app/seller/create/page';
import { createClient } from '@/lib/supabase/server';

export default async function SellPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signup?next=/dashboard');
  }

  redirect('/dashboard');
}
