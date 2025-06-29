"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import styles from "../styles/autoGemini.module.css";

interface GeminiResponse {
    text: string;
    timestamp: string;
    cached: boolean;
    error?: string;
}

export default function AutoGeminiMessage() {
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isCached, setIsCached] = useState(false);

    useEffect(() => {
        fetchGeminiMessage();
    }, []);

    const fetchGeminiMessage = async () => {
        try {
            const response = await fetch('/api/geminiAPI', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: GeminiResponse = await response.json();
            setMessage(data.text);
            setIsCached(data.cached);
        } catch (error) {
            console.error('Gemini API呼び出しエラー:', error);
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
                    {error ? '🌙' : isCached ? '💾' : '🌟'}
                </div>
                <div className={styles.content}>
                    <h3 className={styles.title}>
                        {error ? '今日の労い' : 
                         isCached ? 'AIメッセージ' : 'AIからの今日の労い'}
                    </h3>
                    <div>
                        <ReactMarkdown>{message}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
}