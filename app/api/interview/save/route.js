import { NextResponse } from 'next/server'
import { saveQuizResult } from '@/actions/interview'

export async function POST(request) {
  try {
    const body = await request.json();
    const { questions, answers, score } = body;
    const result = await saveQuizResult(questions, answers, score);
    return NextResponse.json(result);
  } catch (err) {
    console.error('API /interview/save error', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
