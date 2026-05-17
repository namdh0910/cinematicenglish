import { NextResponse } from 'next/server';
import { trackServerMonetizationEvent } from '@/lib/monetization/analytics';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Optionally attach authenticated user_id from session if not provided
    if (!body.user_id) {
      try {
        const supabase = await createSupabaseServerClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) body.user_id = session.user.id;
      } catch {
        // anonymous event — OK
      }
    }

    await trackServerMonetizationEvent(body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
