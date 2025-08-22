import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      dbId?: string
      memberSince?: string
    } & DefaultSession["user"]
  }
}
