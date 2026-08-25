"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Filter, Layers, Globe, Sparkles } from "lucide-react";

export const FilterBar = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-30 bg-[#11131d]/90 backdrop-blur-xl rounded-2xl p-3 sm:p-4 mb-8 flex flex-wrap gap-2.5 sm:gap-4 items-center border border-white/10 shadow-xl"
    >
      <div className="flex items-center gap-2 text-[#ffd875] font-black uppercase text-xs sm:text-sm tracking-wider mr-2">
        <Filter className="w-4 h-4 text-[#ffd875]" />
        Bộ Lọc
      </div>

      {/* Định Dạng */}
      <div className="relative">
        <button
          type="button"
          onClick={() => toggleDropdown("type")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all text-xs sm:text-sm w-32 sm:w-36 justify-between border ${
            openDropdown === "type"
              ? "bg-white/15 border-[#ffd875]/60 text-white"
              : "bg-white/5 hover:bg-white/10 text-white/80 border-white/5"
          }`}
        >
          <span className="flex items-center gap-1.5 truncate">
            <Layers size={13} className="text-[#ffd875]" />
            Định dạng
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-white/40 transition-transform ${
              openDropdown === "type" ? "rotate-180 text-[#ffd875]" : ""
            }`}
          />
        </button>
        {openDropdown === "type" && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-[#10121a]/98 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-2xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
            <Link
              href="/danh-sach/phim-le"
              onClick={() => setOpenDropdown(null)}
              className="block px-3 py-2 text-xs font-bold text-white/70 hover:text-black hover:bg-[#ffd875] rounded-xl transition-all uppercase"
            >
              🎬 Phim Lẻ
            </Link>
            <Link
              href="/danh-sach/phim-bo"
              onClick={() => setOpenDropdown(null)}
              className="block px-3 py-2 text-xs font-bold text-white/70 hover:text-black hover:bg-[#ffd875] rounded-xl transition-all uppercase"
            >
              📺 Phim Bộ
            </Link>
            <Link
              href="/danh-sach/hoat-hinh"
              onClick={() => setOpenDropdown(null)}
              className="block px-3 py-2 text-xs font-bold text-white/70 hover:text-black hover:bg-[#ffd875] rounded-xl transition-all uppercase"
            >
              🎨 Hoạt Hình
            </Link>
            <Link
              href="/danh-sach/phim-moi"
              onClick={() => setOpenDropdown(null)}
              className="block px-3 py-2 text-xs font-bold text-white/70 hover:text-black hover:bg-[#ffd875] rounded-xl transition-all uppercase"
            >
              ✨ Phim Mới Cập Nhật
            </Link>
          </div>
        )}
      </div>

      {/* Thể Loại */}
      <div className="relative">
        <button
          type="button"
          onClick={() => toggleDropdown("genre")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all text-xs sm:text-sm w-32 sm:w-36 justify-between border ${
            openDropdown === "genre"
              ? "bg-white/15 border-[#ffd875]/60 text-white"
              : "bg-white/5 hover:bg-white/10 text-white/80 border-white/5"
          }`}
        >
          <span className="flex items-center gap-1.5 truncate">
            <Sparkles size={13} className="text-[#ffd875]" />
            Thể loại
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-white/40 transition-transform ${
              openDropdown === "genre" ? "rotate-180 text-[#ffd875]" : ""
            }`}
          />
        </button>
        {openDropdown === "genre" && (
          <div className="absolute top-full left-0 mt-2 w-72 bg-[#10121a]/98 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-2xl z-50 p-3 grid grid-cols-2 gap-1.5 text-xs font-bold animate-in fade-in zoom-in-95 duration-150 max-h-80 overflow-y-auto custom-scrollbar">
            <Link
              href="/the-loai/hanh-dong"
              onClick={() => setOpenDropdown(null)}
              className="p-2 hover:bg-[#ffd875] hover:text-black rounded-xl text-white/70 transition-colors uppercase truncate"
            >
              Hành Động
            </Link>
            <Link
              href="/the-loai/tinh-cam"
              onClick={() => setOpenDropdown(null)}
              className="p-2 hover:bg-[#ffd875] hover:text-black rounded-xl text-white/70 transition-colors uppercase truncate"
            >
              Tình Cảm
            </Link>
            <Link
              href="/the-loai/hai-huoc"
              onClick={() => setOpenDropdown(null)}
              className="p-2 hover:bg-[#ffd875] hover:text-black rounded-xl text-white/70 transition-colors uppercase truncate"
            >
              Hài Hước
            </Link>
            <Link
              href="/the-loai/co-trang"
              onClick={() => setOpenDropdown(null)}
              className="p-2 hover:bg-[#ffd875] hover:text-black rounded-xl text-white/70 transition-colors uppercase truncate"
            >
              Cổ Trang
            </Link>
            <Link
              href="/the-loai/kinh-di"
              onClick={() => setOpenDropdown(null)}
              className="p-2 hover:bg-[#ffd875] hover:text-black rounded-xl text-white/70 transition-colors uppercase truncate"
            >
              Kinh Dị
            </Link>
            <Link
              href="/the-loai/vo-thuat"
              onClick={() => setOpenDropdown(null)}
              className="p-2 hover:bg-[#ffd875] hover:text-black rounded-xl text-white/70 transition-colors uppercase truncate"
            >
              Võ Thuật
            </Link>
            <Link
              href="/the-loai/hinh-su"
              onClick={() => setOpenDropdown(null)}
              className="p-2 hover:bg-[#ffd875] hover:text-black rounded-xl text-white/70 transition-colors uppercase truncate"
            >
              Hình Sự
            </Link>
            <Link
              href="/the-loai/vien-tuong"
              onClick={() => setOpenDropdown(null)}
              className="p-2 hover:bg-[#ffd875] hover:text-black rounded-xl text-white/70 transition-colors uppercase truncate"
            >
              Viễn Tưởng
            </Link>
            <Link
              href="/the-loai/tam-ly"
              onClick={() => setOpenDropdown(null)}
              className="p-2 hover:bg-[#ffd875] hover:text-black rounded-xl text-white/70 transition-colors uppercase truncate"
            >
              Tâm Lý
            </Link>
            <Link
              href="/the-loai/hoc-duong"
              onClick={() => setOpenDropdown(null)}
              className="p-2 hover:bg-[#ffd875] hover:text-black rounded-xl text-white/70 transition-colors uppercase truncate"
            >
              Học Đường
            </Link>
          </div>
        )}
      </div>

      {/* Quốc Gia */}
      <div className="relative">
        <button
          type="button"
          onClick={() => toggleDropdown("country")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all text-xs sm:text-sm w-32 sm:w-36 justify-between border ${
            openDropdown === "country"
              ? "bg-white/15 border-[#ffd875]/60 text-white"
              : "bg-white/5 hover:bg-white/10 text-white/80 border-white/5"
          }`}
        >
          <span className="flex items-center gap-1.5 truncate">
            <Globe size={13} className="text-[#ffd875]" />
            Quốc gia
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-white/40 transition-transform ${
              openDropdown === "country" ? "rotate-180 text-[#ffd875]" : ""
            }`}
          />
        </button>
        {openDropdown === "country" && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-[#10121a]/98 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-2xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
            <Link
              href="/quoc-gia/han-quoc"
              onClick={() => setOpenDropdown(null)}
              className="block px-3 py-2 text-xs font-bold text-white/70 hover:text-black hover:bg-[#ffd875] rounded-xl transition-all uppercase"
            >
              🇰🇷 Hàn Quốc
            </Link>
            <Link
              href="/quoc-gia/trung-quoc"
              onClick={() => setOpenDropdown(null)}
              className="block px-3 py-2 text-xs font-bold text-white/70 hover:text-black hover:bg-[#ffd875] rounded-xl transition-all uppercase"
            >
              🇨🇳 Trung Quốc
            </Link>
            <Link
              href="/quoc-gia/au-my"
              onClick={() => setOpenDropdown(null)}
              className="block px-3 py-2 text-xs font-bold text-white/70 hover:text-black hover:bg-[#ffd875] rounded-xl transition-all uppercase"
            >
              🇺🇸 Âu Mỹ
            </Link>
            <Link
              href="/quoc-gia/nhat-ban"
              onClick={() => setOpenDropdown(null)}
              className="block px-3 py-2 text-xs font-bold text-white/70 hover:text-black hover:bg-[#ffd875] rounded-xl transition-all uppercase"
            >
              🇯🇵 Nhật Bản
            </Link>
            <Link
              href="/quoc-gia/thai-lan"
              onClick={() => setOpenDropdown(null)}
              className="block px-3 py-2 text-xs font-bold text-white/70 hover:text-black hover:bg-[#ffd875] rounded-xl transition-all uppercase"
            >
              🇹🇭 Thái Lan
            </Link>
            <Link
              href="/quoc-gia/viet-nam"
              onClick={() => setOpenDropdown(null)}
              className="block px-3 py-2 text-xs font-bold text-white/70 hover:text-black hover:bg-[#ffd875] rounded-xl transition-all uppercase"
            >
              🇻🇳 Việt Nam
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
