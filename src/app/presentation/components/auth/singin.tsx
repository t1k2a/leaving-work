import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import { signIn } from 'next-auth/react'
import React, { useState } from 'react'
import authOptions  from  '../../../../pages/api/[...nextauth]'
import styles from '../../../presentation/styles/auth.module.css'

export default function SignIn() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        const result = await signIn('credentials', {
            password,
            redirect: false,
        })

        if (result?.error) {
            setError('パスワードが正しくありません')
        } else if (result?.url && result.url !== '/') {
            window.location.href = result.url
        }

        setIsLoading(false)
    }

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <h2 className={styles.title}>ログイン</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor='password' className={styles.label}>
                            パスワード
                        </label>
                        <input
                          type='password'
                          id='password'
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={styles.input}
                          required
                        />
                    </div>
                    {error && <div className={styles.error}>{error}</div>}
                    <button
                        type='submit'
                        disabled={isLoading}
                        className={styles.button}
                    >
                        {isLoading ? '認証中...' : 'ログイン'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions)

    if (session == undefined) {
        return {
            props: {}
        }
    }

    return {
        redirect: {
            destination: '/',
            permanent: false
        }
    }
}
