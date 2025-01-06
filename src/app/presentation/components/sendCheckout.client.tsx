"use client";
import checckoutStyles from "../styles/checkout.module.css";
import checkoutAPI from "@/pages/api/checkoutAPI";

function SendCheckout() {
  const handleClick = async function () {
    await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.ok) {
        alert("退勤が記録されました");
      }
    });
  };

  const handleClickDOM = async () => {
    await checkoutAPI(null);
  };

  return (
    <button
      className={checckoutStyles.checkoutButton}
      id="checkout"
      onTouchEnd={handleClickDOM}
      disabled
    >
      退勤する
    </button>
  );
}

export default SendCheckout;
