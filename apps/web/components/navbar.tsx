"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Clock3,
  LogOut,
  Search,
  UserCircle,
  X,
  Film,
  Loader2,
  ChevronDown,
  Sparkles,
  Globe,
  Tv,
  Clapperboard,
  Flame,
  Menu,
  TrendingUp,
  Bookmark,
} from "lucide-react";
import { useMember } from "./member-provider";
import { searchMovies, type ListMovie } from "@/lib/ophim-client";

const GENRES = [
  { name: "Hành Động", slug: "hanh-dong" },
  { name: "Cổ Trang", slug: "co-trang" },
  { name: "Tình Cảm", slug: "tinh-cam" },
  { name: "Hài Hước", slug: "hai-huoc" },
  { name: "Kinh Dị", slug: "kinh-di" },
  { name: "Võ Thuật", slug: "vo-thuat" },
  { name: "Viễn Tưởng", slug: "vien-tuong" },
  { name: "Hình Sự", slug: "hinh-su" },
  { name: "Tâm Lý", slug: "tam-ly" },
  { name: "Học Đường", slug: "hoc-duong" },
  { name: "Phiêu Lưu", slug: "phieu-luu" },
  { name: "Chiến Tranh", slug: "chien-tranh" },
  { name: "Gia Đình", slug: "gia-dinh" },
  { name: "Khoa Học", slug: "khoa-hoc" },
];

