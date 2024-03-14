"use client";
import React from "react";
import checckoutStyles from "./checkout.module.css";

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

  return (
    <button
      className={checckoutStyles.checkoutButton}
      id="checkout"
      onClick={handleClick}
      onTouchEnd={handleClick}
    >
      退勤する
    </button>
  );
}

export default SendCheckout;
