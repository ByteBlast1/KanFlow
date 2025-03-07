import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Particles } from "@/components/particles"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KanFlow - Kanban Board Application",
  description: "A modern Kanban board application for efficient task management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative min-h-screen">
            <Particles className="absolute inset-0 -z-10" />
            {children}
            <div className="fixed bottom-4 right-4 z-50">
              <ThemeToggle />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'