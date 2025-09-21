"use client"

import checkoutStyles from "./presentation/styles/checkout.module.css";
import CurrentTime from "./presentation/components/currentTime";
import SendCheckout from "./presentation/components/sendCheckout.client";
import CheckoutWithText from "./presentation/components/checkoutWithText";
import AutoVercelAIMessage from "./presentation/components/autoVercelAIMessage";
import AnnouncementBanner from "./presentation/components/announcement/announcementBanner";
import NotificationIcon from "./presentation/components/announcement/notificationIcon";
import { useState } from "react";
import { useSession, signOut, signIn } from "next-auth/react";

export default function Home(): JSX.Element {
  const [hideUserRadioButtons, setHideUserRadioButtons] = useState(false);
  const { data: session, status } = useSession();

  const handleTextCheckoutOpen = () => {
    setHideUserRadioButtons(true);
  };

  const handleTextCheckoutClose = () => {
    setHideUserRadioButtons(false);
  };

  if (status === 'loading') {
    return <div>読み込み中...</div>;
  }

  if (!session) {
    signIn(undefined, { callbackUrl: '/' });
    return (
      <div>
        リダイレクト中...
        <noscript>
          <meta http-equiv="Refresh" content="0; url=/" />
        </noscript>
      </div>
    );
  }

  return (
    <>
    <AnnouncementBanner />
    <main className={checkoutStyles.main} id="main">
      <div className={checkoutStyles.mainPosition}>
        <div className={checkoutStyles.logoutButton}>
          <NotificationIcon />
          <button
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className={checkoutStyles.logout}>
              ログアウト
          </button>
        </div>
        <SendCheckout hideUserRadioButtons={hideUserRadioButtons} />
        <CurrentTime />
        <CheckoutWithText
          onModalOpen={handleTextCheckoutOpen}
          onModalClose={handleTextCheckoutClose}
        />
        <a href="/game/index.html" className={checkoutStyles.gameButton}>
          <button className={checkoutStyles.playGame}>
            ゲームをプレイする
          </button>
        </a>
        {/* AI自動メッセージ */}
        <AutoVercelAIMessage />
      </div>
    </main>
    </>
  );
}
