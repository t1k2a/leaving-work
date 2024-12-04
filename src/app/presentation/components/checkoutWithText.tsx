"use client";
import { useState } from "react";
import checkoutWithTextStyle from "../styles/checkoutWithText.module.css";

function CheckoutWithText() {
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
    setIsOpen(!isOpen);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handleClick = async function () {
    await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: inputValue }),
    }).then((response) => {
      if (response.ok) {
        alert("退勤が記録されました");
        openModal();
      }
    });
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
              onTouchEnd={handleClick}
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
