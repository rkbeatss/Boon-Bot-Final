import React from "react";
import './Chat.css';
import propTypes from 'prop-types';
import boon_bot from "../../constants/official_logo.png";
import user from "../../constants/user.png";
import TypingSpinner from "../Spinner/TypingSpinner";


class ChatHistory extends React.Component {
    static propTypes = {
        msg_history: propTypes.array,
        loading: propTypes.bool
    }
    render(){
        const { props } = this;
        console.log(props);
        //loading spinner is getting displayed in for loop for how many message objs there are
        return (<ul>
        { props.msg_history.map((messageObj) => {
        return (
          <li className="messages" key={messageObj}>
            {messageObj.user_id && messageObj.user_text ? (<div className ="userContainer"><img src={user} alt ="User Avatar" style={{width:"100%"}}/> <span>{messageObj.user_id}</span> <br /> <span>{messageObj.user_text}</span></div>): null}
            {messageObj.anonymous  && messageObj.user_text ? (<div className="userContainer"> <span> {"Anonymous user"} </span> <br /> <span> {messageObj.user_text}</span></div> ) : null }
            {messageObj.boon_bot ? (<div className="userContainer darker"><img src={boon_bot} alt="Avatar" style={{width:"100%"}} /> <span>{"Boon Bot"}</span> <br /> <span>{messageObj.bot_msg}</span></div>): null}
          </li>
        ); })
       }
       {props.loading ? (<TypingSpinner />) : null}
      </ul>);
    }
}
export default ChatHistory;