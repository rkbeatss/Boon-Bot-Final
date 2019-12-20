import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import "../Components/App/App.css";

function Footer() {
  return (
    <Navbar className="Footer" fixed="bottom" expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="./about">
            <h6>About Us</h6>
          </Nav.Link>
          <Nav.Link href="./contact">
            <h6>Contact</h6>
          </Nav.Link>
          <Nav.Link href="./chat">
            <h6>Chat Now</h6>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Footer;
