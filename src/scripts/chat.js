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
            api.post('/api/chat/userInsert', {chat_id, userid})
          .then(successCallback)
          .catch(errorCallback);
        },
          chatDeleteUser(chat_id, userid, successCallback, errorCallback) {
            api.delete('/api/chat/userDelete', { data: { chat_id, userid } })
          .then(successCallback)
          .catch(errorCallback);
        },
          createChatRoom(subject, newPassword, user_id, expire_cnt, successCallback, errorCallback) {
            api.post('/api/chat/create', {subject, newPassword, user_id, expire_cnt})
          .then(successCallback)
          .catch(errorCallback);
        },
          createChatRoom02(chat_id, userid, successCallback, errorCallback) {
            api.post('/api/chat/create02', {chat_id, userid})
          .then(successCallback)
          .catch(errorCallback);
        },
        chatUserSearch(chat_id, successCallback, errorCallback) {
          api.post('/api/chat/chatUserSearch', {chat_id})
        .then(successCallback)
        .catch(errorCallback);
        },         
    },

  };