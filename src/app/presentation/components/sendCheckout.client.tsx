"use client";
import checckoutStyles from "../styles/checkout.module.css";
import { sendCheckoutRequest } from "@/app/utility/callApi";
import showAlertForCheckout from "@/app/utility/showAlertForCheckout";
import React, { useState } from "react";
import UserRadioButtons from "./parts/userRadioButtons";

function SendCheckout() {
  const [userName, setUserName] = useState<string | null>(null);
  const handleClick: React.TouchEventHandler<HTMLButtonElement> = async function () {
    const responseStatus: number = await sendCheckoutRequest(null, userName);
    showAlertForCheckout(responseStatus)
  };
  const handleRadioChange = (userName: string): void => {
    setUserName(userName);
  };

  return (
    <div>
      <UserRadioButtons handleChange={handleRadioChange}></UserRadioButtons>
        <button
      className={checckoutStyles.checkoutButton}
      id="checkout"
      onTouchEnd={handleClick}
      disabled
    >
      退勤する
    </button>
  </div>
  );
}

export default SendCheckout;
