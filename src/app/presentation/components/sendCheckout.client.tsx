"use client";
import checckoutStyles from "../styles/checkout.module.css";
import { sendCheckoutRequest } from "@/app/utility/callApi";
import showAlertForCheckout from "@/app/utility/showAlertForCheckout";
import React, { useState } from "react";
import UserRadioButtons from "./parts/userRadioButtons";
import { TEMPORARY_DISABLE_DURATION_MS } from "@/app/utility/constants";

interface SendCheckoutProps {
  hideUserRadioButtons?: boolean;
}

function SendCheckout({ hideUserRadioButtons = false }: SendCheckoutProps) {
  const [userName, setUserName] = useState<string | null>(null);
  const [isTemporarilyDisabled, setIsTemporarilyDisabled] = useState(false);
  const handleClick: React.TouchEventHandler<HTMLButtonElement> = async function () {
    // ボタンを一時的に無効化
    setIsTemporarilyDisabled(true);

    const responseStatus: number = await sendCheckoutRequest(null, userName);
    showAlertForCheckout(responseStatus)

    setTimeout(() => {
      setIsTemporarilyDisabled(false);
    }, TEMPORARY_DISABLE_DURATION_MS)
  };
  const handleRadioChange = (userName: string): void => {
    setUserName(userName);
  };
  const isButtonDisabled = hideUserRadioButtons || isTemporarilyDisabled;

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
      className={`${checckoutStyles.checkoutButton} ${isButtonDisabled ? checckoutStyles.disabled : ''}`}
      id="checkout"
      onTouchEnd={isButtonDisabled ? undefined : handleClick}
      disabled={isButtonDisabled}
    >
      退勤する
    </button>
  </div>
  );
}

export default SendCheckout;
