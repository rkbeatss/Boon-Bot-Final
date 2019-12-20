import React from "react";
import "./App/App.css";
import HomeHeader from "../constants/HomeHeader.js";
import HelloText from "../constants/HelloText.js";
import Login from "./Login/Login.js";
import { Card, Button } from "react-bootstrap";

export default function Home() {
  return (
    <div className="row">
      <div className="column left">
        <HomeHeader />
        <HelloText />
        <Button className="TalkButton" variant="outline-primary" href="./chat">
          Let's Talk
        </Button>
      </div>
      <div className="column right">
        <Card className="Card">
          <Card.Body>
            <Login />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
