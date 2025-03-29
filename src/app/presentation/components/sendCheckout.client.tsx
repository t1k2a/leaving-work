"use client";
import checckoutStyles from "../styles/checkout.module.css";
import { sendCheckoutRequest } from "@/app/utility/callApi";
import showAlertForCheckout from "@/app/utility/showAlertForCheckout";

function SendCheckout() {
  const handleClick = async function () {
    const responseStatus = await sendCheckoutRequest(null);
    showAlertForCheckout(responseStatus)
  };

  return (
    <button
      className={checckoutStyles.checkoutButton}
      id="checkout"
      onTouchEnd={handleClick}
      disabled
    >
      退勤する
    </button>
  );
}

export default SendCheckout;
