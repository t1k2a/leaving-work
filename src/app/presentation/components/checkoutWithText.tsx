"use client";
import { useState } from "react";
import checkoutWithTextStyle from "../styles/checkoutWithText.module.css";
import { sendCheckoutRequest } from "@/app/utility/callApi";
import showAlertForCheckout from "@/app/utility/showAlertForCheckout";

function CheckoutWithText() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  if (typeof document == "undefined") {
    return;
  }

  const main = document.getElementById("main");
  const checkout = document.getElementById("checkout");

  if (main == undefined || checkout == undefined) {
    return;
  }

  if (isOpen) {
    main.style.background = "gray";
    checkout.style.opacity = "0.5";
  } else {
    main.style.background = "rgb(214, 219, 220)";
    checkout.style.opacity = "1";
  }

  const openModal = function () {
    const userRadioButtons = document.getElementById("userRadioButtons")
    if (userRadioButtons != null) {
      const radioButtonStyle = window.getComputedStyle(userRadioButtons);
      if (radioButtonStyle.display === "none") {
        userRadioButtons.style.display = "block";
      } else {
        userRadioButtons.style.display = "none";
      }
    }
    setIsOpen(!isOpen);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handleClickDOM = async () => {
    const responseStatus = await sendCheckoutRequest(inputValue, null);
    showAlertForCheckout(responseStatus, openModal)
  };

  const handleRadioChange = (userName: string | null) => {
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
          {/* テキストボタンを押したときに背景を消したい */}
          {/* <UserRadioButtons handleChange={handleRadioChange} userName={userName}></UserRadioButtons> */}
          <div className={checkoutWithTextStyle.modalField}>
            <textarea
              name="text"
              className={checkoutWithTextStyle.modalTextArea}
              onChange={handleChange}
            ></textarea>
            {/* 後続にて実装 */}
            {/* {inputValue && (
              <div className={checkoutWithTextStyle.modalPreview}>
                <p>プレビュー：</p>
                <CurrentTime />
                <br></br>
                <p>{inputValue}</p>
              </div>
            )} */}

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
