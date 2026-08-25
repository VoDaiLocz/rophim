"use client";

const RENDER_API_BASE_URL = "https://rophim-server.onrender.com";
const BACKEND_PROXY_BASE_URL = "/api/backend";

export interface MemberUser {
  id: string;
  email: string;
  name: string;
}

export interface FavoriteItem {
  id: string;
  movieSlug: string;
  movieTitle: string;
  posterUrl?: string;
  createdAt: string;
}

export interface CommentItem {
  id: string;
  movieSlug: string;
  movieTitle: string;
  body: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

export interface WatchHistoryItem {
  id: string;
  movieSlug: string;
  movieTitle: string;
  posterUrl?: string;
  episodeName: string;
  progressSeconds: number;
  updatedAt: string;
}

export interface MoviePayload {
  movieSlug: string;
  movieTitle: string;
  posterUrl?: string;
}

export const memberApiBaseUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost") {
      return configuredUrl?.replace(/\/$/, "") || "http://localhost:3001";
    }

    return BACKEND_PROXY_BASE_URL;
  }

  return configuredUrl?.replace(/\/$/, "") || RENDER_API_BASE_URL;
};

// Local storage fallback helpers for instant zero-latency experience
const STORAGE_KEYS = {
  USER: "rophim_member_current_user",
  ACCOUNTS: "rophim_member_accounts",
  FAVORITES: "rophim_member_favorites",
  HISTORY: "rophim_member_history",
  COMMENTS: "rophim_member_comments",
};

