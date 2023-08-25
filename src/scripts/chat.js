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
          
    },

  };