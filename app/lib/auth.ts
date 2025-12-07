/**
 * Auth stub - временная заглушка
 * Раскомментируйте код ниже когда будете готовы настроить БД
 */

// import { betterAuth } from 'better-auth'
// import { join } from 'path'
//
// const getDatabaseUrl = () => {
//   if (process.env.DATABASE_URL) {
//     return process.env.DATABASE_URL
//   }
//   const dbPath = join(process.cwd(), 'data', 'auth.db')
//   return `file:${dbPath}`
// }
//
// export const auth = betterAuth({
//   database: {
//     provider: 'sqlite',
//     url: getDatabaseUrl()
//   },
//   emailAndPassword: {
//     enabled: true,
//     requireEmailVerification: false
//   },
//   socialProviders: {
//     github: {
//       clientId: process.env.GITHUB_CLIENT_ID || '',
//       clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
//       enabled: !!process.env.GITHUB_CLIENT_ID
//     },
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID || '',
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
//       enabled: !!process.env.GOOGLE_CLIENT_ID
//     }
//   },
//   session: {
//     expiresIn: 60 * 60 * 24 * 7,
//     updateAge: 60 * 60 * 24
//   }
// })

// Заглушка
export const auth = {
  handler: () => {
    return new Response('Auth is disabled', { status: 503 })
  }
}