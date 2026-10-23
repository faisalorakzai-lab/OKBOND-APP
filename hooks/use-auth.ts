import * as Auth from "@/lib/_core/auth";
import { supabase, toAuthUser } from "@/lib/supabase";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isTestnetPreviewEnabled, isTestnetPreviewUser } from "@/lib/testnet";

type UseAuthOptions = { autoFetch?: boolean };

export function useAuth(options?: UseAuthOptions) {
  const { autoFetch = true } = options ?? {};
  const [user, setUser] = useState<Auth.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (data.session?.user) {
        const userInfo = toAuthUser(data.session.user);
        setUser(userInfo);
        await Auth.setUserInfo(userInfo);
      } else {
        const cachedUser = await Auth.getUserInfo();
        if (isTestnetPreviewEnabled() && isTestnetPreviewUser(cachedUser)) setUser(cachedUser);
        else { setUser(null); await Auth.clearUserInfo(); }
      }
    } catch (err) {
      const nextError = err instanceof Error ? err : new Error("Failed to restore authentication session");
      setError(nextError);
      setUser(null);
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    await Auth.removeSessionToken();
    await Auth.clearUserInfo();
    setUser(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (!autoFetch) { setLoading(false); return; }
    void fetchUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userInfo = toAuthUser(session.user);
        setUser(userInfo);
        void Auth.setUserInfo(userInfo);
      } else if (!isTestnetPreviewEnabled()) {
        setUser(null);
      }
      setLoading(false);
    });
    return () => listener.subscription.unsubscribe();
  }, [autoFetch, fetchUser]);

  return { user, loading, error, isAuthenticated: useMemo(() => Boolean(user), [user]), refresh: fetchUser, logout };
}
