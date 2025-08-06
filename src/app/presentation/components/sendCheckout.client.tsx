"use client";
import checckoutStyles from "../styles/checkout.module.css";
import { sendCheckoutRequest } from "@/app/utility/callApi";
import showAlertForCheckout from "@/app/utility/showAlertForCheckout";
import React, { useState } from "react";
import UserRadioButtons from "./parts/userRadioButtons";
import { useTemporaryDisable } from "@/app/hooks/useTemporaryDisable";
import { postWorkRecord } from "@/app/api/client/postWorkRecord"

interface SendCheckoutProps {
  hideUserRadioButtons?: boolean;
}

function SendCheckout({ hideUserRadioButtons = false }: SendCheckoutProps) {
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isTemporarilyDisabled, disableTemporarily] = useTemporaryDisable();
  const handleClick: React.TouchEventHandler<HTMLButtonElement> = async function () {
    // ユーザー選択チェック
    if (!userId) {
      alert('ユーザーを選択してください')
      return;
    }

    // ボタンを一時的に無効化
    disableTemporarily();
    
    // postWorkRecord APIを呼び出す
    try {
      const now = new Date();
      const clockOutTime = now.toISOString();
      const isDev: boolean = process.env.NODE_ENV === 'development';

      if (isDev) {
        await postWorkRecord(String(userId), clockOutTime);
      }
      alert('退勤登録が完了しました');
    } catch (error) {
      console.error('退勤記録の登録に失敗しました:', error);
      alert('退勤登録に失敗しました');
    }
    
    const responseStatus: number = await sendCheckoutRequest(null, userName);
    showAlertForCheckout(responseStatus)
  };
  const handleRadioChange = (userName: string, userId: string): void => {
    setUserName(userName);
    setUserId(userId);
  };
  const isButtonDisabled = !userId || hideUserRadioButtons || isTemporarilyDisabled;

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
