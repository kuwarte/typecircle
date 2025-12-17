import { useEffect, useState } from "react";
import { createClient } from "../client";
import { User } from "@supabase/supabase-js";

type UserWithProfile = User & {
  enneagram_type?: number | null;
};

export function useCurrentUser() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserWithProfile | null>(null);

  useEffect(() => {
    const supabase = createClient();
    
    const fetchUserWithProfile = async (authUser: User) => {
      const { data: profile } = await supabase
        .from("user_profile")
        .select("enneagram_type")
        .eq("id", authUser.id)
        .single();
      
      setUser({ ...authUser, enneagram_type: profile?.enneagram_type });
    };

    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (data.user) {
          fetchUserWithProfile(data.user);
        } else {
          setUser(null);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        fetchUserWithProfile(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading };
}
