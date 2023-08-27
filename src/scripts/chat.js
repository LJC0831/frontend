/* eslint-disable */ 
import axios from "axios";

// axios 인스턴스 생성
const api = axios.create({
  baseURL: "https://port-0-backend-nodejs-20zynm2mlk2nnlwj.sel4.cloudtype.app",
  //baseURL: "http://localhost:3000",
});

export default {
    methods: {
        uploadImageToServer(formData, token, successCallback, errorCallback) {
            api.post('/api/upload', formData, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then(successCallback)
            .catch(errorCallback);
          },
          chatInsertUser(chat_id, userid, successCallback, errorCallback) {
            api.post('/api/char/userInsert', {chat_id, userid})
          .then(successCallback)
          .catch(errorCallback);
        },
          chatDeleteUser(chat_id, userid, successCallback, errorCallback) {
            api.delete('/api/char/userDelete', { data: { chat_id, userid } })
          .then(successCallback)
          .catch(errorCallback);
        },
          createChatRoom(subject, newPassword, user_id, successCallback, errorCallback) {
            api.post('/api/char/create', {subject, newPassword, user_id})
          .then(successCallback)
          .catch(errorCallback);
        },
          
    },

  };