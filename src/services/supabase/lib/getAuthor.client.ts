// "use client";

// const authorCache = new Map<
//   string,
//   { name: string; image_url: string | null }
// >();

// export async function getAuthor(author_id: string) {
//   if (authorCache.has(author_id)) return authorCache.get(author_id)!;

//   const res = await fetch(`/api/author/${author_id}`);
//   const data = await res.json();

//   authorCache.set(author_id, data);
//   return data;
// }
