// ログイン認証はNextAuth.jsを採用
// DBレス、App Router完全対応、実装の簡潔性
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.password) {
                    return null;
                }

                // 環境変数のパスワードと照合
                if (credentials.password === process.env.AUTH_PASSWORD) {
                    return {
                        id: 'auth', // NextAuth内部でのみ使用
                        name: 'ログインユーザー',
                    }
                }

                return null
            }
        })
    ],
    session: {
        strategy: 'jwt',
        maxAge:  7 * 24 * 60 * 60, // 1週間（秒単位）
    },
    pages: {
        signIn: '/auth/signin', // カスタムログインページ
    },
}


export default NextAuth(authOptions)