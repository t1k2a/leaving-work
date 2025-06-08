"use client";
import { useState } from "react";
import checkoutWithTextStyle from "../styles/checkoutWithText.module.css";
import { sendCheckoutRequest } from "@/app/utility/callApi";
import showAlertForCheckout from "@/app/utility/showAlertForCheckout";
import UserRadioButtons from "./parts/userRadioButtons";

function CheckoutWithText() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [preViewTime, setPreviewTime] = useState<string | null>(null);
  
  if (typeof document == "undefined") {
    return;
  }

  const main: HTMLElement | null = document.getElementById("main");
  const checkout: HTMLElement | null = document.getElementById("checkout");

  if (main == undefined || checkout == undefined) {
    return;
  }

  if (isOpen) {
    main.style.background = "gray";
    checkout.style.opacity = "0.5";
    checkout.style.pointerEvents = "none";
  } else {
    main.style.background = "rgb(214, 219, 220)";
    checkout.style.opacity = "1";
    checkout.style.pointerEvents = "auto";
  }

  const openModal = (): void => {
    const userRadioButtons = document.getElementById("userRadioButtons")
    if (userRadioButtons != null) {
      const radioButtonStyle = window.getComputedStyle(userRadioButtons);
      if (radioButtonStyle.display === "none") {
        userRadioButtons.style.display = "block";
      } else {
        userRadioButtons.style.display = "none";
      }
    }
    
    if (isOpen) {
      setInputValue("");
    }

    if (!isOpen) {
      setPreviewTime(new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }));
    }
    
    setIsOpen(!isOpen);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handleClickDOM = async () => {
    const responseStatus = await sendCheckoutRequest(inputValue, userName);
    showAlertForCheckout(responseStatus, openModal)
  };

  const handleRadioChange = (userName: string) => {
    setUserName(userName);
  };

  return (
    <>
      <div
        className={checkoutWithTextStyle.square}
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
            <UserRadioButtons 
              handleChange={handleRadioChange}
              selectedValue={userName}
            ></UserRadioButtons>
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
              className={checkoutWithTextStyle.squareButton}
              onTouchEnd={handleClickDOM}
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
