"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Clock3, Heart, LogOut, Search, UserCircle, X, Film, Loader2 } from "lucide-react";
import { useMember } from "./member-provider";
import { searchMovies, type ListMovie } from "@/lib/ophim-client";

export const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ListMovie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showLiveSearch, setShowLiveSearch] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, openAuth, openLibrary, logout } = useMember();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Debounced live search
  useEffect(() => {
    const cleanQuery = searchQuery.trim();
    if (!cleanQuery || cleanQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchMovies(cleanQuery, 1, 6);
        if (res.status) {
          setSearchResults(res.items.slice(0, 5));
        } else {
          setSearchResults([]);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close live search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowLiveSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowLiveSearch(false);
      router.push(`/tim-kiem?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        lastScrollY > 50
          ? "bg-[#0b0d14]/95 backdrop-blur-xl py-2.5 md:py-3 border-b border-white/5 shadow-2xl"
          : "bg-transparent py-3 md:py-4 bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="w-full px-3 sm:px-5 lg:px-12 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4 z-20">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Mở menu"
            className="menu-toggle cursor-pointer hover:bg-white/10 w-9 min-w-9 h-9 md:w-10 md:min-w-10 md:h-10 flex items-center justify-center rounded-full transition-colors z-[110] outline-none"
          >
            <div className="flex flex-col gap-1.5 w-6">
              <span
                className={`w-full h-[1.5px] bg-white rounded-full transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
              ></span>
              <span
                className={`w-full h-[1.5px] bg-white rounded-full transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
              ></span>
              <span
                className={`w-full h-[1.5px] bg-white rounded-full transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
              ></span>
            </div>
          </button>

          <Link href="/" className="shrink-0 transition-opacity duration-300">
            <Image
              alt="logo"
              width={100}
              height={40}
              src="/images/logo.svg"
              className="h-6 sm:h-8 md:h-[34px] w-auto drop-shadow-md"
              priority
            />
          </Link>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-4">
          <div ref={searchContainerRef} className="relative flex min-w-0 items-center justify-end w-[min(46vw,170px)] sm:w-[260px] md:w-[360px]">
            <form className="w-full" onSubmit={handleSearchSubmit}>
              <div className="relative group">
                <input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowLiveSearch(true);
                  }}
                  onFocus={() => setShowLiveSearch(true)}
                  className="w-full bg-white/5 border border-white/10 text-white text-[12px] sm:text-[13px] rounded-full py-1.5 sm:py-2 pl-3 sm:pl-5 pr-14 sm:pr-16 focus:bg-white/10 focus:border-[#ffd875]/60 outline-none shadow-2xl transition-all placeholder:text-white/35"
                  placeholder="Tìm phim..."
                />
                <div className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {isSearching ? (
                    <Loader2 size={15} className="animate-spin text-[#ffd875]" />
                  ) : searchQuery ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="p-1 text-white/40 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  ) : null}
                  <button
                    type="submit"
                    aria-label="Tìm kiếm"
                    className="p-1 text-white/40 group-focus-within:text-[#ffd875] hover:text-white transition-colors"
                  >
                    <Search size={15} />
                  </button>
                </div>
              </div>
            </form>

            {/* Live Search Autocomplete Modal Dropdown */}
            {showLiveSearch && searchQuery.trim().length >= 2 && (
              <div className="absolute top-full right-0 mt-3 w-[min(90vw,380px)] sm:w-[380px] bg-[#11131d]/98 border border-white/10 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3 border-b border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#ffd875]/70 flex items-center gap-1.5">
                    <Film size={12} />
                    Gợi ý tìm kiếm
                  </span>
                  {isSearching && (
                    <span className="text-[10px] text-white/30 animate-pulse">Đang tìm...</span>
                  )}
                </div>

                <div className="max-h-[340px] overflow-y-auto custom-scrollbar p-2 space-y-1.5">
                  {searchResults.length > 0 ? (
                    searchResults.map((item) => (
                      <Link
                        key={item._id}
                        href={`/phim/${item.slug}`}
                        onClick={() => setShowLiveSearch(false)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-all group"
                      >
                        <div className="relative w-11 h-14 rounded-lg overflow-hidden bg-black/50 shrink-0 border border-white/10">
                          <Image
                            src={item.poster_url}
                            alt={item.name}
                            fill
                            sizes="44px"
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-white truncate group-hover:text-[#ffd875] transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-white/40 truncate mt-0.5">
                            {item.origin_name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-semibold text-[#ffd875] bg-[#ffd875]/10 px-1.5 py-0.5 rounded">
                              {item.year || "2026"}
                            </span>
                            <span className="text-[9px] font-semibold text-white/50 bg-white/5 px-1.5 py-0.5 rounded">
                              HD Vietsub
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : !isSearching ? (
                    <div className="py-6 text-center text-xs text-white/40">
                      Không tìm thấy kết quả phù hợp cho &quot;{searchQuery}&quot;
                    </div>
                  ) : null}
                </div>

                <Link
                  href={`/tim-kiem?keyword=${encodeURIComponent(searchQuery.trim())}`}
                  onClick={() => setShowLiveSearch(false)}
                  className="block p-3 text-center bg-white/5 hover:bg-[#ffd875] text-[11px] font-black uppercase tracking-wider text-white hover:text-black transition-all border-t border-white/5"
                >
                  Xem tất cả kết quả &rarr;
                </Link>
              </div>
            )}
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen((current) => !current)}
                className="flex h-9 items-center gap-2 rounded-full bg-[#ffd875] px-2.5 sm:px-4 text-black transition-all hover:bg-white"
              >
                <UserCircle size={18} />
                <span className="hidden sm:inline max-w-[110px] truncate text-[12px] font-black uppercase tracking-tight">
                  {user.name}
                </span>
              </button>
              <div
                className={`absolute right-0 top-full mt-3 w-[230px] overflow-hidden rounded-2xl border border-white/10 bg-black/95 shadow-[0_18px_55px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-all ${
                  isUserMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-2 pointer-events-none opacity-0"
                }`}
              >
                <div className="border-b border-white/10 p-4">
                  <p className="truncate text-sm font-black text-white">
                    {user.name}
                  </p>
                  <p className="truncate text-[11px] text-white/35">
                    {user.email}
                  </p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      openLibrary("favorites");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold uppercase tracking-widest text-white/60 hover:bg-white/5 hover:text-[#ffd875]"
                  >
                    <Heart size={15} />
                    Tủ phim
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      openLibrary("history");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold uppercase tracking-widest text-white/60 hover:bg-white/5 hover:text-[#ffd875]"
                  >
                    <Clock3 size={15} />
                    Lịch sử xem
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      void logout();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold uppercase tracking-widest text-white/60 hover:bg-white/5 hover:text-red-300"
                  >
                    <LogOut size={15} />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => openAuth("login")}
              className="flex h-9 items-center gap-2 rounded-full bg-[#ffd875] px-2.5 sm:px-4 text-black transition-all hover:bg-white"
            >
              <UserCircle size={18} />
              <span className="hidden sm:inline text-[12px] font-black uppercase tracking-tight">
                Thành viên
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Reverted Dropdown Menu */}
      <div
        className={`absolute top-[calc(100%-4px)] left-3 sm:left-5 mt-3 w-[calc(100vw-24px)] max-w-[300px] bg-black/95 backdrop-blur-2xl border border-white/10 rounded-xl sm:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 transition-all duration-300 origin-top-left ${isMenuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"}`}
      >
        <div className="p-6">
          <p className="text-[#ffd875] text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-40">
            Danh mục phim
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {[
              { name: "Trang Chủ", path: "/" },
              { name: "Cổ Trang", path: "/the-loai/co-trang" },
              { name: "Hài Hước", path: "/the-loai/hai-huoc" },
              { name: "Tình Cảm", path: "/the-loai/tinh-cam" },
              { name: "Hành Động", path: "/the-loai/hanh-dong" },
              { name: "Kinh Dị", path: "/the-loai/kinh-di" },
              { name: "Võ Thuật", path: "/the-loai/vo-thuat" },
              { name: "Hình Sự", path: "/the-loai/hinh-su" },
              { name: "Hoạt Hình", path: "/danh-sach/hoat-hinh" },
              { name: "Phim Bộ", path: "/danh-sach/phim-bo" },
              { name: "Phim Lẻ", path: "/danh-sach/phim-le" },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={cat.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-[13px] font-bold text-white/70 hover:text-[#ffd875] transition-all hover:translate-x-1 uppercase italic tracking-tighter"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
