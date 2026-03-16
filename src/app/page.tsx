"use client"

import checkoutStyles from "./presentation/styles/checkout.module.css";
import CurrentTime from "./presentation/components/currentTime";
import SendCheckout from "./presentation/components/sendCheckout.client";
import CheckoutWithText from "./presentation/components/checkoutWithText";
import AutoMessage from "./presentation/components/autoMessage";
import AnnouncementBanner from "./presentation/components/announcement/announcementBanner";
import NotificationIcon from "./presentation/components/announcement/notificationIcon";
import RouteSearchModal from "./presentation/components/routeSearchModal";
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
        <AutoMessage />
        <RouteSearchModal />
      </div>
    </main>
    </>
  );
}
