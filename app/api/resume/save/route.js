import { NextResponse } from 'next/server'
import { saveResume } from '@/actions/resume'

export async function POST(request) {
  try {
    const body = await request.json();
    const { content } = body;
    const result = await saveResume(content);
    return NextResponse.json(result);
  } catch (err) {
    console.error('API /resume/save error', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
