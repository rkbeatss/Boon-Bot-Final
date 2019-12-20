import React from "react";
import {Form, Button, InputGroup } from "react-bootstrap";
import './Chat.css';
import propTypes from 'prop-types';
import Firebase from "../Firebase/Firebase";
import "firebase/firestore";

class ChatInput extends React.Component {
   static propTypes = {
        sendMessage: propTypes.func,
    };
    constructor(props){
        super(props);
        this.state = {inputMessage:''};
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    handleChange = (e) => {
        this.setState({value:e.target.value});
    }
    onSubmit = (e) => {
        e.preventDefault();
        const inputMessage = this.state.value; 
        var user = Firebase.auth().currentUser;
        var uid;
        var username = []; 
        if(user !=null){
            uid = user.uid; 
            Firebase.firestore()
            .collection("Users")
            .doc(uid)
            .get()
            .then(doc => {
                username.push(doc.data().name);
            });
        } else {
            username = '';
        }
        if (inputMessage.length === 0){
            return;
        }
        const messageObj = {
            user_id: username,
            message: inputMessage,
            date: new Date().toLocaleString(),
        };
        this.props.sendMessage(messageObj);
        //clear input field 
        this.setState({value:''});
        //set focus
    };
    render(){
        const { onSubmit } = this;
        return(
           <div>
               <Form className="inputField" onSubmit={onSubmit}>
                   <InputGroup className="mb-3">
                       <Form.Control type="text" value={this.state.value} onChange={this.handleChange} placeholder="Type a message..." autoFocus={true}/>
                   <InputGroup.Append>
                        <Button variant="outline-secondary" className="button" type="submit">Send</Button>
                   </InputGroup.Append>
                   </InputGroup>
               </Form>

           </div>
        );
    }
}
export default ChatInput;