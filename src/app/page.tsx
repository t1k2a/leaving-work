"use client"

import checkoutStyles from "./presentation/styles/checkout.module.css";
import CurrentTime from "./presentation/components/currentTime";
import SendCheckout from "./presentation/components/sendCheckout.client";
import CheckoutWithText from "./presentation/components/checkoutWithText";
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
    return <div>リダイレクト中...</div>;
  }

  return (
    <main className={checkoutStyles.main} id="main">
      <div className={checkoutStyles.mainPosition}>
        <div className={checkoutStyles.logoutButton}>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
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
      </div>
    </main>
  );
}
