const express = require("express");
const dialogflow = require("dialogflow");
var zerorpc = require("zerorpc");

const app = express();

const PORT = 5000;

const projectId = `${process.env.REACT_APP_PROJECT_ID}`;
const languageCode = "en";
var config = {
  credentials: {
    private_key:`${process.env.REACT_APP_PRIVATE_KEY}` ,
    client_email:`${process.env.REACT_APP_CLIENT_EMAIL}`
  }
};
const sessionClient = new dialogflow.SessionsClient(config);
const intentClient = new dialogflow.IntentsClient(config);

var client = new zerorpc.Client();
client.connect("tcp://127.0.0.1:4242");

// Api Endpoints

//Detect intent from user message
app.get("/api/detectIntent/:sessionId/:message",async (req, res) =>{
  var sessionId = req.params.sessionId;
  var messages = [req.params.message];
  //execute detection
  let response = await executeQueries(projectId, sessionId, messages, languageCode);
  try {
    var fulfillmentTexts = [];
    var responseList = {};
    //if default intent detected then run additional model
    if (response.intent.displayName == 'Default Fallback Intent'){
      runVSM(req.params.message, sessionId, successResponse => {
        fulfillmentTexts.push(successResponse.fulfillmentText);
        responseList['fulfillmentText'] = fulfillmentTexts;
        responseList['detectedIntent'] = successResponse.intent.displayName;
        res.json(responseList);
      }, errorResponse => {
        console.log(errorResponse);
      })
    } else {
    fulfillmentTexts.push(response.fulfillmentText);
    responseList['fulfillmentText'] = fulfillmentTexts;
    responseList['detectedIntent'] = response.intent.displayName;
    res.json(responseList);
    }
  } catch (error) {
    console.log(error);
  }  
});

/* NLP Section */

async function runVSM(query, sessionId, successCallback, errorCallback){
  newQuery = [];
  let intent_list = await getIntentList();
  try{
    client.invoke("get_prediction_neural", intent_list, query, async function(err, res, more){
      console.log(res);
      if(res === 0){
        newQuery.push('i am happy');
      } else if (res === 1){
        newQuery.push('i am sad');
      } else if (res === 2) {
        newQuery.push('i am anxious');
      } else if (res == 3) {
        newQuery.push('i am okay');
      } else if (res == 4){
        newQuery.push('i am stressed');
      } else {
        newQuery.push('default');
      }
      let response = await executeQueries(projectId, sessionId, newQuery, languageCode);
    try {
      successCallback(response);
    } catch (error){
      errorCallback(error);
    }
    });
  } catch (error) {
    console.log(error);
  }
}
/* Get intent list from dialogflow and transform it before sending for additional ML tasks */
async function getIntentList(){
  var tmpDict = [];
  const formattedParent = intentClient.projectAgentPath(projectId);
  const responses = await intentClient.listIntents({parent: formattedParent, intentView:"INTENT_VIEW_FULL"});
  try {
    for (const resource of responses[0]) {
      if(resource.displayName == 'happy' || resource.displayName =='sad' || resource.displayName =='okay' || resource.displayName == 'stress' || resource.displayName == 'anxious'){
        for(part in resource.trainingPhrases){
          var parts = resource.trainingPhrases[part].parts;
          for(p in parts){
            tmpDict.push({"intent":resource.displayName, "training_phrases":parts[p].text});
          }
        }
      }
    }
    intent_dictionary = tmpDict.reduce(function(r, a) {
      r[a.intent] = r[a.intent] || '';
      r[a.intent] += ' ' + a.training_phrases;
      return r;
    }, {});
    return intent_dictionary;
    } catch (error){
      console.log(error);
    }
}
/* Code snippets below adjusted from official DialogFlow API documentation */
async function detectIntent(
  projectId,
  sessionId,
  query,
  contexts,
  languageCode
) {
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode
      }
    }
  };

  if (contexts && contexts.length > 0) {
    request.queryParams = {
      contexts: contexts
    };
  }

  const responses = await sessionClient.detectIntent(request);
  return responses[0];
}

async function executeQueries(projectId, sessionId, queries, languageCode) {
  if (!queries || !queries.length) {
    return;
  }
  // Keeping the context across queries let's us simulate an ongoing conversation with the bot
  let context;
  let intentResponse;
  for (const query of queries) {
    try {
      intentResponse = await detectIntent(
        projectId,
        sessionId,
        query,
        context,
        languageCode
      );
      // Use the context from this response for next queries
      context = intentResponse.queryResult.outputContexts;
      return intentResponse.queryResult;
    } catch (error) {
      console.log(error);
    }
  }
}
app.listen(PORT);
console.log("Server app listening on port: " + PORT);
