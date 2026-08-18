import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "N4 日本語挑戦",
  description: "JLPT N4 日文能力測驗：單字、漢字、文法與閱讀，即時解析你的強弱項。",
  other: { "codex-preview": "development" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
