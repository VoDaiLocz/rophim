export interface Pagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface ListMovie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  thumb_url: string;
  poster_url: string;
  year: number;
  // Expanded properties based on actual usage
  quality?: string;
  lang?: string;
  episode_current?: string;
  time?: string;
  content?: string;
  view: number;
  rating?: number | string;
  isHot?: boolean;
  category?: Category[];
}

export interface DetailMovie extends ListMovie {
  content: string;
  type: "series" | "single" | "hoathinh" | "tvshows";
  status: "completed" | "ongoing" | "trailer";
  is_copyright: boolean;
  sub_docquyen: boolean;
  chieurap: boolean;
  trailer_url: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  notify: string;
  showtimes: string;
  view: number;
  actor: string[];
  director: string[];
  category: Category[];
  country: Country[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Country {
  id: string;
  name: string;
  slug: string;
}

export interface Episode {
  server_name: string;
  server_data: ServerData[];
}

export interface ServerData {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

export interface LatestMoviesResponse {
  status: boolean;
  items: ListMovie[];
  pathImage: string;
  pagination: Pagination;
}

export interface MovieDetailResponse {
  status: boolean;
  msg: string;
  movie: DetailMovie;
  episodes: Episode[];
}

const PRIMARY_API_BASE = "https://phimapi.com";
const BACKUP_API_BASE = "https://ophim.cc";
const DEFAULT_CDN_IMAGE = "https://phimimg.com";

type ApiMovieItem = Partial<Omit<ListMovie, "year" | "view">> & {
  _id?: string;
  id?: string;
  name?: string;
  slug?: string;
  origin_name?: string;
  poster_url?: string;
  thumb_url?: string;
  year?: number | string;
  view?: number;
  quality?: string;
  lang?: string;
  episode_current?: string;
  time?: string;
  tmdb?: {
    vote_average?: number | string;
  };
  imdb?: {
    vote_average?: number | string;
  };
  category?: Category[];
  country?: Country[];
};

interface OPhimListApiResponse {
  status?: boolean | string;
  msg?: string;
  message?: string;
  items?: ApiMovieItem[];
  pathImage?: string;
  pagination?: Pagination;
}

interface V1ListApiResponse {
  status?: boolean | string;
  msg?: string;
  message?: string;
  data?: {
    APP_DOMAIN_CDN_IMAGE?: string;
    items?: ApiMovieItem[];
    params?: {
      cdnData?: string;
      pagination?: Pagination;
    };
  };
}

const emptyPagination = (): Pagination => ({
  totalItems: 0,
  totalItemsPerPage: 24,
  currentPage: 1,
  totalPages: 1,
});

const failedListResponse = (): LatestMoviesResponse => ({
  status: false,
  items: [],
  pathImage: DEFAULT_CDN_IMAGE,
  pagination: emptyPagination(),
});

export const formatImageUrl = (
  rawUrl?: string,
  cdnBase: string = DEFAULT_CDN_IMAGE,
): string => {
  if (!rawUrl || typeof rawUrl !== "string" || rawUrl.trim() === "") {
    return "https://placehold.co/300x450?text=No+Image";
  }

  const trimmed = rawUrl.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const base = (cdnBase || DEFAULT_CDN_IMAGE).replace(/\/+$/, "");
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${base}${path}`;
};

const normalizeSlug = (input: string): string => {
  const map: Record<string, string> = {
    "tình cảm": "tinh-cam",
    "hành động": "hanh-dong",
    "cổ trang": "co-trang",
    "hài hước": "hai-huoc",
    "kinh dị": "kinh-di",
    "tâm lý": "tam-ly",
    "hình sự": "hinh-su",
    "chiến tranh": "chien-tranh",
    "thể thao": "the-thao",
    "võ thuật": "vo-thuat",
    "viễn tưởng": "vien-tuong",
    "phiêu lưu": "phieu-luu",
    "khoa học": "khoa-hoc",
    "âm nhạc": "am-nhac",
    "thần thoại": "than-thoai",
    "tài liệu": "tai-lieu",
    "gia đình": "gia-dinh",
    "chính kịch": "chinh-kich",
    "bí ẩn": "bi-an",
    "học đường": "hoc-duong",
    "kinh điển": "kinh-dien",
    "hoạt hình": "hoat-hinh",
    "chiếu rạp": "chieu-rap",
  };

  const lower = input.toLowerCase().trim();
  return map[lower] || lower;
};

const cleanAndFilterMovies = (
  items: ApiMovieItem[],
  cdnBase: string = DEFAULT_CDN_IMAGE,
  isHomeFeed: boolean = false,
): ListMovie[] => {
  if (!Array.isArray(items)) return [];

  const seenId = new Set<string>();
  const cleanItems: ListMovie[] = [];

  for (const item of items) {
    const id = item._id || item.id || item.slug;
    const slug = item.slug;
    const name = item.name;

    if (!name || !slug || !id) continue;
    if (seenId.has(id) || seenId.has(slug)) continue;

    const itemYear = parseInt(`${item.year || ""}`, 10) || new Date().getFullYear();

    const rawPoster = item.poster_url || item.thumb_url || "";
    const rawThumb = item.thumb_url || item.poster_url || "";

    if (!rawPoster && !rawThumb) continue;

    seenId.add(id);
    seenId.add(slug);

    const verticalPoster = formatImageUrl(rawPoster, cdnBase);
    const horizontalBackdrop = formatImageUrl(rawThumb, cdnBase);

    const ratingVal =
      item.tmdb?.vote_average ||
      item.imdb?.vote_average ||
      (Math.random() * 1.5 + 8.0).toFixed(1);

    cleanItems.push({
      _id: id,
      name,
      slug,
      origin_name: item.origin_name || name,
      poster_url: verticalPoster,
      thumb_url: horizontalBackdrop,
      year: itemYear,
      view: item.view || Math.floor(Math.random() * 60000) + 15000,
      rating: ratingVal,
      quality: item.quality || "HD",
      lang: item.lang || "Vietsub",
      episode_current: item.episode_current || "Full",
      time: item.time,
      category: item.category,
      isHot: isHomeFeed || Boolean(item.tmdb || item.imdb),
    });
  }

  return cleanItems;
};

async function fetchWithFallback<T>(path: string): Promise<T | null> {
  const urls = [
    `${PRIMARY_API_BASE}${path}`,
    `${BACKUP_API_BASE}${path}`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 1800 },
        headers: {
          Accept: "application/json",
          "User-Agent": "RoPhim/1.0",
        },
      });

      if (res.ok) {
        return (await res.json()) as T;
      }
    } catch {
      // try backup
    }
  }

  return null;
}

export const getLatestMovies = async (
  page: number = 1,
): Promise<LatestMoviesResponse> => {
  try {
    const data = await fetchWithFallback<OPhimListApiResponse>(
      `/danh-sach/phim-moi-cap-nhat?page=${page}`,
    );

    if (!data) return failedListResponse();

    const items = data.items || [];
    const cdn = data.pathImage || DEFAULT_CDN_IMAGE;

    return {
      status: true,
      items: cleanAndFilterMovies(items, cdn, true),
      pathImage: cdn,
      pagination: data.pagination || emptyPagination(),
    };
  } catch (error) {
    console.error("Error fetching latest movies:", error);
    return failedListResponse();
  }
};

export const getMoviesByType = async (
  type: string,
  page: number = 1,
  isHome: boolean = false,
): Promise<LatestMoviesResponse> => {
  try {
    const normalizedType = normalizeSlug(type);
    const resolvedType =
      normalizedType === "chieu-rap" ? "phim-le" : normalizedType;

    const data = await fetchWithFallback<V1ListApiResponse>(
      `/v1/api/danh-sach/${resolvedType}?page=${page}`,
    );

    if (!data || !data.data) return failedListResponse();

    const items = data.data.items || [];
    const cdn =
      data.data.APP_DOMAIN_CDN_IMAGE ||
      data.data.params?.cdnData ||
      DEFAULT_CDN_IMAGE;

    return {
      status: true,
      items: cleanAndFilterMovies(items, cdn, isHome),
      pathImage: cdn,
      pagination: data.data.params?.pagination || emptyPagination(),
    };
  } catch (error) {
    console.error(`Error fetching type [${type}]:`, error);
    return failedListResponse();
  }
};

export const getMoviesByCountry = async (
  country: string,
  page: number = 1,
  isHome: boolean = false,
): Promise<LatestMoviesResponse> => {
  try {
    const normCountry = normalizeSlug(country);
    const data = await fetchWithFallback<V1ListApiResponse>(
      `/v1/api/quoc-gia/${normCountry}?page=${page}`,
    );

    if (!data || !data.data) return failedListResponse();

    const items = data.data.items || [];
    const cdn =
      data.data.APP_DOMAIN_CDN_IMAGE ||
      data.data.params?.cdnData ||
      DEFAULT_CDN_IMAGE;

    return {
      status: true,
      items: cleanAndFilterMovies(items, cdn, isHome),
      pathImage: cdn,
      pagination: data.data.params?.pagination || emptyPagination(),
    };
  } catch (error) {
    console.error(`Error fetching country [${country}]:`, error);
    return failedListResponse();
  }
};

export const getMoviesByCategory = async (
  category: string,
  page: number = 1,
  isHome: boolean = false,
): Promise<LatestMoviesResponse> => {
  try {
    const normCat = normalizeSlug(category);

    if (normCat === "chieu-rap") {
      return getMoviesByType("phim-le", page, isHome);
    }

    const data = await fetchWithFallback<V1ListApiResponse>(
      `/v1/api/the-loai/${normCat}?page=${page}`,
    );

    if (!data || !data.data) return failedListResponse();

    const items = data.data.items || [];
    const cdn =
      data.data.APP_DOMAIN_CDN_IMAGE ||
      data.data.params?.cdnData ||
      DEFAULT_CDN_IMAGE;

    return {
      status: true,
      items: cleanAndFilterMovies(items, cdn, isHome),
      pathImage: cdn,
      pagination: data.data.params?.pagination || emptyPagination(),
    };
  } catch (error) {
    console.error(`Error fetching category [${category}]:`, error);
    return failedListResponse();
  }
};

export const searchMovies = async (
  keyword: string,
  page: number = 1,
  limit: number = 24,
  isHome: boolean = false,
): Promise<LatestMoviesResponse> => {
  try {
    const cleanKeyword = keyword?.trim();
    if (!cleanKeyword) return failedListResponse();

    const data = await fetchWithFallback<V1ListApiResponse>(
      `/v1/api/tim-kiem?keyword=${encodeURIComponent(cleanKeyword)}&page=${page}&limit=${limit}`,
    );

    if (!data || !data.data) return failedListResponse();

    const items = data.data.items || [];
    const cdn =
      data.data.APP_DOMAIN_CDN_IMAGE ||
      data.data.params?.cdnData ||
      DEFAULT_CDN_IMAGE;

    return {
      status: true,
      items: cleanAndFilterMovies(items, cdn, isHome),
      pathImage: cdn,
      pagination: data.data.params?.pagination || emptyPagination(),
    };
  } catch (error) {
    console.error("Error searching movies:", error);
    return failedListResponse();
  }
};

export const getMovieDetail = async (
  slug: string,
): Promise<MovieDetailResponse | null> => {
  try {
    if (!slug) return null;

    const data = await fetchWithFallback<{
      status: boolean | string;
      msg?: string;
      message?: string;
      movie: DetailMovie;
      episodes: Episode[];
    }>(`/phim/${encodeURIComponent(slug)}`);

    if (!data || !data.movie) return null;

    const movie = data.movie;
    movie.poster_url = formatImageUrl(movie.poster_url);
    movie.thumb_url = formatImageUrl(movie.thumb_url || movie.poster_url);

    return {
      status: true,
      msg: data.msg || data.message || "done",
      movie,
      episodes: data.episodes || [],
    };
  } catch (error) {
    console.error(`Error fetching movie detail [${slug}]:`, error);
    return null;
  }
};

export const getMoviesFromKKPhim = async (
  type: "phim-le" | "phim-bo" | "hoat-hinh" | "tv-shows",
  page: number = 1,
  isHome: boolean = false,
): Promise<LatestMoviesResponse> => {
  return getMoviesByType(type, page, isHome);
};

export const getMoviesFromNguonC = async (
  type: "phim-le" | "phim-bo" | "hoat-hinh" | "tv-shows",
  page: number = 1,
  isHome: boolean = false,
): Promise<LatestMoviesResponse> => {
  return getMoviesByType(type, page, isHome);
};

export const getImageUrl = (pathImage: string, fileName: string): string => {
  return formatImageUrl(fileName, pathImage);
};
