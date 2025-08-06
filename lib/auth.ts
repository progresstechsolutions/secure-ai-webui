import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { compare } from "bcryptjs"
import { z } from "zod"

// User schema for validation
const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3).max(20),
})

// Mock user database (replace with real database later)
const users = [
  {
    id: "1",
    email: "demo@caregene.com",
    username: "demo_user",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password"
    name: "Demo User",
    image: null,
    healthConditions: ["diabetes", "hypertension"],
    location: {
      region: "United States",
      state: "California"
    }
  },
  {
    id: "2",
    email: "test1@gmail.com",
    username: "test1",
    password: "$2b$10$LWrzqYrIb2i.RzslH8F0jubniNZSh/I8WhI4ZbM1FffXTzi3UsYTW", // "test1"
    name: "Test User",
    image: null,
    healthConditions: ["anxiety", "chronic pain"],
    location: {
      region: "United States",
      state: "New York"
    }
  }
]

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials as { email: string; password: string }
          
          // Find user in mock database
          const user = users.find(u => u.email === email)
          if (!user) return null

          // Verify password
          const isValid = await compare(password, user.password)
          if (!isValid) return null

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
            image: user.image,
            healthConditions: user.healthConditions,
            location: user.location
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.username = user.username
        token.healthConditions = user.healthConditions
        token.location = user.location
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.username = token.username as string
        session.user.healthConditions = token.healthConditions as string[]
        session.user.location = token.location as any
      }
      return session
    }
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
})
