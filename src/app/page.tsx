import checckoutStyles from "./checkout.module.css";
import CurrentTime from "./currentTime";
import SendCheckout from "./sendCheckout.client";

export default function Home() {
  return (
    <main className={checckoutStyles.main}>
      <div className={checckoutStyles.mainPosition}>
        <SendCheckout />
        <CurrentTime />
      </div>
    </main>
  );
}
