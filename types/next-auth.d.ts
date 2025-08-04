import { DefaultSession } from "next-auth"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      healthConditions: string[]
      location: {
        region: string
        state?: string
      }
    } & DefaultSession["user"]
  }

  interface User {
    username: string
    healthConditions: string[]
    location: {
      region: string
      state?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username: string
    healthConditions: string[]
    location: {
      region: string
      state?: string
    }
  }
}
