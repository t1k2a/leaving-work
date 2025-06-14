"use client";
import checckoutStyles from "../styles/checkout.module.css";
import { sendCheckoutRequest } from "@/app/utility/callApi";
import showAlertForCheckout from "@/app/utility/showAlertForCheckout";
import React, { useState } from "react";
import UserRadioButtons from "./parts/userRadioButtons";

interface SendCheckoutProps {
  hideUserRadioButtons?: boolean;
}

function SendCheckout({ hideUserRadioButtons = false }: SendCheckoutProps) {
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
      {/* 条件付きでUserRadioButtonsを表示 */}
      {!hideUserRadioButtons && (
      <UserRadioButtons 
        handleChange={handleRadioChange}
        selectedValue={userName}
      ></UserRadioButtons>
      )}
        <button
      className={`${checckoutStyles.checkoutButton} ${hideUserRadioButtons ? checckoutStyles.disabled : ''}`}
      id="checkout"
      onTouchEnd={hideUserRadioButtons ? undefined : handleClick}
      disabled={hideUserRadioButtons}
    >
      退勤する
    </button>
  </div>
  );
}

export default SendCheckout;
