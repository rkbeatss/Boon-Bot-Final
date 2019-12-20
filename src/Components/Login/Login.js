import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router-dom";
import "./Login.css";
import { Form, Card, Button } from "react-bootstrap";
import Firebase from "../Firebase/Firebase.js";
import { AuthContext } from "../Firebase/Auth.js";

const Login = ({ history }) => {
  const handleLogin = useCallback(
    async event => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await Firebase.auth().signInWithEmailAndPassword(
          email.value,
          password.value
        );
        history.push("/");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/internalchat" />;
  }

  return (
    <div>
      <Card.Title className="input">
        <h1>Login</h1>
      </Card.Title>
      <Form onSubmit={handleLogin}>
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
          Sign In
        </Button>
        <p></p>
        <p></p>
        <p>
          <a href="/signup">Sign up </a> now to better track your sessions.
        </p>
      </Form>
    </div>
  );
};

export default withRouter(Login);
