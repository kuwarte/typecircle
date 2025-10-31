"use client";

const authorCache = new Map<
  string,
  { name: string; image_url: string | null }
>();

export async function getAuthor(author_id: string) {
  // return cached value if we already fetched it
  if (authorCache.has(author_id)) return authorCache.get(author_id)!;

  // otherwise fetch from server endpoint
  const res = await fetch(`/api/author/${author_id}`);
  const data = await res.json();

  // store in cache
  authorCache.set(author_id, data);
  return data;
}
