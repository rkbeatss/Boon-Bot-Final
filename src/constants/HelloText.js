import React from "react";
import "../Components/App/App.css";
import logo from "./logo.png";

export default function HelloText() {
  return (
    <div>
      <h3 className="helloText">
        Hello, I am <span className="red">Boonbot.</span>
      </h3>
      <p className="joinText">
        <img
          src={logo}
          className="landingBotPic"
          alt="Boon bot"
          width="425"
          height="444"
        />
        I am here to help you manage your thoughts <br /> or simply be here for
        you.
      </p>
    </div>
  );
}
