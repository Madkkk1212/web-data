import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const username = process.env.ADMIN_USERNAME
        const password = process.env.ADMIN_PASSWORD

        if (
          credentials?.username === username &&
          credentials?.password === password
        ) {
          return {
            id: '1',
            name: 'Admin',
            email: 'admin@system.local',
          }
        }
        return null
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/gw-mgmt-portal-x7k2/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
