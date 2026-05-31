"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function useSession() {
  const router = useRouter();
  const supabase = createClient();

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success("Logged in successfully");
      router.push("/dashboard");
      router.refresh();
      return { error: null };
    },
    [supabase.auth, router]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success("Account created! You can now sign in.");
      router.push("/dashboard");
      router.refresh();
      return { error: null };
    },
    [supabase.auth, router]
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Logged out successfully");
    router.push("/login");
    router.refresh();
  }, [supabase.auth, router]);

  return { signIn, signUp, signOut };
}
