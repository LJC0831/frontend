/* eslint-disable */ 
import axios from "axios";
import { baseURL } from "./common.js";

// axios 인스턴스 생성
const api = axios.create({
  baseURL: baseURL,
});

export default {
  methods: {
    login(username, password, successCallback, errorCallback) {
      api.post("/api/chat/login", { username, password })
        .then(successCallback)
        .catch(errorCallback);
    },
    Oauthlogin(uesrId, username, successCallback, errorCallback) {
      api.post("/api/oauth/user", { uesrId, username })
        .then(successCallback)
        .catch(errorCallback);
    },
    signup(newUserId, newPassword, newName, newGender,successCallback, errorCallback) {
      api.post("/api/signup", {
        userId: newUserId,
        password: newPassword,
        name: newName,
        newGender: newGender,
      })
        .then(successCallback)
        .catch(errorCallback);
    },
    changePwd(searchUserId, searchPassword, successCallback, errorCallback) {
      api.post("/api/changePwd", {
        userId: searchUserId,
        password: searchPassword,
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
    profileAdj(userid, username, file_no, editIntro, successCallback, errorCallback) {
      api.post("/api/profileAdj", {
        userId: userid,
        username: username,
        file_no: file_no,
        editIntro: editIntro
      })
        .then(successCallback)
        .catch(errorCallback);
    },
    alarmSearch(userid, successCallback, errorCallback) {
      api.post("/api/alarmSearch", {
        userId: userid
      })
        .then(successCallback)
        .catch(errorCallback);
    },
  },
};
