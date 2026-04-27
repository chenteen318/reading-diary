import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get('title');
  if (!title || title.trim().length < 2) {
    return NextResponse.json({ author: '' });
  }

  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(title)}&maxResults=1&fields=items(volumeInfo(title,authors))`;
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ author: '' });
    }

    const data = await res.json();
    const book = data.items?.[0]?.volumeInfo;
    if (!book) {
      return NextResponse.json({ author: '' });
    }

    const author = book.authors?.[0] || '';
    return NextResponse.json({ author });
  } catch (err) {
    console.error('book-lookup error:', err);
    return NextResponse.json({ author: '' });
  }
}
