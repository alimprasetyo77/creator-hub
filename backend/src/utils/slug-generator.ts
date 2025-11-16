import { customAlphabet } from 'nanoid';

export async function generateSlug(title: string) {
  const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 6);

  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // hapus karakter aneh
    .replace(/\s+/g, '-') // spasi → dash
    .replace(/-+/g, '-'); // hilangkan double dash

  return `${base}-${nanoid()}`;
}
