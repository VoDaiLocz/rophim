"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Filter, Layers, Globe, Calendar, Sparkles } from "lucide-react";

export const FilterBar = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <div className="bg-[#11131d]/90 backdrop-blur-xl rounded-2xl p-3 sm:p-4 mb-8 flex flex-wrap gap-2.5 sm:gap-4 items-center border border-white/10 shadow-xl">
      <div className="flex items-center gap-2 text-[#ffd875] font-black uppercase text-xs sm:text-sm tracking-wider mr-2">
        <Filter className="w-4 h-4 text-[#ffd875]" />
        Bộ Lọc
      </div>

      {/* Type */}
      <div className="relative group">
        <button
          onClick={() => toggleDropdown("type")}
          className="flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-xs sm:text-sm text-white/80 w-32 sm:w-36 justify-between border border-white/5"
        >
          <span className="flex items-center gap-1.5 truncate">
            <Layers size={13} className="text-[#ffd875]" />
            Định dạng
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-white/40" />
        </button>
        <div className="absolute top-full left-0 mt-2 w-48 bg-[#11131d] border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30 p-2 space-y-1">
          <Link href="/danh-sach/phim-le" className="block px-3 py-2 text-xs font-bold text-white/70 hover:text-black hover:bg-[#ffd875] rounded-xl transition-all uppercase">
            🎬 Phim Lẻ
          </Link>
          <Link href="/danh-sach/phim-bo" className="block px-3 py-2 text-xs font-bold text-white/70 hover:text-black hover:bg-[#ffd875] rounded-xl transition-all uppercase">
            📺 Phim Bộ
          </Link>
          <Link href="/danh-sach/hoat-hinh" className="block px-3 py-2 text-xs font-bold text-white/70 hover:text-black hover:bg-[#ffd875] rounded-xl transition-all uppercase">
            🎨 Hoạt Hình
          </Link>
          <Link href="/danh-sach/phim-moi" className="block px-3 py-2 text-xs font-bold text-white/70 hover:text-black hover:bg-[#ffd875] rounded-xl transition-all uppercase">
            ✨ Phim Mới Cập Nhật
          </Link>
        </div>
      </div>

      {/* Genre */}
      <div className="relative group">
        <button
          onClick={() => toggleDropdown("genre")}
          className="flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-xs sm:text-sm text-white/80 w-32 sm:w-36 justify-between border border-white/5"
        >
          <span className="flex items-center gap-1.5 truncate">
            <Sparkles size={13} className="text-[#ffd875]" />
            Thể loại
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-white/40" />
        </button>
        <div className="absolute top-full left-0 mt-2 w-64 bg-[#11131d] border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30 p-3 grid grid-cols-2 gap-2 text-xs font-bold">
          <Link href="/the-loai/hanh-dong" className="p-2 hover:bg-white/10 hover:text-[#ffd875] rounded-xl text-white/70 transition-colors uppercase">
            Hành Động
          </Link>
          <Link href="/the-loai/tinh-cam" className="p-2 hover:bg-white/10 hover:text-[#ffd875] rounded-xl text-white/70 transition-colors uppercase">
            Tình Cảm
          </Link>
          <Link href="/the-loai/hai-huoc" className="p-2 hover:bg-white/10 hover:text-[#ffd875] rounded-xl text-white/70 transition-colors uppercase">
            Hài Hước
          </Link>
          <Link href="/the-loai/co-trang" className="p-2 hover:bg-white/10 hover:text-[#ffd875] rounded-xl text-white/70 transition-colors uppercase">
            Cổ Trang
          </Link>
          <Link href="/the-loai/kinh-di" className="p-2 hover:bg-white/10 hover:text-[#ffd875] rounded-xl text-white/70 transition-colors uppercase">
            Kinh Dị
          </Link>
          <Link href="/the-loai/vo-thuat" className="p-2 hover:bg-white/10 hover:text-[#ffd875] rounded-xl text-white/70 transition-colors uppercase">
            Võ Thuật
          </Link>
          <Link href="/the-loai/hinh-su" className="p-2 hover:bg-white/10 hover:text-[#ffd875] rounded-xl text-white/70 transition-colors uppercase">
            Hình Sự
          </Link>
          <Link href="/the-loai/vien-tuong" className="p-2 hover:bg-white/10 hover:text-[#ffd875] rounded-xl text-white/70 transition-colors uppercase">
            Viễn Tưởng
          </Link>
        </div>
      </div>

      {/* Country */}
      <div className="relative group">
        <button
          onClick={() => toggleDropdown("country")}
          className="flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-xs sm:text-sm text-white/80 w-32 sm:w-36 justify-between border border-white/5"
        >
          <span className="flex items-center gap-1.5 truncate">
            <Globe size={13} className="text-[#ffd875]" />
            Quốc gia
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-white/40" />
        </button>
        <div className="absolute top-full left-0 mt-2 w-48 bg-[#11131d] border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30 p-2 space-y-1">
          <Link href="/quoc-gia/han-quoc" className="block px-3 py-2 text-xs font-bold text-white/70 hover:text-black hover:bg-[#ffd875] rounded-xl transition-all uppercase">
            🇰🇷 Hàn Quốc
          </Link>
          <Link href="/quoc-gia/trung-quoc" className="block px-3 py-2 text-xs font-bold text-white/70 hover:text-black hover:bg-[#ffd875] rounded-xl transition-all uppercase">
            🇨🇳 Trung Quốc
          </Link>
          <Link href="/quoc-gia/au-my" className="block px-3 py-2 text-xs font-bold text-white/70 hover:text-black hover:bg-[#ffd875] rounded-xl transition-all uppercase">
            🇺🇸 Âu Mỹ
          </Link>
          <Link href="/quoc-gia/nhat-ban" className="block px-3 py-2 text-xs font-bold text-white/70 hover:text-black hover:bg-[#ffd875] rounded-xl transition-all uppercase">
            🇯🇵 Nhật Bản
          </Link>
          <Link href="/quoc-gia/thai-lan" className="block px-3 py-2 text-xs font-bold text-white/70 hover:text-black hover:bg-[#ffd875] rounded-xl transition-all uppercase">
            🇹🇭 Thái Lan
          </Link>
          <Link href="/quoc-gia/viet-nam" className="block px-3 py-2 text-xs font-bold text-white/70 hover:text-black hover:bg-[#ffd875] rounded-xl transition-all uppercase">
            🇻🇳 Việt Nam
          </Link>
        </div>
      </div>
    </div>
  );
};
