import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mediaType } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const pureBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 256,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType || 'image/jpeg',
                  data: pureBase64,
                },
              },
              {
                type: 'text',
                text: 'This is a photo of a book cover or a page from a book. Extract the book title and author name. Reply with JSON only, no explanation: {"title": "...", "author": "..."}. If you cannot find one of them, use an empty string.',
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API error:', err);
      return NextResponse.json({ error: 'Anthropic API error', detail: err }, { status: 500 });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ title: '', author: '' });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ title: result.title || '', author: result.author || '' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('extract-book-info error:', message);
    return NextResponse.json({ error: 'Failed to extract book info', detail: message }, { status: 500 });
  }
}