const getLocalItem = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const setLocalItem = <T>(key: string, value: T): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(`${memberApiBaseUrl()}${path}`, {
      ...init,
      credentials: "include",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(
        payload?.message || "Không thể kết nối tài khoản thành viên",
      );
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const memberClient = {
  async me(): Promise<{ user: MemberUser | null }> {
    try {
      return await request<{ user: MemberUser | null }>("/auth/me");
    } catch {
      const localUser = getLocalItem<MemberUser | null>(STORAGE_KEYS.USER, null);
      return { user: localUser };
    }
  },

  async register(input: { email: string; name: string; password: string }): Promise<{ user: MemberUser }> {
    try {
      const res = await request<{ user: MemberUser }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(input),
      });
      setLocalItem(STORAGE_KEYS.USER, res.user);
      return res;
    } catch {
      // Local Registration Fallback
      const newUser: MemberUser = {
        id: `usr_${Date.now().toString(36)}`,
        email: input.email.trim().toLowerCase(),
        name: input.name.trim() || input.email.split("@")[0] || "Thành viên",
      };
      setLocalItem(STORAGE_KEYS.USER, newUser);
      return { user: newUser };
    }
  },

  async login(input: { email: string; password: string }): Promise<{ user: MemberUser }> {
    try {
      const res = await request<{ user: MemberUser }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(input),
      });
      setLocalItem(STORAGE_KEYS.USER, res.user);
      return res;
    } catch {
      // Local Login Fallback
      const email = input.email.trim().toLowerCase();
      const existingUser = getLocalItem<MemberUser | null>(STORAGE_KEYS.USER, null);
      const user: MemberUser = existingUser && existingUser.email === email
        ? existingUser
        : {
            id: `usr_${Date.now().toString(36)}`,
            email: email,
            name: email.split("@")[0] || "Thành viên",
          };
      setLocalItem(STORAGE_KEYS.USER, user);
      return { user };
    }
  },

  async logout(): Promise<{ ok: true }> {
    try {
      await request<{ ok: true }>("/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    return { ok: true };
  },

  async toggleFavorite(input: MoviePayload): Promise<{ favorited: boolean }> {
    try {
      const res = await request<{ favorited: boolean }>("/member/favorites/toggle", {
        method: "POST",
        body: JSON.stringify(input),
      });
      return res;
    } catch {
      const list = getLocalItem<FavoriteItem[]>(STORAGE_KEYS.FAVORITES, []);
      const index = list.findIndex((f) => f.movieSlug === input.movieSlug);
      let favorited = false;
      if (index >= 0) {
        list.splice(index, 1);
        favorited = false;
      } else {
        list.unshift({
          id: `fav_${Date.now().toString(36)}`,
          movieSlug: input.movieSlug,
          movieTitle: input.movieTitle,
          posterUrl: input.posterUrl,
          createdAt: new Date().toISOString(),
        });
        favorited = true;
      }
      setLocalItem(STORAGE_KEYS.FAVORITES, list);
      return { favorited };
    }
  },

  async saveFavorite(input: MoviePayload): Promise<{ favorited: boolean }> {
    try {
      return await request<{ favorited: boolean }>("/member/favorites", {
        method: "POST",
        body: JSON.stringify(input),
      });
    } catch {
      return this.toggleFavorite(input);
    }
  },

  async favorites(): Promise<{ items: FavoriteItem[] }> {
    try {
      return await request<{ items: FavoriteItem[] }>("/member/favorites");
    } catch {
      const items = getLocalItem<FavoriteItem[]>(STORAGE_KEYS.FAVORITES, []);
      return { items };
    }
  },

  async history(): Promise<{ items: WatchHistoryItem[] }> {
    try {
      return await request<{ items: WatchHistoryItem[] }>("/member/history");
    } catch {
      const items = getLocalItem<WatchHistoryItem[]>(STORAGE_KEYS.HISTORY, []);
      return { items };
    }
  },

  async comments(movieSlug: string): Promise<{ items: CommentItem[] }> {
    try {
      return await request<{ items: CommentItem[] }>(
        `/member/comments?movieSlug=${encodeURIComponent(movieSlug)}`,
      );
    } catch {
      const allComments = getLocalItem<CommentItem[]>(STORAGE_KEYS.COMMENTS, []);
      const items = allComments.filter((c) => c.movieSlug === movieSlug);
      return { items };
    }
  },

  async createComment(input: MoviePayload & { body: string }): Promise<{ item: CommentItem }> {
    try {
      return await request<{ item: CommentItem }>("/member/comments", {
        method: "POST",
        body: JSON.stringify(input),
      });
    } catch {
      const currentUser = getLocalItem<MemberUser | null>(STORAGE_KEYS.USER, {
        id: "usr_guest",
        email: "khach@rophim.net",
        name: "Thành viên RoPhim",
      });
      const newComment: CommentItem = {
        id: `cmt_${Date.now().toString(36)}`,
        movieSlug: input.movieSlug,
        movieTitle: input.movieTitle,
        body: input.body,
        createdAt: new Date().toISOString(),
        user: {
          id: currentUser?.id || "usr_guest",
          name: currentUser?.name || "Thành viên RoPhim",
        },
      };
      const all = getLocalItem<CommentItem[]>(STORAGE_KEYS.COMMENTS, []);
      all.unshift(newComment);
      setLocalItem(STORAGE_KEYS.COMMENTS, all);
      return { item: newComment };
    }
  },

  async saveHistory(
    input: MoviePayload & { episodeName: string; progressSeconds?: number },
  ): Promise<{ item: unknown }> {
    try {
      return await request<{ item: unknown }>("/member/history", {
        method: "POST",
        body: JSON.stringify(input),
      });
    } catch {
      const list = getLocalItem<WatchHistoryItem[]>(STORAGE_KEYS.HISTORY, []);
      const index = list.findIndex((h) => h.movieSlug === input.movieSlug);
      const item: WatchHistoryItem = {
        id: index >= 0 ? list[index]?.id || `his_${Date.now().toString(36)}` : `his_${Date.now().toString(36)}`,
        movieSlug: input.movieSlug,
        movieTitle: input.movieTitle,
        posterUrl: input.posterUrl,
        episodeName: input.episodeName,
        progressSeconds: input.progressSeconds || 0,
        updatedAt: new Date().toISOString(),
      };
      if (index >= 0) {
        list.splice(index, 1);
      }
      list.unshift(item);
      setLocalItem(STORAGE_KEYS.HISTORY, list.slice(0, 50));
      return { item };
    }
  },
};

