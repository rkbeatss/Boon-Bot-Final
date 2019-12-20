import React from "react";
import Official from "./official_logo.png";

export default function HomeHeader() {
  return (
    <div>
      <header>
        <img
          className="logo"
          src={Official}
          width="100"
          height="98"
          alt="logo"
        />
      </header>
    </div>
  );
}
