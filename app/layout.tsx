import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JLPT 日本語挑戦｜N5～N1 分級測驗",
  description: "可選 N5、N4、N3、N2、N1 的日文能力測驗，含單字漢字、文法、閱讀與繁體中文解析。",
  other: { "codex-preview": "development" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
