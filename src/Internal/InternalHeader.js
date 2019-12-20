import React from "react";
import Official from "../constants/official_logo.png";
import Firebase from "../Components/Firebase/Firebase";
import { Nav } from "react-bootstrap";
import InternalOverview from "./InternalOverview";
import InternalChat from "./InternalChat";
import InternalCalendar from "./InternalCalendar";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class InternalHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: "Chat"
    };
    this.loadOverview = this.loadOverview.bind(this);
    this.loadChat = this.loadChat.bind(this);
    this.loadCalendar = this.loadCalendar.bind(this);
  }
  loadOverview() {
    this.setState({ currentTab: "Overview" });
  }
  loadChat() {
    this.setState({ currentTab: "Chat" });
  }
  loadCalendar() {
    this.setState({ currentTab: "Calendar" });
  }
  render() {
    const current = this.state.currentTab;
    let renderTab;
    if (current === "Chat") {
      renderTab = <InternalChat />;
    } else if (current === "Overview") {
      renderTab = <InternalOverview />;
    } else {
      renderTab = <InternalCalendar />;
    }
    return (
      <div>
        {/*   <img
          className="logo"
          src={Official}
          width="100"
          height="98"
          alt="logo"
        /> */}
        <Nav
          className="internalNavBar"
          fill
          variant="tabs"
          defaultActiveKey="link-0"
        >
          {/* <Nav.Item>
          <Nav.Link eventKey="logo-link"> <img src={Official} style={{width:"40px", height:"40px"}} /> </Nav.Link>
        </Nav.Item> */}
          <Nav.Item>
            <Nav.Link eventKey="link-0" onClick={this.loadChat}>
              Chat
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-1" onClick={this.loadCalendar}>
              Mood Calendar
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-2" onClick={this.loadOverview}>
              Overview
            </Nav.Link>
          </Nav.Item>
          <Nav pullright="true">
            <Nav.Item>
              <Nav.Link
                eventKey="link-3"
                onClick={() =>
                  Firebase.auth()
                    .signOut()
                    .then((window.location = "/"))
                }
              >
                {" "}
                Logout
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link-4">
                {" "}
                <FontAwesomeIcon icon={faQuestionCircle} size="lg" />{" "}
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Nav>
        {renderTab}
      </div>
    );
  }
}
export default InternalHeader;
