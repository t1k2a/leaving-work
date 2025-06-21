"use client";
import { useState } from "react";
import checkoutWithTextStyle from "../styles/checkoutWithText.module.css";
import { sendCheckoutRequest } from "@/app/utility/callApi";
import showAlertForCheckout from "@/app/utility/showAlertForCheckout";
import UserRadioButtons from "./parts/userRadioButtons";
import { useTemporaryDisable } from "@/app/hooks/useTemporaryDisable";

interface CheckoutWithTextProps {
  onModalOpen?: () => void;
  onModalClose?: () => void;
}

function CheckoutWithText({ onModalOpen, onModalClose }: CheckoutWithTextProps) {
  const [userName, setUserName] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [preViewTime, setPreviewTime] = useState<string | null>(null);
  const [showUserRadioButtons, setShowUserRadioButtons] = useState(false);
  const [isTemporarilyDisabled, disableTemporarily] = useTemporaryDisable();
  const openModal = (): void => {
    setShowUserRadioButtons(!showUserRadioButtons);
    
    if (isOpen) {
      setInputValue("");
      // モーダルが閉じるとき
      onModalClose?.();
    } else {
      // モーダルが開くとき
      onModalOpen?.();
      setPreviewTime(new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }));
    }

    setIsOpen(!isOpen);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handleClickDOM = async () => {
    disableTemporarily();
    const responseStatus = await sendCheckoutRequest(inputValue, userName);
    showAlertForCheckout(responseStatus, openModal)
  };

  const handleRadioChange = (userName: string) => {
    setUserName(userName);
  };

  return (
    <>
    {/* 背景のオーバーレイを条件付きレンダリング */}
    {isOpen && <div className={checkoutWithTextStyle.overlay}></div>}    
      <div
        className={`${checkoutWithTextStyle.square} ${isOpen ? checkoutWithTextStyle.disabled : ""}`}
        onTouchEnd={isOpen ? undefined : openModal}
      >
        <p className={checkoutWithTextStyle.text}>テキストをつけて退勤</p>
      </div>
      {isOpen && (
        <section id="info" className={checkoutWithTextStyle.section}>
          <div className={checkoutWithTextStyle.modal}>
            <span
              className={checkoutWithTextStyle.batsu}
              onTouchEnd={openModal}
            ></span>
          </div>
          {showUserRadioButtons && (
            <UserRadioButtons 
              handleChange={handleRadioChange}
              selectedValue={userName}
            ></UserRadioButtons>
          )}
          <div className={checkoutWithTextStyle.modalField}>
            <textarea
              name="text"
              className={checkoutWithTextStyle.modalTextArea}
              onChange={handleChange}
            ></textarea>
            {inputValue && (
              <div className={checkoutWithTextStyle.modalPreview}>
                <p className={checkoutWithTextStyle.previewTitle}>↓ プレビュー</p>
                <p className={checkoutWithTextStyle.previewMessage}>{userName? userName + "が、" : ""}{preViewTime}:退勤しました！</p>
                <p className={checkoutWithTextStyle.previewText}>追加テキスト：</p>
                <p className={checkoutWithTextStyle.previewText}>{inputValue}</p>
              </div>
            )}

            <button
              className={`${checkoutWithTextStyle.squareButton} ${isTemporarilyDisabled ? checkoutWithTextStyle.disabled : ''}`}
              onTouchEnd={handleClickDOM}
              disabled={isTemporarilyDisabled}
            >
              退勤する
            </button>
          </div>
        </section>
      )}
    </>
  );
}
export default CheckoutWithText;
