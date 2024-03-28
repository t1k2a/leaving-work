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
    checkout.disabled = true;
  } else {
    main.style.background = "rgb(214, 219, 220)";
    checkout.disabled = false;
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
        <div className={checkoutWithTextStyle.square} onTouchEnd={openModal}>
          <p className={checkoutWithTextStyle.text}>テキストをつけて退勤</p>
        </div>
      </div>
      {isOpen && (
        <section id="info">
          <div>
            <input
              type="text"
              name="text"
              style={{
                width: "200pt",
                height: "130pt",
                background: "white",
                position: "absolute",
                borderRadius: "20px",
                top: "0",
                right: "0",
                bottom: "390px",
                left: "0",
                margin: "auto",
              }}
            />
            <p className={checkoutWithTextStyle.text}>テキストをつけて退勤</p>
          </div>
        </section>
      )}
    </>
  );
}
export default CheckoutWithText;
