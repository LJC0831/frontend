/* eslint-disable */ 
import axios from "axios";

// axios 인스턴스 생성
const api = axios.create({
  baseURL: "https://port-0-backend-nodejs-20zynm2mlk2nnlwj.sel4.cloudtype.app",
  //baseURL: "http://localhost:3000",
});

export default {
  methods: {
    login(username, password, successCallback, errorCallback) {
      api.post("/api/user", { username, password })
        .then(successCallback)
        .catch(errorCallback);
    },
    signup(newUserId, newPassword, newName, successCallback, errorCallback) {
      api.post("/api/signup", {
        userId: newUserId,
        password: newPassword,
        name: newName,
      })
        .then(successCallback)
        .catch(errorCallback);
    },
    emailCheck(email, checkNumber, successCallback, errorCallback) {
      api.post("/api/emailCheck", {
        email: email,
        checkNumber: checkNumber,
      })
        .then(successCallback)
        .catch(errorCallback);
    },
    profileSearch(userid, successCallback, errorCallback) {
      api.post("/api/profileSearch", {
        userId: userid,
      })
        .then(successCallback)
        .catch(errorCallback);
    },
    profileImgURL(fileNo, successCallback, errorCallback) {
      api.get("/api/get-profile-image-url", {
        params: {
          fileNo: fileNo,
        },
      })
        .then(successCallback)
        .catch(errorCallback);
    },
    profileAdj(userid, username, file_no, successCallback, errorCallback) {
      api.post("/api/profileAdj", {
        userId: userid,
        username: username,
        file_no: file_no
      })
        .then(successCallback)
        .catch(errorCallback);
    },
  },
};
