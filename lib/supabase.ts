type SupabaseError = { message: string };

type AuthResponse = {
  access_token?: string;
  user?: { id: string };
  error_description?: string;
  msg?: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ACCESS_TOKEN_KEY = "supabase_access_token";

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

function setAccessToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

async function parseResponse(res: Response) {
  const data = (await res.json().catch(() => ({}))) as AuthResponse;
  if (res.ok) return { data, error: null };

  return {
    data: null,
    error: {
      message:
        data.error_description ??
        data.msg ??
        `Request failed with status ${res.status}`,
    } satisfies SupabaseError,
  };
}

async function request(path: string, init: RequestInit = {}, useAuth = false) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      data: null,
      error: {
        message:
          "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
      } satisfies SupabaseError,
    };
  }

  const token = getAccessToken();
  const headers = new Headers(init.headers);
  headers.set("apikey", supabaseAnonKey);
  headers.set("Content-Type", "application/json");

  if (useAuth && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${supabaseUrl}${path}`, {
    ...init,
    headers,
  });

  return parseResponse(res);
}

export const supabase = {
  auth: {
    async signInWithPassword({ email, password }: { email: string; password: string }) {
      const { data, error } = await request(
        "/auth/v1/token?grant_type=password",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        },
        false,
      );

      if (data?.access_token) {
        setAccessToken(data.access_token);
      }

      return { data, error };
    },

    async getUser() {
      const token = getAccessToken();
      if (!token) {
        return { data: { user: null }, error: null };
      }

      const { data, error } = await request("/auth/v1/user", { method: "GET" }, true);
      return { data: { user: data?.user ?? null }, error };
    },
  },

  from(table: string) {
    return {
      async insert(payload: unknown[]) {
        const { data, error } = await request(
          `/rest/v1/${table}`,
          {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
              Prefer: "return=minimal",
            },
          },
          true,
        );

        return { data, error };
      },
    };
  },
};
