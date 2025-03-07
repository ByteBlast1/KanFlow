import { NextResponse } from "next/server"
import { logout } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const sessionId = cookies().get("session")?.value

    if (sessionId) {
      await logout(sessionId)
    }

    // Clear session cookie
    cookies().delete("session")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "An error occurred during logout" }, { status: 500 })
  }
}

