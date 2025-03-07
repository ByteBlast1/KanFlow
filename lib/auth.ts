// This is a mock authentication implementation
// In a real application, you would use a proper authentication system like NextAuth.js

import { db, type User } from "./db"

// Session storage (in-memory for demo purposes)
const sessions: Record<string, { userId: string; expires: Date }> = {}

export async function register(name: string, email: string, password: string): Promise<User | null> {
  // Check if user already exists
  const existingUser = await db.getUserByEmail(email)
  if (existingUser) {
    return null
  }

  // Create new user
  return db.createUser(name, email, password)
}

export async function login(email: string, password: string): Promise<{ sessionId: string; user: User } | null> {
  // Find user by email
  const user = await db.getUserByEmail(email)
  if (!user) {
    return null
  }

  // Check password (in a real app, you would hash and compare)
  if (user.password !== password) {
    return null
  }

  // Create session
  const sessionId = Math.random().toString(36).substring(2, 15)
  const expires = new Date()
  expires.setDate(expires.getDate() + 7) // 7 days from now

  sessions[sessionId] = {
    userId: user.id,
    expires,
  }

  return { sessionId, user }
}

export async function logout(sessionId: string): Promise<boolean> {
  if (sessions[sessionId]) {
    delete sessions[sessionId]
    return true
  }
  return false
}

export async function getSession(sessionId: string): Promise<User | null> {
  const session = sessions[sessionId]
  if (!session) {
    return null
  }

  // Check if session is expired
  if (new Date() > session.expires) {
    delete sessions[sessionId]
    return null
  }

  // Get user from session
  return db.getUserById(session.userId)
}

