"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import styles from "../styles/autoVercelAI.module.css";

interface VercelAIResponse {
    text: string;
    timestamp: string;
    error?: string;
}

export default function AutoVercelAIMessage() {
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchVercelAIMessage();
    }, []);

    const fetchVercelAIMessage = async () => {
        try {
            const response = await fetch('/api/vercelAI', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: any = await response.json();
            setMessage(data.text);
        } catch (error) {
            console.error('VercelAI API呼び出しエラー:', error);
            setMessage("**今日も一日、本当にお疲れ様でした！** 🌟");
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingMessage}>
                    <div className={styles.spinner}></div>
                    <span>今日の労いメッセージを取得中...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={`${styles.messageCard} ${error ? styles.fallback : ''}`}>
                <div className={styles.icon}>
                    {error ? '🌙' : '🌟'}
                </div>
                <div className={styles.content}>
                    <h3 className={styles.title}>
                        {error ? '今日の労い' : 'AIからの今日の労い'}
                    </h3>
                    <div>
                        <ReactMarkdown>{message}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
}