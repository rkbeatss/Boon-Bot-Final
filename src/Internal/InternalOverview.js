import React, { Component } from "react";
import Firebase from "../Components/Firebase/Firebase";
import "firebase/firestore";
import { Doughnut, Line } from 'react-chartjs-2';
import "./Internal.css"
import {Row, Col} from "react-bootstrap";
import {faExclamationTriangle, faLightbulb} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { tsThisType } from "@babel/types";

class InternalOverview extends Component {
  _isMounted = false; 
  constructor(props) {
    super(props);
    this.state = { username: "", mood_history_weekly: [], mood_history_monthly:[], generalstate: "good", 
    dataDoughnut:{
      labels:["Sad", "Happy", "Anxious", "Okay"],
      datasets:[
        {
          data:[0,0,0,0],
          backgroundColor:[
            "#0b5b8c",
            "#11b835",
            "#e34d12",
            "#d4c746"
          ]
        }
      ],
      hoverBackgroundColor:[
          "#0b5b8c",
          "#11b835",
          "#e34d12",
          "#d4c746"
      ]
    }, 
    dataLine: {
      labels:["October", "November","December"],
      datasets:[
        {
          label:"Sad",
          fill:false,
          lineTension:0.4,
          backgroundColor:"#0b5b8c",
          borderColor:"#0b5b8c",
          borderCapStyle:"butt",
          borderDash:[],
          borderDashOffset:0.0,
          borderJoinStyle:"miter",
          pointBorderColor:"#0b5b8c",
          pointBackgroundColor: "rgb(255, 255, 255)",
          pointBorderWidth: 10,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgb(0, 0, 0)",
          pointHoverBorderColor: "rgba(220, 220, 220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [7,15,1]
        },
        {
          label:"Happy",
          fill:false,
          lineTension:0.4,
          backgroundColor:"#11b835",
          borderColor:"#11b835",
          borderCapStyle:"butt",
          borderDash:[],
          borderDashOffset:0.0,
          borderJoinStyle:"miter",
          pointBorderColor:"#11b835",
          pointBackgroundColor: "rgb(255, 255, 255)",
          pointBorderWidth: 10,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgb(0, 0, 0)",
          pointHoverBorderColor: "rgba(220, 220, 220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [4,2,13]
        },
        {
          label:"Anxious",
          fill:false,
          lineTension:0.4,
          backgroundColor:"#e34d12",
          borderColor:"#e34d12",
          borderCapStyle:"butt",
          borderDash:[],
          borderDashOffset:0.0,
          borderJoinStyle:"miter",
          pointBorderColor:"#e34d12",
          pointBackgroundColor: "rgb(255, 255, 255)",
          pointBorderWidth: 10,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgb(0, 0, 0)",
          pointHoverBorderColor: "rgba(220, 220, 220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [8,1,7]
        },
        {
          label:"Okay",
          fill:false,
          lineTension:0.4,
          backgroundColor:"#d4c746",
          borderColor:"#d4c746",
          borderCapStyle:"butt",
          borderDash:[],
          borderDashOffset:0.0,
          borderJoinStyle:"miter",
          pointBorderColor:"d4c746",
          pointBackgroundColor: "rgb(255, 255, 255)",
          pointBorderWidth: 10,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgb(0, 0, 0)",
          pointHoverBorderColor: "rgba(220, 220, 220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [15,6, 16]
        }
      ]
    }
  };
  }

  componentDidMount() {
    this._isMounted = true;
    this.handleName(this._isMounted);
    this.handleMoodWeekly(this._isMounted);
    this.handleMoodMonthly(this._isMounted)
  }

  handleName(isMounted) {
    var user = Firebase.auth().currentUser;
    var uid;
    if (user != null) {
      uid = user.uid;
    }
    Firebase.firestore()
      .collection("Users")
      .doc(uid)
      .get()
      .then(doc => {
        {if(isMounted){
          this.setState({ username: doc.data().name });
          }
        }
      });
  }

  handleMoodWeekly(isMounted) {
    let today = new Date();
    let lastWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 14
    );

