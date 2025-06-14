"use client"

import checkoutStyles from "./presentation/styles/checkout.module.css";
import CurrentTime from "./presentation/components/currentTime";
import SendCheckout from "./presentation/components/sendCheckout.client";
import CheckoutWithText from "./presentation/components/checkoutWithText";
import { useState } from "react";

export default function Home(): JSX.Element {
  const [hideUserRadioButtons, setHideUserRadioButtons] = useState(false);

  const handleTextCheckoutOpen = () => {
    setHideUserRadioButtons(true);
  };

  const handleTextCheckoutClose = () => {
    setHideUserRadioButtons(false);
  };

  return (
    <main className={checkoutStyles.main} id="main">
      <div className={checkoutStyles.mainPosition}>
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