const COUNTRIES = [
  { name: "Hàn Quốc", slug: "han-quoc", flag: "🇰🇷" },
  { name: "Trung Quốc", slug: "trung-quoc", flag: "🇨🇳" },
  { name: "Âu Mỹ", slug: "au-my", flag: "🇺🇸" },
  { name: "Nhật Bản", slug: "nhat-ban", flag: "🇯🇵" },
  { name: "Thái Lan", slug: "thai-lan", flag: "🇹🇭" },
  { name: "Việt Nam", slug: "viet-nam", flag: "🇻🇳" },
  { name: "Đài Loan", slug: "dai-loan", flag: "🇹🇼" },
  { name: "Hồng Kông", slug: "hong-kong", flag: "🇭🇰" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileGenreOpen, setIsMobileGenreOpen] = useState(true);
  const [isMobileCountryOpen, setIsMobileCountryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ListMovie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showLiveSearch, setShowLiveSearch] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, openAuth, openLibrary, logout } = useMember();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close overlays on route change
  useEffect(() => {
    setIsMobileDrawerOpen(false);
    setShowLiveSearch(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

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
        if (res && res.status && res.items) {
          setSearchResults(res.items.slice(0, 5));
        } else {
          setSearchResults([]);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener for search & user menu
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
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0b0d14]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-2.5 sm:py-3"
            : "bg-gradient-to-b from-black/80 via-black/30 to-transparent py-3 sm:py-4"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-6">
          {/* Left: Brand Logo & Desktop Navigation */}
          <div className="flex items-center gap-3 sm:gap-8">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              aria-label="Mở menu"
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white/80 transition-colors"
            >
              <Menu size={18} />
            </button>

            {/* Brand Logo */}
            <Link href="/" className="shrink-0 flex items-center gap-2 group">
              <Image
                alt="RoPhim Logo"
                width={110}
                height={32}
                src="/images/logo.svg"
                className="h-6 sm:h-7 md:h-8 w-auto drop-shadow transition-transform group-hover:scale-105"
                priority
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-xl text-[13px] font-medium transition-all ${
                  pathname === "/"
                    ? "text-[#ffd875] bg-white/[0.08] font-semibold"
                    : "text-white/70 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                Trang Chủ
              </Link>

              <Link
                href="/danh-sach/phim-bo"
                className={`px-3 py-1.5 rounded-xl text-[13px] font-medium transition-all ${
                  pathname === "/danh-sach/phim-bo"
                    ? "text-[#ffd875] bg-white/[0.08] font-semibold"
                    : "text-white/70 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                Phim Bộ
              </Link>

              <Link
                href="/danh-sach/phim-le"
                className={`px-3 py-1.5 rounded-xl text-[13px] font-medium transition-all ${
                  pathname === "/danh-sach/phim-le"
                    ? "text-[#ffd875] bg-white/[0.08] font-semibold"
                    : "text-white/70 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                Phim Lẻ
              </Link>

              <Link
                href="/danh-sach/hoat-hinh"
                className={`px-3 py-1.5 rounded-xl text-[13px] font-medium transition-all ${
                  pathname === "/danh-sach/hoat-hinh"
                    ? "text-[#ffd875] bg-white/[0.08] font-semibold"
                    : "text-white/70 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                Hoạt Hình
              </Link>

              {/* Thể Loại Mega Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[13px] font-medium text-white/70 group-hover:text-white group-hover:bg-white/[0.05] transition-all">
                  <span>Thể Loại</span>
                  <ChevronDown size={13} className="text-white/40 group-hover:rotate-180 group-hover:text-white transition-transform" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-80 bg-[#10121a]/95 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-2 py-1.5 mb-1.5 border-b border-white/[0.06] flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#ffd875] flex items-center gap-1.5">
                      <Sparkles size={12} />
                      Khám phá theo thể loại
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 max-h-72 overflow-y-auto custom-scrollbar">
                    {GENRES.map((g) => (
                      <Link
                        key={g.slug}
                        href={`/the-loai/${g.slug}`}
                        className={`px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                          pathname === `/the-loai/${g.slug}`
                            ? "bg-[#ffd875] text-black font-bold"
                            : "text-white/70 hover:bg-white/[0.08] hover:text-[#ffd875]"
                        }`}
                      >
                        {g.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quốc Gia Mega Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[13px] font-medium text-white/70 group-hover:text-white group-hover:bg-white/[0.05] transition-all">
                  <span>Quốc Gia</span>
                  <ChevronDown size={13} className="text-white/40 group-hover:rotate-180 group-hover:text-white transition-transform" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-[#10121a]/95 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl p-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-2 py-1.5 mb-1 border-b border-white/[0.06]">
                    <span className="text-[11px] font-semibold text-[#ffd875] flex items-center gap-1.5">
                      <Globe size={12} />
                      Khu vực sản xuất
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {COUNTRIES.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/quoc-gia/${c.slug}`}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                          pathname === `/quoc-gia/${c.slug}`
                            ? "bg-[#ffd875] text-black font-bold"
                            : "text-white/70 hover:bg-white/[0.08] hover:text-[#ffd875]"
                        }`}
                      >
                        <span className="text-sm">{c.flag}</span>
                        <span>{c.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </nav>
          </div>

          {/* Right: Search Bar & Member Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Search Container */}
            <div ref={searchContainerRef} className="relative w-[130px] sm:w-[220px] md:w-[260px]">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative group">
                  <input
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowLiveSearch(true);
                    }}
                    onFocus={() => setShowLiveSearch(true)}
                    className="w-full bg-white/[0.06] hover:bg-white/[0.09] focus:bg-white/[0.1] border border-white/[0.08] focus:border-[#ffd875]/60 text-white text-xs sm:text-[13px] rounded-full py-1.5 sm:py-2 pl-3 sm:pl-4 pr-11 outline-none shadow-sm transition-all placeholder:text-white/35"
                    placeholder="Tìm kiếm phim..."
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                    {isSearching ? (
                      <Loader2 size={13} className="animate-spin text-[#ffd875]" />
                    ) : searchQuery ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="p-1 text-white/40 hover:text-white transition-colors"
                      >
                        <X size={12} />
                      </button>
                    ) : null}
                    <button
                      type="submit"
                      aria-label="Tìm kiếm"
                      className="p-1 text-white/40 group-focus-within:text-[#ffd875] hover:text-white transition-colors"
                    >
                      <Search size={14} />
                    </button>
                  </div>
                </div>
              </form>

              {/* Live Search Modal Dropdown */}
              {showLiveSearch && searchQuery.trim().length >= 2 && (
                <div className="absolute top-full right-0 mt-2.5 w-[min(92vw,360px)] bg-[#10121a]/98 border border-white/10 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3 border-b border-white/[0.06] flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#ffd875] flex items-center gap-1.5">
                      <Film size={12} />
                      Kết quả gợi ý
                    </span>
                    {isSearching && (
                      <span className="text-[10px] text-white/30 animate-pulse">Đang tìm...</span>
                    )}
                  </div>

                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1.5 space-y-1">
                    {searchResults.length > 0 ? (
                      searchResults.map((item) => (
                        <Link
                          key={item._id}
                          href={`/phim/${item.slug}`}
                          onClick={() => setShowLiveSearch(false)}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/[0.08] transition-all group"
                        >
                          <div className="relative w-10 h-13 rounded-lg overflow-hidden bg-black/50 shrink-0 border border-white/10">
                            <Image
                              src={item.poster_url}
                              alt={item.name}
                              fill
                              sizes="40px"
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-semibold text-white truncate group-hover:text-[#ffd875] transition-colors">
                              {item.name}
                            </h4>
                            <p className="text-[10px] text-white/40 truncate mt-0.5">
                              {item.origin_name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[9px] font-medium text-[#ffd875] bg-[#ffd875]/10 px-1.5 py-0.5 rounded">
                                {item.year || "2026"}
                              </span>
                              <span className="text-[9px] font-medium text-white/50 bg-white/5 px-1.5 py-0.5 rounded">
                                HD
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : !isSearching ? (
                      <div className="py-6 text-center text-xs text-white/40">
                        Không tìm thấy phim phù hợp
                      </div>
                    ) : null}
                  </div>

                  <Link
                    href={`/tim-kiem?keyword=${encodeURIComponent(searchQuery.trim())}`}
                    onClick={() => setShowLiveSearch(false)}
                    className="block p-2.5 text-center bg-white/[0.03] hover:bg-[#ffd875] text-[11px] font-bold text-white hover:text-black transition-all border-t border-white/[0.06]"
                  >
                    Xem tất cả kết quả &rarr;
                  </Link>
                </div>
              )}
            </div>

            {/* Member Profile Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex h-8 sm:h-9 items-center gap-1.5 sm:gap-2 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 px-2.5 sm:px-3 text-white transition-all shadow-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-[#ffd875] text-black font-black text-[10px] flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[90px] truncate text-xs font-semibold text-white/90">
                    {user.name}
                  </span>
                  <ChevronDown size={12} className="text-white/40" />
                </button>
                <div
                  className={`absolute right-0 top-full mt-2.5 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#10121a]/98 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all z-50 ${
                    isUserMenuOpen
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-2 pointer-events-none opacity-0"
                  }`}
                >
                  <div className="border-b border-white/[0.06] p-3">
                    <p className="truncate text-xs font-bold text-white">{user.name}</p>
                    <p className="truncate text-[10px] text-white/40 mt-0.5">{user.email}</p>
                  </div>
                  <div className="p-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        openLibrary("favorites");
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs text-white/70 hover:bg-white/[0.08] hover:text-[#ffd875] transition-colors"
                    >
                      <Bookmark size={13} className="text-[#ffd875]" />
                      Tủ phim của tôi
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        openLibrary("history");
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs text-white/70 hover:bg-white/[0.08] hover:text-[#ffd875] transition-colors"
                    >
                      <Clock3 size={13} className="text-[#ffd875]" />
                      Lịch sử xem phim
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        void logout();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={13} />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => openAuth("login")}
                className="flex h-8 sm:h-9 items-center gap-1.5 rounded-full bg-[#ffd875] hover:bg-[#ffe28d] px-3 sm:px-4 text-black text-xs font-bold transition-all shadow-[0_2px_10px_rgba(255,216,117,0.3)]"
              >
                <UserCircle size={15} />
                <span>Đăng Nhập</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Modern Slide-Over Mobile Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Body */}
          <div className="fixed inset-y-0 left-0 w-[min(82vw,320px)] bg-[#0c0e14] border-r border-white/10 shadow-2xl flex flex-col z-[101] animate-in slide-in-from-left duration-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
              <Link href="/" onClick={() => setIsMobileDrawerOpen(false)}>
                <Image
                  alt="RoPhim Logo"
                  width={95}
                  height={28}
                  src="/images/logo.svg"
                  className="h-6 w-auto"
                />
              </Link>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="h-8 w-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* User Info Bar */}
            <div className="p-3.5 border-b border-white/[0.06] bg-white/[0.02]">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-white/40 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      void logout();
                    }}
                    className="text-[10px] text-red-400 px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 font-medium"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    openAuth("login");
                  }}
                  className="w-full h-9 rounded-xl bg-[#ffd875] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <UserCircle size={15} />
                  Đăng nhập / Đăng ký
                </button>
              )}
            </div>

            {/* Navigation Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
              {/* Primary Links */}
              <div className="space-y-0.5">
                <Link
                  href="/"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    pathname === "/" ? "bg-[#ffd875] text-black font-bold" : "text-white/80 hover:bg-white/[0.06]"
                  }`}
                >
                  <Flame size={14} className={pathname === "/" ? "text-black" : "text-[#ffd875]"} />
                  Trang Chủ
                </Link>
                <Link
                  href="/danh-sach/phim-bo"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    pathname === "/danh-sach/phim-bo" ? "bg-[#ffd875] text-black font-bold" : "text-white/80 hover:bg-white/[0.06]"
                  }`}
                >
                  <Tv size={14} className={pathname === "/danh-sach/phim-bo" ? "text-black" : "text-[#ffd875]"} />
                  Phim Bộ
                </Link>
                <Link
                  href="/danh-sach/phim-le"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    pathname === "/danh-sach/phim-le" ? "bg-[#ffd875] text-black font-bold" : "text-white/80 hover:bg-white/[0.06]"
                  }`}
                >
                  <Clapperboard size={14} className={pathname === "/danh-sach/phim-le" ? "text-black" : "text-[#ffd875]"} />
                  Phim Lẻ
                </Link>
                <Link
                  href="/danh-sach/hoat-hinh"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    pathname === "/danh-sach/hoat-hinh" ? "bg-[#ffd875] text-black font-bold" : "text-white/80 hover:bg-white/[0.06]"
                  }`}
                >
                  <Sparkles size={14} className={pathname === "/danh-sach/hoat-hinh" ? "text-black" : "text-[#ffd875]"} />
                  Hoạt Hình
                </Link>
                <Link
                  href="/danh-sach/phim-moi"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    pathname === "/danh-sach/phim-moi" ? "bg-[#ffd875] text-black font-bold" : "text-white/80 hover:bg-white/[0.06]"
                  }`}
                >
                  <TrendingUp size={14} className={pathname === "/danh-sach/phim-moi" ? "text-black" : "text-[#ffd875]"} />
                  Phim Mới Cập Nhật
                </Link>
              </div>

              {/* Collapsible Thể Loại */}
              <div className="border-t border-white/[0.06] pt-3">
                <button
                  onClick={() => setIsMobileGenreOpen(!isMobileGenreOpen)}
                  className="w-full flex items-center justify-between px-2 py-1 text-xs font-bold text-white/50 uppercase tracking-wider"
                >
                  <span>Thể Loại</span>
                  <ChevronDown size={13} className={`transition-transform ${isMobileGenreOpen ? "rotate-180" : ""}`} />
                </button>
                {isMobileGenreOpen && (
                  <div className="grid grid-cols-2 gap-1.5 mt-2">
                    {GENRES.map((g) => (
                      <Link
                        key={g.slug}
                        href={`/the-loai/${g.slug}`}
                        onClick={() => setIsMobileDrawerOpen(false)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs truncate transition-all ${
                          pathname === `/the-loai/${g.slug}`
                            ? "bg-[#ffd875] text-black font-bold"
                            : "bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-[#ffd875]"
                        }`}
                      >
                        {g.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Collapsible Quốc Gia */}
              <div className="border-t border-white/[0.06] pt-3">
                <button
                  onClick={() => setIsMobileCountryOpen(!isMobileCountryOpen)}
                  className="w-full flex items-center justify-between px-2 py-1 text-xs font-bold text-white/50 uppercase tracking-wider"
                >
                  <span>Quốc Gia</span>
                  <ChevronDown size={13} className={`transition-transform ${isMobileCountryOpen ? "rotate-180" : ""}`} />
                </button>
                {isMobileCountryOpen && (
                  <div className="grid grid-cols-2 gap-1.5 mt-2">
                    {COUNTRIES.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/quoc-gia/${c.slug}`}
                        onClick={() => setIsMobileDrawerOpen(false)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs truncate transition-all ${
                          pathname === `/quoc-gia/${c.slug}`
                            ? "bg-[#ffd875] text-black font-bold"
                            : "bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-[#ffd875]"
                        }`}
                      >
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/[0.06] text-center text-[10px] text-white/30">
              RoPhim © 2026 — Trải nghiệm phim đỉnh cao
            </div>
          </div>
        </div>
      )}
    </>
  );
};
