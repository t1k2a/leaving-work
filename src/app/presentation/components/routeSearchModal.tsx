"use client";

import { useState, useEffect } from "react";
import Markdown from "react-markdown";
import styles from "../styles/routeSearch.module.css";

interface RouteSearchResponse {
  route: string;
  origin: string;
  destination: string;
  timestamp: string;
  fallback?: boolean;
}

export default function RouteSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [routeData, setRouteData] = useState<RouteSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await fetch("/api/route-search");
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        const data: RouteSearchResponse = await res.json();
        setRouteData(data);
      } catch (err) {
        console.error("Route search failed:", err);
        setError("経路情報の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoute();
  }, []);

  return (
    <>
      <div className={styles.routeButton}>
        <button
          className={styles.openButton}
          onClick={() => setIsOpen(true)}
          disabled={isLoading}
        >
          {isLoading ? "経路を読み込んでます..." : "経路を表示"}
        </button>
      </div>

      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <h2 className={styles.title}>経路検索結果</h2>
              <button
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
              >
                &times;
              </button>
            </div>

            <div className={styles.content}>
              {isLoading && (
                <p className={styles.loading}>経路を検索中...</p>
              )}
              {error && <p className={styles.error}>{error}</p>}
              {routeData && (
                <Markdown>{routeData.route}</Markdown>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
