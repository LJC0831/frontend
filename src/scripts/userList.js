/* eslint-disable */ 
import axios from "axios";
import { baseURL } from "./common.js";

// axios 인스턴스 생성
const api = axios.create({
  baseURL: baseURL,
});

export default {
    methods: {
        searchUserList(userid, successCallback, errorCallback) {
          api.post('/api/chat/searchUserList', {userid})
        .then(successCallback)
        .catch(errorCallback);
        },
        saveUserList(loginId, userid, applContent, successCallback, errorCallback) {
          api.post('/api/chat/saveUserList', {loginId, userid, applContent})
        .then(successCallback)
        .catch(errorCallback);
        },
        createUserList(loginId, userid, successCallback, errorCallback) {
          api.post('/api/chat/createUserList', {loginId, userid})
        .then(successCallback)
        .catch(errorCallback);
        },
        deleteUserList(loginId, userid, successCallback, errorCallback) {
            api.post('/api/chat/deleteUserList', {loginId, userid})
          .then(successCallback)
          .catch(errorCallback);
        },
          
    },

  };