    var user = Firebase.auth().currentUser;
    var uid;
    if (user != null) {
      uid = user.uid;
    }
    Firebase.firestore()
      .collection("MoodCollection")
      .where("userID", "==", uid)
      .where("date", ">", lastWeek)
      .where("date", "<", today)
      .get()
      .then(docs => {
        {
          docs.forEach(doc => {
            const { date, mood } = doc.data();
            if(isMounted){
            this.setState({
              mood_history_weekly: this.state.mood_history_weekly.concat({
                mood: mood,
                date: date.toDate()
              })
            });
            }
          });
        }
        this.handleDepressed();
      });
  }
  handleMoodMonthly(isMounted){
    let date = new Date();
    let thisMonth = new Date(date.getFullYear(), date.getMonth());
    let nextMonth = new Date(date.getFullYear(), date.getMonth() + 1);
    let lastMonth = new Date(date.getFullYear(), date.getMonth() - 1);
    let lastTwoMonths = new Date( date.getFullYear(), date.getMonth() - 2);
    var user = Firebase.auth().currentUser;
    var uid;
    if (user != null) {
      uid = user.uid;
    }
    Firebase.firestore()
      .collection("MoodCollection")
      .where("userID", "==", uid)
      .where("date", ">", thisMonth)
      .where("date", "<", nextMonth )
      .get()
      .then(thisMonthMoods => {
        var data = []
        var happyCount = 0;
        var sadCount = 0;
        var okayCount = 0;
        var anxiousCount = 0;
        thisMonthMoods.forEach ( thisMonth => {
          const { mood } = thisMonth.data();
          if(mood=='happy'){
            happyCount++;
          } else if (mood =='sad'){
            sadCount++;
          } else if (mood == 'okay') {
            okayCount++;
          }  else if(mood == 'anxious'){
            anxiousCount++;
          }
        });
        data.push(happyCount, sadCount, okayCount, anxiousCount);
        if(isMounted){
          this.setState({mood_history_monthly:this.state.mood_history_monthly.concat({date:"thisMonth", data:data})
          });
        }
      });
    Firebase.firestore()
      .collection("MoodCollection")
      .where("userID", "==", uid)
      .where("date", ">", lastMonth)
      .where("date", "<", thisMonth )
      .get()
      .then(lastMonthMoods => {
        var data = []
        var happyCount = 0;
        var sadCount = 0;
        var okayCount = 0;
        var anxiousCount = 0;
        lastMonthMoods.forEach ( lastMonth => {
          const {  mood } = lastMonth.data();
          if(mood=='happy'){
            happyCount++;
          } else if (mood =='sad'){
            sadCount++;
          } else if (mood == 'okay') {
            okayCount++;
          }  else if(mood == 'anxious'){
            anxiousCount++;
          }
        });
        data.push(happyCount, sadCount, okayCount, anxiousCount);
        if(isMounted){
          this.setState({mood_history_monthly:this.state.mood_history_monthly.concat({date:"previousMonth", data:data})
          });
        }
      });
      Firebase.firestore()
      .collection("MoodCollection")
      .where("userID", "==", uid)
      .where("date", ">", lastTwoMonths)
      .where("date", "<", lastMonth )
      .get()
      .then(lastTwoMonths => {
        var data = []
        var happyCount = 0;
        var sadCount = 0;
        var okayCount = 0;
        var anxiousCount = 0;
        lastTwoMonths.forEach ( lastTwoMonth => {
          const { mood } = lastTwoMonth.data();
          if(mood=='happy'){
            happyCount++;
          } else if (mood =='sad'){
            sadCount++;
          } else if (mood == 'okay') {
            okayCount++;
          }  else if(mood == 'anxious'){
            anxiousCount++;
          }
         });
         data.push(happyCount, sadCount, okayCount, anxiousCount);
        if(isMounted){
          this.setState({mood_history_monthly:this.state.mood_history_monthly.concat({date:"lastTwoMonths", data:data})})
        }
      });
    }
  handleDepressed() {
    var happyCount = 0;
    var sadCount = 0; 
    var anxiousCount = 0;
    var okayCount = 0;
    var updatedData = [];
    for (var x = 0; x < this.state.mood_history_weekly.length; x++){
      if(this.state.mood_history_weekly[x].mood === "happy"){
        happyCount++;
      } else if (this.state.mood_history_weekly[x].mood ==="sad"){
        sadCount++;
      } else if (this.state.mood_history_weekly[x].mood === "okay"){
        okayCount++;
      } else {
        anxiousCount++;
      }
    }
    updatedData.push(sadCount, happyCount, anxiousCount, okayCount);
    var datasetsCopy = this.state.dataDoughnut.datasets.slice(0);
    var dataCopy = updatedData;
    datasetsCopy[0].data = dataCopy;
    this.setState({
      dataDoughnut: Object.assign({}, this.state.dataDoughnut, {
        datasets: datasetsCopy
      })
    });
    for (var i = 0; i < updatedData.length; i++){
      if (updatedData[0] >= 14){
        this.setState({generalstate:"depressed"});
      } else {
        this.setState({generalstate:"good"});
      }
    }
  }

  render() {
    return (
      <div className="widget-container">
        <Row>
        <Col>
        <div className = "widget-box">
          <Doughnut data={this.state.dataDoughnut} options={{ responsive: true }} />
        </div>
        </Col>
        <Col>
        <div className = "widget-box">
            <Line data={this.state.dataLine} options={{responsive:true}} />
        </div>
        </Col>
        </Row>
        <Row>
          <div className="widget-box tip-container">
            <Row>
              <FontAwesomeIcon icon={faLightbulb} size="2x" className="icon"/> 
              {this.state.generalstate === "depressed" ? (<p> Tip of the day for {this.state.username}: when things get hard, stay strong! Perhaps a walk outside will help.  </p>) : (<p> Tip of the day for {this.state.username}: remember to always count your blessings. Take a moment to reflect!</p>)}
            </Row>
            </div>
        </Row>
        {this.state.generalstate === "depressed" ? (<Row>
          <div className="widget-box tip-container">
            <Row>
              <FontAwesomeIcon icon={faExclamationTriangle} size="2x" className="icon"/> 
              <p> You may be showing signs of depression. We recommend speaking to a health professional.</p>
            </Row>
            </div>
        </Row>) : null}
        
      </div>
    );
  }
}

export default InternalOverview;
