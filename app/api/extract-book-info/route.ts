import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mediaType } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const response = await client.messages.create({
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
                data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
              },
            },
            {
              type: 'text',
              text: 'This is a photo of a book cover or a page from a book. Extract the book title and author name. Reply with JSON only, no explanation: {"title": "...", "author": "..."}. If you cannot find one of them, use an empty string.',
            },
          ],
        },
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
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
