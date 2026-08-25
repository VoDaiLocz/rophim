"use client";

import Link from "next/link";
import Image from "next/image";

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/",
    mark: "FB",
  },
  {
    name: "Tiktok",
    url: "https://www.tiktok.com/",
    mark: "TT",
  },
  {
    name: "Youtube",
    url: "https://www.youtube.com/",
    mark: "YT",
  },
  {
    name: "X",
    url: "https://x.com/",
    mark: "X",
  },
  {
    name: "Discord",
    url: "https://discord.gg/",
    mark: "DC",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/",
    mark: "IG",
  },
  {
    name: "Threads",
    url: "https://www.threads.net/",
    mark: "TH",
  },
];

const FOOTER_LINKS = [
  { name: "Hỏi-Đáp", url: "/hoi-dap" },
  { name: "Chính sách bảo mật", url: "/chinh-sach-bao-mat" },
  { name: "Điều khoản sử dụng", url: "/dieu-khoan-su-dung" },
  { name: "Giới thiệu", url: "/gioi-thieu" },
  { name: "Liên hệ", url: "/lien-he" },
];

export const Footer = () => {
  return (
    <footer className="bg-[#0b0d14] text-gray-400 py-12 border-t border-white/10">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        {/* Logo & Slogan */}
        <div className="mb-6 flex flex-col items-center">
          <Link href="/" className="mb-4 block">
            <Image
              src="/images/logo.svg"
              alt="RoPhim Logo"
              width={150}
              height={45}
              className="h-12 w-auto"
            />
          </Link>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
            RoPhim - Trang xem phim online chất lượng cao miễn phí Vietsub,
            thuyết minh, lồng tiếng full HD. Kho phim mới khổng lồ, phim chiếu
            rạp, phim bộ, phim lẻ từ nhiều quốc gia như Việt Nam, Hàn Quốc,
            Trung Quốc, Thái Lan, Nhật Bản, Âu Mỹ… đa dạng thể loại.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#191b24] text-[10px] font-black text-white/55 transition-all hover:border-[#ffd875]/50 hover:bg-[#ffd875] hover:text-black"
            >
              {social.mark}
            </a>
          ))}
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium mb-8">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.url}
              className="hover:text-[#ffd875] transition-colors hover:underline decoration-[#ffd875]/50 underline-offset-4"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-gray-600 text-xs border-t border-white/5 pt-6">
          <p className="mb-4 text-[#ffd875] font-bold text-sm">
            Tự hào là người Việt Nam ❤️
          </p>
          <Link href="/" className="mb-6 block">
            <Image
              src="/images/logo.svg"
              alt="RoPhim Logo"
              width={120}
              height={34}
              className="h-8 w-auto mx-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all"
            />
          </Link>
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
              <span>Hoàng Sa & Trường Sa là của Việt Nam!</span>
              <span className="ml-1" aria-label="Vietnam Flag">
                🇻🇳
              </span>
            </div>
            <p className="mt-2">
              © 2026 <span className="text-rophim-primary">RoPhim</span>. All
              Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
