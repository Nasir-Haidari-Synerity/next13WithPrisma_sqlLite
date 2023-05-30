import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
import TwitterProvider from "next-auth/providers/twitter"
import Auth0Provider from "next-auth/providers/auth0"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const dbUser = await prisma.user.findUnique({
          where: {
            email: credentials.username
          }
        }) 
        if(dbUser){
          console.log(dbUser.password === credentials.password)
          return dbUser
        }
        return null
      }
      
    }),


    // Auth0Provider({
    //   clientId: process.env.AUTH0_ID,
    //   clientSecret: process.env.AUTH0_SECRET,
    //   issuer: process.env.AUTH0_ISSUER,
    // }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_ID,
    //   clientSecret: process.env.FACEBOOK_SECRET,
    // }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),
    // TwitterProvider({
    //   clientId: process.env.TWITTER_ID,
    //   clientSecret: process.env.TWITTER_SECRET,
    //   version: "2.0",
    // }),
  ],
  callbacks: {
    async jwt({ token }) {
      token.userRole = "admin"
      return token
    },
  },
}

export default NextAuth(authOptions)
