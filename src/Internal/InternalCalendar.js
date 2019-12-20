import React from 'react';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Internal.css';
import Firebase from "../Components/Firebase/Firebase";
import "firebase/firestore";

const localizer = momentLocalizer(moment);

class InternalCalendar extends React.Component {
    _isMounted = false; 
    emojiDict = {
        "happy": '😀',
        "sad":'😔',
        "anxious": '😰',
        "okay":'😕'
    }
    constructor(props){
        super(props); 
        this.state = {
            events: []
        };
    }
    componentDidMount(){
        this._isMounted = true;
        this.getMoods(this._isMounted);        
    }
    getMoods(isMounted){
       let today = new Date();
       var user = Firebase.auth().currentUser;
       var uid;
       if(user != null ){
           uid = user.uid;
       }
       Firebase.firestore()
      .collection("MoodCollection")
      .where("userID", "==", uid)
      .where("date", "<=", today)
      .get()
      .then(docs => {
        {
          docs.forEach(doc => {
            const { date, mood } = doc.data();
            if(isMounted){
            var moodEmoji; 
            if(this.emojiDict.hasOwnProperty(mood)){
                moodEmoji = this.emojiDict[mood];
            } 
            this.setState({events:this.state.events.concat({'title':moodEmoji, 'start':date.toDate(), 'end':date.toDate(), 'allDay':true, 'resource':'test'})});
            }
          });
        }
      });
    }
    render(){
        return(
            <div className="calendar-container">	
                <div className="calendar-item">
                    <Calendar 
                        events={this.state.events}
                        startAccessor="start"
                        endAccessor="end"
                        defaultDate={moment().toDate()}
                        localizer={localizer} />
                </div>
            </div>
        );
    }
}
export default InternalCalendar;