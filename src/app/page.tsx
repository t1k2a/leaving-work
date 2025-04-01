import checkoutStyles from "./presentation/styles/checkout.module.css";
import CurrentTime from "./presentation/components/currentTime";
import SendCheckout from "./presentation/components/sendCheckout.client";
import CheckoutWithText from "./presentation/components/checkoutWithText";

export default function Home() {

  return (
    <main className={checkoutStyles.main} id="main">
      <div className={checkoutStyles.mainPosition}>
        <SendCheckout />
        <CurrentTime />
        <CheckoutWithText />
      </div>
    </main>
  );
}
