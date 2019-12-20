import zerorpc
from nltk.corpus import wordnet as wn
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfTransformer, CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd 
import pickle
import numpy as np
import keras
from keras.models import load_model
class PythonServer(object):
    def tokenizer(self, passage):
        stop_words = (stopwords.words('english'))
        additional_stop_words = ['yes', 'yeah', 'yep', 'the']
        stop_words.extend(additional_stop_words)
        stop_words = set(stop_words)
        words = set(word_tokenize(passage))
        words = [word.lower() for word in words if word.isalpha()] 
        filtered = [word for word in words if not word in stop_words]
        return filtered
    def lemmatization(self, word):
        lemmatized = []
        lemmatizer = WordNetLemmatizer()
        for each in word:
            lemmatized.append(lemmatizer.lemmatize(each))
        return lemmatized
    def synonym(self, word): 
        synonym_list = []
        for syn in wn.synsets(word):
            for name in syn.lemma_names():
                if(name not in synonym_list):
                    synonym_list.append(name.split(".")[0].replace('_',' '))
                    print(name)
            for sim in syn.similar_tos():
                for name in sim.lemma_names():
                    synonym_list.append(name)
                    print(name)
        synonym_list = set(synonym_list)
        synonym_list = list(set(synonym_list))
        return (synonym_list)     
    def preprocess_agent_original(self, documentList):
        processed_list = {}
        for doc in documentList:
            token = self.tokenizer(documentList[doc])
            lemmatize = self.lemmatization(token)
            processed_list[doc] = lemmatize
        return processed_list
    def preprocess_agent_extended(self, documentList):
        processed_list = {}
        for doc in documentList:
            token = self.tokenizer(documentList[doc])
            lemmatize = self.lemmatization(token)
            for each in lemmatize:
                synonym = self.synonym(each)
            lemmatize += synonym
            processed_list[doc] = lemmatize
        return processed_list
    def buildTDMatrices(self, processedDocs):
        for doc in processedDocs:
            processedDocs[doc] = ' '.join(processedDocs[doc])
        documents = [processedDocs['happy'], processedDocs['sad'], processedDocs['anxious'], processedDocs['okay'], processedDocs['stress']]
        transformer = TfidfTransformer()
        vectorizer = CountVectorizer()
        vec_train = transformer.fit_transform(vectorizer.fit_transform(documents))
        pickle.dump(vectorizer.vocabulary_, open("Dataset/dictionary.pkl", "wb"))
        pickle.dump(vec_train, open("Dataset/tfidf.pkl", "wb"))
    def save_model(self, documentList):
        #incase some updates on the intent list from dialogflow and need to retrain
        processedDocs = self.preprocess_agent_extended(documentList)
        self.buildTDMatrices(processedDocs)
    def get_prediction_baseline(self, query):
        #new tfidfVectorizer with old vocabulary
        transformer = TfidfTransformer()
        loaded_vec = CountVectorizer(vocabulary=pickle.load(open("Dataset/dictionary.pkl", "rb")))
        trained_model = pickle.load(open("Models/Baseline/tfidf.pkl", "rb")).todense()
        fit_query = transformer.fit_transform(loaded_vec.fit_transform([query])).todense()
        cosineScores = cosine_similarity(trained_model, fit_query).flatten()
        if(np.count_nonzero(cosineScores) != 0):
            top = cosineScores.argsort()[:-2:-1]
        else:
            top = [5]
        return int(top[0])
    def get_prediction_neural(self, query):
        neural_model = load_model('Models/NeuralNetwork/trained_mlp.h5')
        print(neural_model)
try:
    pServer = zerorpc.Server(PythonServer().get_prediction_neural('hi'))
    pServer.bind("tcp://0.0.0.0:4242")
    pServer.run()
except Exception as e:
    print('Unable to start Python Server', e)
    raise e
