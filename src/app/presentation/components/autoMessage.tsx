"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import styles from "../styles/auto.module.css";
import { IYASHI_MESSAGES } from "../constants/iyashiMessages";

export default function AutoMessage() {
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
            setMessage(getRandomIyashiMessage());       
            setIsLoading(false);
    }, []);

    const getRandomIyashiMessage = () => {
        return IYASHI_MESSAGES[Math.floor(Math.random() * IYASHI_MESSAGES.length)];
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
            <div className={`${styles.messageCard}`}>
                <div className={styles.icon}>
                    🌟
                </div>
                <div className={styles.content}>
                    <h3 className={styles.title}>
                        今日の労い
                    </h3>
                    <div>
                        <ReactMarkdown>{message}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
}
