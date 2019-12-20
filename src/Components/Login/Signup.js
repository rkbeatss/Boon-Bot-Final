import React, { useCallback } from "react";
import { withRouter } from "react-router-dom";
import "./Login.css";
import { Form, Card, Button } from "react-bootstrap";
import Firebase from "../Firebase/Firebase.js";
import HomeHeader from "../../constants/HomeHeader.js";
import { firestore } from "firebase";
import "firebase/firestore";

const SignUp = ({ history }) => {
  const handleSignUp = useCallback(
    async event => {
      event.preventDefault();
      const { email, password, username } = event.target.elements;
      try {
        await Firebase.auth()
          .createUserWithEmailAndPassword(email.value, password.value)
          .then(userCredential => {
            console.log(userCredential.user.uid);
            firestore()
              .collection("Users")
              .doc(userCredential.user.uid)
              .set({ name: username.value, userID: userCredential.user.uid });
          });
        history.push("/");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  function handleCancel() {
    history.push("/");
  }

  return (
    <div>
      <HomeHeader />
      <Card>
        <Card.Body className="signup">
          <Card.Title className="input">
            <h1>Sign Up</h1>
          </Card.Title>
          <Form onSubmit={handleSignUp}>
            <Form.Group controlId="formBasicName" className="input">
              <Form.Control type="text" placeholder="Name" name="username" />
            </Form.Group>
            <Form.Group controlId="formBasicEmail" className="input">
              <Form.Control type="email" placeholder="Email" name="email" />
            </Form.Group>
            <Form.Group controlId="formBasicPassword" className="input">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
              />
            </Form.Group>
            <Button type="submit" className="Button">
              {" "}
              Sign Up
            </Button>
            <br></br>
            <p>
              <Button className="Button" onClick={handleCancel}>
                Cancel
              </Button>
            </p>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default withRouter(SignUp);
