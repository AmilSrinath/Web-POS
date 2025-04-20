import type React from "react"
import { Sidebar } from "@/components/sidebar"

export default function POSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </div>
  )
}
