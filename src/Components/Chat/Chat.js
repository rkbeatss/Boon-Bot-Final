import React, { Component } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./Chat.css";
import ChatHistory from "./ChatMsgHistory";
import ChatInput from "./ChatInput";
import boon_bot_gif from "../../constants/boonbot.gif";
import Firebase from "../Firebase/Firebase";
import "firebase/firestore";

const uuid = require("uuid");
class Chat extends Component {
  constructor(props) {
    super(props);
    this.sessionId = uuid.v4();
    this.state = {
      msg_history: [],
      loading: false
    };
  }
  sendMessage = message => {
    this.detectIntent(message);
  };
  detectIntent = message => {
    fetch(
      "/api/detectIntent/" + `${this.sessionId}` + "/" + `${message.message}`
    )
      .then(res => res.json())
      .then(data => {
        var intent = data.detectedIntent;
        if (
          intent == "sad" ||
          intent == "anxious" ||
          intent == "happy" ||
          intent == "okay"
        ) {
          this.setMood(intent);
        }
        if (message.user_id === "") {
          this.setState({
            msg_history: this.state.msg_history.concat({
              anonymous: true,
              user_text: message.message
            })
          });
          this.updateScroll();
        } else {
          this.setState({
            msg_history: this.state.msg_history.concat({
              user_id: message.user_id,
              user_text: message.message
            })
          });
          this.updateScroll();
        }
        setTimeout(
          function() {
            this.setState({ loading: true });
            this.updateScroll();
          }.bind(this),
          1000
        );
        setTimeout(
          function() {
            this.setState({
              loading: false,
              msg_history: this.state.msg_history.concat({
                boon_bot: true,
                bot_msg: data.fulfillmentText
              })
            });
            this.updateScroll();
          }.bind(this),
          3000
          
        );

        this.updateScroll();
      })
      .catch(console.log("No intents detected"));
  };
  updateScroll() {
    var element = document.getElementById("chatContainer");
    element.scrollTop = element.scrollHeight;
  }
  setMood(mood) {
    let today = new Date();
    var user = Firebase.auth().currentUser;
    var uid;
    if (user != null) {
      uid = user.uid;
      Firebase.firestore()
        .collection("MoodCollection")
        .add({
          userID: uid,
          mood: mood,
          date: today
        });
    }
  }
  render() {
    const { sendMessage, state } = this;
    return (
      <div>
        {/* <HomeHeader /> */}
        <Container className="Container">
          <Row>
            <Col sm={4}>
              <Card className="boonContainer">
                <Card.Body>
                  <img
                    className="boonbot-gif"
                    src={boon_bot_gif}
                    height="273"
                    width="350"
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={8}>
              <Card className="chatContainer" id="chatContainer">
                <Card.Body>
                  {/* chat messages will go here */}
                  <ChatHistory
                    msg_history={state.msg_history}
                    loading={state.loading}
                  />
                </Card.Body>
              </Card>
              <ChatInput sendMessage={sendMessage} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
export default Chat;
