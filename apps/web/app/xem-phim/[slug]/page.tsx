"use client";

import { useEffect, useState, Suspense, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Play,
  Star,
  Share2,
  List,
  Zap,
  MessageCircle,
  Moon,
  Sun,
  SkipBack,
  SkipForward,
  Check,
  Film,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { VideoPlayer } from "@/components/video-player";
import { MovieCarousel } from "@/components/movie-carousel";
import { CommentsPanel } from "@/components/comments-panel";
import { MemberMovieActions } from "@/components/member-movie-actions";
import { useMember } from "@/components/member-provider";
import { memberClient } from "@/lib/member-client";
import {
  getMovieDetail,
  getLatestMovies,
  type DetailMovie,
  type Episode,
  type ListMovie,
  type ServerData,
} from "@/lib/ophim-client";

const formatEpisodeName = (name?: string) => {
  if (!name) return "";
  const trimmed = name.trim();
  if (/^tập\s+/i.test(trimmed)) {
    return trimmed;
  }
  if (/^\d+$/.test(trimmed)) {
    return `Tập ${trimmed}`;
  }
  return trimmed;
};

function WatchPageContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState<DetailMovie | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [latestMovies, setLatestMovies] = useState<ListMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentEpisode, setCurrentEpisode] = useState<{
    name: string;
    slug: string;
    url: string;
  } | null>(null);
  const [currentServer, setCurrentServer] = useState(0);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const { user } = useMember();

  const tapParam = searchParams.get("tap");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, latestRes] = await Promise.all([
          getMovieDetail(slug),
          getLatestMovies(1),
        ]);

        if (movieRes && movieRes.status) {
          setMovie(movieRes.movie);
          setEpisodes(movieRes.episodes || []);

          // Set default episode
          const firstServer = movieRes.episodes?.[0];
          if (
            firstServer &&
            firstServer.server_data &&
            firstServer.server_data.length > 0
          ) {
            const ep = tapParam
              ? firstServer.server_data.find((e) => e.slug === tapParam) ||
                firstServer.server_data[0]
              : firstServer.server_data[0];

            if (ep) {
              setCurrentEpisode({
                name: ep.name,
                slug: ep.slug,
                url: ep.link_m3u8 || ep.link_embed,
              });
            }
          }
        }

        if (latestRes && latestRes.status) {
          setLatestMovies(latestRes.items);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchData();
  }, [slug, tapParam]);

  useEffect(() => {
    if (!user || !movie || !currentEpisode) return;

    const timeoutId = window.setTimeout(() => {
      void memberClient
        .saveHistory({
          movieSlug: movie.slug,
          movieTitle: movie.name,
          posterUrl: movie.poster_url,
          episodeName: currentEpisode.name,
          progressSeconds: 0,
        })
        .catch(() => undefined);
    }, 2500);

    return () => window.clearTimeout(timeoutId);
  }, [user, movie, currentEpisode]);

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 3000);
      }
    } catch {
      // Fallback
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0d14] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-[#ffd875] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#ffd875] font-black uppercase tracking-widest text-sm animate-pulse">
            Đang đồng bộ luồng phát...
          </p>
        </div>
      </main>
    );
  }

  if (!movie) return null;

  const currentServerEpisodes = episodes[currentServer]?.server_data || [];
  const currentEpIndex = currentServerEpisodes.findIndex(
    (e) => e.slug === currentEpisode?.slug || e.name === currentEpisode?.name,
  );
  const prevEp = currentEpIndex > 0 ? currentServerEpisodes[currentEpIndex - 1] : null;
  const nextEp =
    currentEpIndex >= 0 && currentEpIndex < currentServerEpisodes.length - 1
      ? currentServerEpisodes[currentEpIndex + 1]
      : null;

  const transformListMovies = (list: ListMovie[]) => {
    return list.map((m) => ({
      id: m._id,
      title: m.name,
      originalTitle: m.origin_name,
      posterUrl: m.poster_url,
      slug: m.slug,
      year: m.year,
      quality: "HD",
      language: "Vietsub",
      isSeries: false,
    }));
  };

  const suggestedMovies = transformListMovies(latestMovies);

  return (
    <main className="min-h-screen bg-[#0b0d14] text-white pt-20 overflow-x-hidden relative">
      {/* Cinema Mode Backdrop */}
      {isCinemaMode && (
        <div
          onClick={() => setIsCinemaMode(false)}
          className="fixed inset-0 bg-black/95 z-30 transition-opacity duration-500 cursor-pointer"
          title="Bấm để thoát chế độ rạp phim"
        />
      )}

      <div className="container mx-auto px-4 lg:px-12 py-6">
        {/* Breadcrumbs & Fast Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-[11px] font-bold text-white/40 uppercase tracking-widest">
            <Link href="/" className="hover:text-white transition-colors">
              RoPhim
            </Link>
            <span>/</span>
            <Link
              href={`/phim/${movie.slug}`}
              className="hover:text-white transition-colors max-w-[200px] truncate"
            >
              {movie.name}
            </Link>
            <span>/</span>
            <span className="text-[#ffd875]">
              {formatEpisodeName(currentEpisode?.name || "Full")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCinemaMode(!isCinemaMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                isCinemaMode
                  ? "bg-[#ffd875] text-black border-[#ffd875]"
                  : "bg-white/5 hover:bg-white/10 text-white/70 border-white/10"
              }`}
            >
              {isCinemaMode ? <Sun size={13} /> : <Moon size={13} />}
              <span>{isCinemaMode ? "Bật đèn" : "Tắt đèn"}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-xs font-bold text-white/70 hover:text-white transition-all relative"
            >
              {copiedToast ? <Check size={13} className="text-green-400" /> : <Share2 size={13} />}
              <span>{copiedToast ? "Đã sao chép link!" : "Chia sẻ"}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left: Player & Info */}
          <div className="flex-1 min-w-0">
            {/* Player Wrapper */}
            <div className={`relative mb-4 transition-all duration-300 ${isCinemaMode ? "z-40 shadow-[0_0_80px_rgba(0,0,0,0.9)]" : ""}`}>
              {currentEpisode?.url && (
                <VideoPlayer
                  url={currentEpisode.url}
                  poster={movie.thumb_url}
                  title={`${movie.name} - ${formatEpisodeName(currentEpisode.name)}`}
                />
              )}
            </div>

            {/* Quick Episode Navigation & Control Bar */}
            <div className="bg-[#191b24] p-4 sm:p-5 rounded-2xl border border-white/5 flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight truncate">
                  {movie.name}{" "}
                  <span className="text-[#ffd875]">
                    — {formatEpisodeName(currentEpisode?.name)}
                  </span>
                </h1>
                <p className="text-xs text-white/40 mt-0.5 truncate">{movie.origin_name}</p>
              </div>

              {/* Episode Step Controller & Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                {prevEp && (
                  <button
                    onClick={() => router.push(`/xem-phim/${movie.slug}?tap=${prevEp.slug}`)}
                    className="flex items-center gap-1 px-3.5 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-xs font-bold text-white/80 transition-all"
                  >
                    <SkipBack size={14} />
                    <span className="hidden sm:inline">Tập trước ({formatEpisodeName(prevEp.name)})</span>
                  </button>
                )}

                {nextEp && (
                  <button
                    onClick={() => router.push(`/xem-phim/${movie.slug}?tap=${nextEp.slug}`)}
                    className="flex items-center gap-1 px-4 py-2 bg-[#ffd875] hover:brightness-110 text-black rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md"
                  >
                    <span>Tập tiếp ({formatEpisodeName(nextEp.name)})</span>
                    <SkipForward size={14} />
                  </button>
                )}

                <MemberMovieActions
                  movie={{
                    movieSlug: movie.slug,
                    movieTitle: movie.name,
                    posterUrl: movie.poster_url,
                  }}
                />
              </div>
            </div>

            {/* Servers & Episodes Mobile */}
            <div className="xl:hidden mb-8 space-y-6">
              <EpisodeList
                episodes={episodes}
                currentEpisode={currentEpisode}
                slug={movie.slug}
                currentServer={currentServer}
                onServerChange={setCurrentServer}
              />
            </div>

            {/* Description Section */}
            <div className="bg-[#191b24] p-6 sm:p-8 rounded-2xl border border-white/5 relative overflow-hidden group mb-8">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Play size={120} className="text-white fill-white" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-[#ffd875] rounded-full" />
                  <h3 className="text-lg font-black uppercase tracking-widest">
                    Chi tiết phim
                  </h3>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6 text-[12px] font-bold uppercase tracking-widest text-white/40">
                  <div className="space-y-1">
                    <span>Năm sản xuất</span>
                    <p className="text-white text-sm">{movie.year}</p>
                  </div>
                  <div className="space-y-1">
                    <span>Định dạng</span>
                    <p className="text-[#ffd875] text-sm">{movie.quality}</p>
                  </div>
                  <div className="space-y-1">
                    <span>Trạng thái</span>
                    <p className="text-white text-sm">
                      {movie.episode_current}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span>Quốc gia</span>
                    <p className="text-white text-sm">
                      {movie.country?.[0]?.name || "Đang cập nhật"}
                    </p>
                  </div>
                </div>
                <div
                  className="text-white/60 text-sm leading-relaxed max-w-4xl"
                  dangerouslySetInnerHTML={{ __html: movie.content }}
                />
              </div>
            </div>

            {/* Comments Area */}
            <CommentsPanel
              movie={{
                movieSlug: movie.slug,
                movieTitle: movie.name,
                posterUrl: movie.poster_url,
              }}
            />
          </div>

          {/* Right: Sidebar - Episode List & Ranking */}
          <div className="w-full xl:w-[380px] space-y-8 flex-shrink-0">
            {/* Server & Episode Selector */}
            <div className="hidden xl:block">
              <EpisodeList
                episodes={episodes}
                currentEpisode={currentEpisode}
                slug={movie.slug}
                currentServer={currentServer}
                onServerChange={setCurrentServer}
              />
            </div>

            {/* Top Ranking Sidebar */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <Zap className="text-[#ffd875] fill-[#ffd875]" size={16} />
                  Thành viên xem nhiều
                </h3>
              </div>
              <div className="space-y-4">
                {suggestedMovies.slice(0, 6).map((m) => (
                  <Link
                    key={m.id}
                    href={`/phim/${m.slug}`}
                    className="flex gap-4 group cursor-pointer"
                  >
                    <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
                      <Image
                        src={m.posterUrl}
                        alt={m.title}
                        fill
                        sizes="64px"
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                      <h4 className="text-xs font-black uppercase tracking-tight line-clamp-1 group-hover:text-[#ffd875] transition-colors">
                        {m.title}
                      </h4>
                      <p className="text-[10px] font-bold text-white/30 uppercase">
                        {m.year} • {m.quality}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star
                          className="text-[#ffd875] fill-[#ffd875]"
                          size={10}
                        />
                        <span className="text-[9px] font-black text-[#ffd875]">
                          10.0
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Carousels */}
        <div className="mt-16">
          <MovieCarousel title="Có thể bạn quan tâm" items={suggestedMovies} />
        </div>
      </div>
    </main>
  );
}

interface EpisodeListProps {
  episodes: Episode[];
  currentEpisode: { name: string; url: string } | null;
  slug: string;
  currentServer: number;
  onServerChange: (serverIndex: number) => void;
}

function EpisodeList({
  episodes,
  currentEpisode,
  slug,
  currentServer,
  onServerChange,
}: EpisodeListProps) {
  if (!episodes || episodes.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <List className="text-[#ffd875]" size={18} />
          <h3 className="text-sm font-black uppercase tracking-widest">
            Danh sách tập
          </h3>
        </div>
        {episodes.length > 1 && (
          <div className="flex gap-2">
            {episodes.map((server, i) => (
              <button
                key={`${server.server_name}-${i}`}
                onClick={() => onServerChange(i)}
                className={`px-3 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${currentServer === i ? "bg-[#ffd875] text-black shadow-[0_0_15px_rgba(255,216,117,0.3)]" : "bg-white/5 text-white/40 hover:text-white"}`}
              >
                SV {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#191b24] p-4 rounded-2xl border border-white/5 max-h-[400px] overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-5 xl:grid-cols-4 gap-2.5">
          {episodes[currentServer]?.server_data.map((ep: ServerData) => (
            <Link
              key={ep.slug}
              href={`/xem-phim/${slug}?tap=${ep.slug}`}
              className={`h-11 flex items-center justify-center rounded-xl text-xs font-black transition-all border ${
                currentEpisode?.name === ep.name
                  ? "bg-[#ffd875] text-black border-[#ffd875] shadow-[0_0_15px_rgba(255,216,117,0.2)]"
                  : "bg-white/5 text-white/50 border-white/5 hover:border-[#ffd875]/40 hover:text-[#ffd875]"
              }`}
            >
              {formatEpisodeName(ep.name)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0b0d14] text-white flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#ffd875] border-t-transparent rounded-full animate-spin"></div>
        </main>
      }
    >
      <WatchPageContent params={params} />
    </Suspense>
  );
}
