import React from "react";
import "./App/App.css";
import HomeHeader from "../constants/HomeHeader.js";
import Rupsi from "../constants/rupsi.jpg";
import Abha from "../constants/abha.JPG";
import { Container, Row, Col, Image } from "react-bootstrap";

function About() {
  return (
    <div>
      <HomeHeader />
      <h2 className="page-title">About Us</h2>
      <br />
      <Container>
        <Row>
          <Col md={6}>
            <Image
              src={Rupsi}
              height="450"
              width="450"
              alt="Rupsi Kaushik"
              roundedCircle
            />
          </Col>
          <Col md={6}>
            <Image
              src={Abha}
              height="450"
              width="450"
              alt="Abha Sharma"
              roundedCircle
            />
          </Col>
        </Row>
      </Container>
      <br />
      <p className="about-us">
        Dialog System for Mental Health created by two students at the
        University of Ottawa, as part of their honours project.
      </p>
    </div>
  );
}

export default About;
