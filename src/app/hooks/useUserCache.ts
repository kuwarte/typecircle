// "use client";

// import { useState, useEffect, useRef } from "react";
// import { createClient } from "@/services/supabase/client";

// export type Profile = {
//   id: string;
//   name: string;
//   image_url: string | null;
// };

// export function useUserCache() {
//   const supabase = createClient();

//   const [cache, setCache] = useState<Map<string, Profile>>(() => {
//     if (typeof window !== "undefined") {
//       const stored = localStorage.getItem("user_cache");
//       if (stored) {
//         try {
//           return new Map(JSON.parse(stored) as [string, Profile][]);
//         } catch {
//           console.warn("Invalid user_cache format in localStorage");
//         }
//       }
//     }
//     return new Map();
//   });

//   const subscribers = useRef(new Set<() => void>());

//   const updateCache = (
//     fn: (prev: Map<string, Profile>) => Map<string, Profile>
//   ) => {
//     setCache((prev) => {
//       const newCache = fn(prev);
//       subscribers.current.forEach((cb) => cb());
//       return newCache;
//     });
//   };

//   useEffect(() => {
//     localStorage.setItem(
//       "user_cache",
//       JSON.stringify(Array.from(cache.entries()))
//     );
//   }, [cache]);

//   const getUser = async (
//     id: string,
//     forceRefresh = false
//   ): Promise<Profile> => {
//     if (!forceRefresh && cache.has(id)) {
//       return cache.get(id)!;
//     }

//     const { data, error } = await supabase
//       .from("user_profile")
//       .select("id, name, image_url")
//       .eq("id", id)
//       .single();

//     if (error || !data) {
//       const fallback: Profile = {
//         id,
//         name: `user_${id.slice(0, 8)}`,
//         image_url: null,
//       };
//       updateCache((prev) => new Map(prev).set(id, fallback));
//       return fallback;
//     }

//     updateCache((prev) => new Map(prev).set(id, data));
//     return data;
//   };

//   const subscribe = (cb: () => void) => {
//     subscribers.current.add(cb);
//     return () => {
//       subscribers.current.delete(cb);
//     };
//   };

//   return { getUser, cache, subscribe };
// }
