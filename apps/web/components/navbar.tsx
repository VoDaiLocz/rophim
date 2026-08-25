"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Clock3,
  Heart,
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
];

const COUNTRIES = [
  { name: "Hàn Quốc", slug: "han-quoc", flag: "🇰🇷" },
  { name: "Trung Quốc", slug: "trung-quoc", flag: "🇨🇳" },
  { name: "Âu Mỹ", slug: "au-my", flag: "🇺🇸" },
  { name: "Nhật Bản", slug: "nhat-ban", flag: "🇯🇵" },
  { name: "Thái Lan", slug: "thai-lan", flag: "🇹🇭" },
  { name: "Việt Nam", slug: "viet-nam", flag: "🇻🇳" },
];

export const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ListMovie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showLiveSearch, setShowLiveSearch] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"genres" | "countries">("genres");
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
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

  // Close mobile drawer on route change
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

  // Click outside listener
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
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          lastScrollY > 50
            ? "bg-[#0b0d14]/95 backdrop-blur-2xl py-2.5 md:py-3 border-b border-white/10 shadow-2xl"
            : "bg-transparent py-3 md:py-4 bg-gradient-to-b from-black/90 via-black/40 to-transparent"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-3 sm:gap-6">
          {/* Left: Mobile Toggle & Logo & Desktop Navigation */}
          <div className="flex items-center gap-4 lg:gap-8">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              aria-label="Mở menu điều hướng"
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Menu size={19} />
            </button>

            {/* Brand Logo */}
            <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
              <Image
                alt="RoPhim Logo"
                width={105}
                height={38}
                src="/images/logo.svg"
                className="h-6 sm:h-7 md:h-8 w-auto drop-shadow-md"
                priority
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold uppercase tracking-tight transition-all ${
                  pathname === "/"
                    ? "text-[#ffd875] bg-white/10"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                Trang Chủ
              </Link>

              <Link
                href="/danh-sach/phim-bo"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold uppercase tracking-tight transition-all ${
                  pathname === "/danh-sach/phim-bo"
                    ? "text-[#ffd875] bg-white/10"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Tv size={14} className="text-[#ffd875]" />
                Phim Bộ
              </Link>

              <Link
                href="/danh-sach/phim-le"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold uppercase tracking-tight transition-all ${
                  pathname === "/danh-sach/phim-le"
                    ? "text-[#ffd875] bg-white/10"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Clapperboard size={14} className="text-[#ffd875]" />
                Phim Lẻ
              </Link>

              <Link
                href="/danh-sach/hoat-hinh"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold uppercase tracking-tight transition-all ${
                  pathname === "/danh-sach/hoat-hinh"
                    ? "text-[#ffd875] bg-white/10"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Flame size={14} className="text-[#ffd875]" />
                Hoạt Hình
              </Link>

              {/* Genres Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold uppercase tracking-tight text-white/70 group-hover:text-white group-hover:bg-white/5 transition-all">
                  <span>Thể Loại</span>
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform text-white/40" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-80 bg-[#11131d]/98 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2 border-b border-white/5 mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#ffd875] flex items-center gap-1.5">
                      <Sparkles size={12} />
                      Tất cả thể loại
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 max-h-72 overflow-y-auto custom-scrollbar">
                    {GENRES.map((g) => (
                      <Link
                        key={g.slug}
                        href={`/the-loai/${g.slug}`}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-tight transition-all ${
                          pathname === `/the-loai/${g.slug}`
                            ? "bg-[#ffd875] text-black font-black"
                            : "text-white/70 hover:bg-white/10 hover:text-[#ffd875]"
                        }`}
                      >
                        {g.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Countries Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold uppercase tracking-tight text-white/70 group-hover:text-white group-hover:bg-white/5 transition-all">
                  <span>Quốc Gia</span>
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform text-white/40" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-52 bg-[#11131d]/98 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 space-y-1">
                  <div className="p-2 border-b border-white/5 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#ffd875] flex items-center gap-1.5">
                      <Globe size={12} />
                      Khu vực
                    </span>
                  </div>
                  {COUNTRIES.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/quoc-gia/${c.slug}`}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-tight transition-all ${
                        pathname === `/quoc-gia/${c.slug}`
                          ? "bg-[#ffd875] text-black font-black"
                          : "text-white/70 hover:bg-white/10 hover:text-[#ffd875]"
                      }`}
                    >
                      <span>{c.flag}</span>
                      <span>{c.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>

          {/* Right: Search Bar & Member Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Live Search Container */}
            <div ref={searchContainerRef} className="relative w-[140px] sm:w-[220px] md:w-[280px]">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative group">
                  <input
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowLiveSearch(true);
                    }}
                    onFocus={() => setShowLiveSearch(true)}
                    className="w-full bg-white/5 border border-white/10 text-white text-xs sm:text-sm rounded-full py-1.5 sm:py-2 pl-3 sm:pl-4 pr-12 focus:bg-white/10 focus:border-[#ffd875]/60 outline-none shadow-2xl transition-all placeholder:text-white/35"
                    placeholder="Tìm kiếm phim..."
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                    {isSearching ? (
                      <Loader2 size={14} className="animate-spin text-[#ffd875]" />
                    ) : searchQuery ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="p-1 text-white/40 hover:text-white"
                      >
                        <X size={13} />
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
                <div className="absolute top-full right-0 mt-3 w-[min(90vw,360px)] bg-[#11131d]/98 border border-white/10 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#ffd875] flex items-center gap-1.5">
                      <Film size={12} />
                      Gợi ý nhanh
                    </span>
                    {isSearching && (
                      <span className="text-[10px] text-white/30 animate-pulse">Đang tìm...</span>
                    )}
                  </div>

                  <div className="max-h-[320px] overflow-y-auto custom-scrollbar p-2 space-y-1.5">
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
                                HD
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : !isSearching ? (
                      <div className="py-6 text-center text-xs text-white/40">
                        Không tìm thấy phim &quot;{searchQuery}&quot;
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

            {/* Member Profile Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex h-9 items-center gap-2 rounded-full bg-[#ffd875] px-3 sm:px-4 text-black transition-all hover:bg-white shadow-md"
                >
                  <UserCircle size={17} />
                  <span className="hidden sm:inline max-w-[100px] truncate text-xs font-black uppercase tracking-tight">
                    {user.name}
                  </span>
                </button>
                <div
                  className={`absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#11131d]/98 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all z-50 ${
                    isUserMenuOpen
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-2 pointer-events-none opacity-0"
                  }`}
                >
                  <div className="border-b border-white/10 p-3.5">
                    <p className="truncate text-xs font-black text-white">{user.name}</p>
                    <p className="truncate text-[10px] text-white/40">{user.email}</p>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        openLibrary("favorites");
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-white/70 hover:bg-white/10 hover:text-[#ffd875] transition-colors"
                    >
                      <Heart size={14} className="text-[#ffd875]" />
                      Tủ phim
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        openLibrary("history");
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-white/70 hover:bg-white/10 hover:text-[#ffd875] transition-colors"
                    >
                      <Clock3 size={14} className="text-[#ffd875]" />
                      Lịch sử xem
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        void logout();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={14} />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => openAuth("login")}
                className="flex h-9 items-center gap-2 rounded-full bg-[#ffd875] px-3.5 sm:px-4 text-black transition-all hover:bg-white shadow-md"
              >
                <UserCircle size={17} />
                <span className="text-xs font-black uppercase tracking-tight">
                  Thành viên
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Modern Mobile Slide-Over Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden animate-in fade-in duration-300">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          />

          {/* Drawer Menu */}
          <div className="fixed inset-y-0 left-0 w-[min(85vw,340px)] bg-[#0b0d14] border-r border-white/10 shadow-2xl flex flex-col z-[101] animate-in slide-in-from-left duration-300 overflow-hidden">
            {/* Drawer Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <Link href="/" onClick={() => setIsMobileDrawerOpen(false)}>
                <Image
                  alt="RoPhim Logo"
                  width={100}
                  height={32}
                  src="/images/logo.svg"
                  className="h-7 w-auto"
                />
              </Link>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={17} />
              </button>
            </div>

            {/* User Quick Info in Drawer */}
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-white/40 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      void logout();
                    }}
                    className="text-[10px] text-red-400 font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-red-500/10"
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
                  className="w-full h-10 rounded-xl bg-[#ffd875] text-black font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2"
                >
                  <UserCircle size={16} />
                  Đăng nhập / Đăng ký
                </button>
              )}
            </div>

            {/* Scrollable Navigation Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
              {/* Main Categories */}
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 px-3 mb-2">
                  Khám phá
                </p>
                <Link
                  href="/"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase text-white/80 hover:bg-white/5 hover:text-[#ffd875] transition-colors"
                >
                  <Flame size={15} className="text-[#ffd875]" />
                  Trang Chủ
                </Link>
                <Link
                  href="/danh-sach/phim-bo"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase text-white/80 hover:bg-white/5 hover:text-[#ffd875] transition-colors"
                >
                  <Tv size={15} className="text-[#ffd875]" />
                  Phim Bộ
                </Link>
                <Link
                  href="/danh-sach/phim-le"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase text-white/80 hover:bg-white/5 hover:text-[#ffd875] transition-colors"
                >
                  <Clapperboard size={15} className="text-[#ffd875]" />
                  Phim Lẻ
                </Link>
                <Link
                  href="/danh-sach/hoat-hinh"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase text-white/80 hover:bg-white/5 hover:text-[#ffd875] transition-colors"
                >
                  <Sparkles size={15} className="text-[#ffd875]" />
                  Hoạt Hình
                </Link>
              </div>

              {/* Tab Selector: Thể loại / Quốc gia */}
              <div>
                <div className="flex rounded-xl bg-white/5 p-1 mb-3">
                  <button
                    onClick={() => setActiveMobileTab("genres")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                      activeMobileTab === "genres"
                        ? "bg-[#ffd875] text-black shadow"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    Thể Loại
                  </button>
                  <button
                    onClick={() => setActiveMobileTab("countries")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                      activeMobileTab === "countries"
                        ? "bg-[#ffd875] text-black shadow"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    Quốc Gia
                  </button>
                </div>

                {activeMobileTab === "genres" ? (
                  <div className="grid grid-cols-2 gap-1.5">
                    {GENRES.map((g) => (
                      <Link
                        key={g.slug}
                        href={`/the-loai/${g.slug}`}
                        onClick={() => setIsMobileDrawerOpen(false)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold uppercase text-white/70 bg-white/[0.03] hover:bg-[#ffd875] hover:text-black transition-all text-center truncate"
                      >
                        {g.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-1.5">
                    {COUNTRIES.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/quoc-gia/${c.slug}`}
                        onClick={() => setIsMobileDrawerOpen(false)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold uppercase text-white/70 bg-white/[0.03] hover:bg-[#ffd875] hover:text-black transition-all truncate"
                      >
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-white/10 bg-white/[0.01] text-center text-[10px] text-white/30 font-bold uppercase tracking-wider">
              RoPhim © 2026 - Xem phim HD Miễn Phí
            </div>
          </div>
        </div>
      )}
    </>
  );
};
