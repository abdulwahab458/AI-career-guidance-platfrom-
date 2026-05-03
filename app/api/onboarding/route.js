import { NextResponse } from 'next/server'
import { updateUser } from '@/actions/user'

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await updateUser(body);
    return NextResponse.json(result);
  } catch (err) {
    console.error('API /onboarding error', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
