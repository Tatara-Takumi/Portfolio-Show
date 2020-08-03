import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from "unstated"

import firebase from 'firebase/app';
import "firebase/firestore"
import 'firebase/analytics';
import ENV from "./env.json";

const config = {
  apiKey: ENV.FIREBASE_API_KEY,
  authDomain: ENV.FIREBASE_AUTH_DOMAIN,
  databaseURL: ENV.FIREBASE_DB_URL,
  projectId: ENV.FIREBASE_PRJ_ID,
  storageBucket: ENV.FIREBASE_STORAGE,
  messagingSenderId: ENV.FIRE_MESSAGINGSENDERID,
  appId: ENV.FIREBASE_APPID,
  measurementId: ENV.FIREBASE_MEASUREMENTID,
}

firebase.initializeApp(config);
firebase.analytics();

ReactDOM.render(
    <Provider>
      <App />
    </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
