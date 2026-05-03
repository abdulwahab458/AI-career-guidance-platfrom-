import { NextResponse } from 'next/server'
import { generatequiz } from '@/actions/interview'

export async function POST(request) {
  try {
    const questions = await generatequiz();
    return NextResponse.json({ questions });
  } catch (err) {
    console.error('API /interview/generate error', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
