import { createClient } from '@supabase/supabase-js';
import { ReadingEntry } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function base64ToBlob(base64: string): Blob {
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
  const byteCharacters = atob(base64Data);
  const byteArray = new Uint8Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }
  return new Blob([byteArray], { type: 'image/jpeg' });
}

async function uploadImage(id: string, suffix: string, base64: string): Promise<string> {
  const blob = base64ToBlob(base64);
  const path = `${id}-${suffix}.jpg`;

  const { error } = await supabase.storage
    .from('diary-images')
    .upload(path, blob, { contentType: 'image/jpeg', upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from('diary-images').getPublicUrl(path);
  return data.publicUrl;
}

export async function getDiaryEntries(): Promise<ReadingEntry[]> {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapRow);
}

export async function saveEntry(
  entry: Omit<ReadingEntry, 'coverImage' | 'pageImage' | 'styledCoverImage' | 'styledPageImage'>,
  coverBase64: string | null,
  pageBase64: string | null
): Promise<void> {
  let coverImageUrl = '';
  let pageImageUrl = '';

  if (coverBase64) coverImageUrl = await uploadImage(entry.id, 'cover', coverBase64);
  if (pageBase64) pageImageUrl = await uploadImage(entry.id, 'page', pageBase64);

  const { error } = await supabase.from('entries').insert({
    id: entry.id,
    book_title: entry.bookTitle,
    author: entry.author,
    thought: entry.thought,
    tags: entry.tags,
    cover_image_url: coverImageUrl,
    page_image_url: pageImageUrl,
    created_at: entry.createdAt,
    updated_at: entry.updatedAt,
  });

  if (error) throw error;
}

export async function getEntry(id: string): Promise<ReadingEntry | null> {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return mapRow(data);
}

export async function deleteEntry(id: string): Promise<void> {
  await supabase.storage
    .from('diary-images')
    .remove([`${id}-cover.jpg`, `${id}-page.jpg`]);

  const { error } = await supabase.from('entries').delete().eq('id', id);
  if (error) throw error;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function mapRow(row: Record<string, unknown>): ReadingEntry {
  return {
    id: row.id as string,
    bookTitle: row.book_title as string,
    author: row.author as string,
    thought: row.thought as string,
    tags: (row.tags as string[]) || [],
    coverImage: (row.cover_image_url as string) || '',
    pageImage: (row.page_image_url as string) || '',
    styledCoverImage: (row.cover_image_url as string) || '',
    styledPageImage: (row.page_image_url as string) || '',
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}
