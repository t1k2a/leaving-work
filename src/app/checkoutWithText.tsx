"use client";
import { useState } from "react";
import checkoutWithTextStyle from "./checkoutWithText.module.css";

function CheckoutWithText() {
  const [isOpen, setIsOpen] = useState(false);

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
    <>
      <div>
        <div
          className={checkoutWithTextStyle.square}
          onTouchEnd={isOpen ? undefined : openModal}
        >
          <p className={checkoutWithTextStyle.text}>テキストをつけて退勤</p>
        </div>
      </div>
      {isOpen && (
        <section
          id="info"
          style={{
            position: "absolute",
          }}
        >
          <div style={{ position: "relative", height: "40px" }}>
            <span
              className={checkoutWithTextStyle.batsu}
              onTouchEnd={openModal}
            ></span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <input
              type="text"
              name="text"
              style={{
                width: "200pt",
                height: "130pt",
                background: "white",
                borderRadius: "20px",
                top: "0",
                right: "0",
                bottom: "390px",
                left: "0",
                margin: "auto",
                color: "black",
              }}
            />
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
