import { NextResponse } from "next/server"
import { login } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Login user
    const result = await login(email, password)
    if (!result) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Set session cookie
    cookies().set({
      name: "session",
      value: result.sessionId,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Return user without password
    const { password: _, ...userWithoutPassword } = result.user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}

