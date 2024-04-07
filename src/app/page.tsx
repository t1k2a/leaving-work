import checckoutStyles from "./checkout.module.css";
import CurrentTime from "./currentTime";
import SendCheckout from "./sendCheckout.client";
import CheckoutWithText from "./checkoutWithText";

export default function Home() {
  return (
    <main className={checckoutStyles.main} id="main">
      <div className={checckoutStyles.mainPosition}>
        <SendCheckout />
        <CurrentTime />
        <CheckoutWithText />
      </div>
    </main>
  );
}
