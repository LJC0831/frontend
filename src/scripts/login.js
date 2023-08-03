/* eslint-disable */ 
import axios from "axios";

export default {
  methods: {
    login(username, password, successCallback, errorCallback) {
      const api = axios.create({
        baseURL: "https://port-0-backend-nodejs-20zynm2mlk2nnlwj.sel4.cloudtype.app",
      });

      api.post("/api/user", { username, password })
        .then(successCallback)
        .catch(errorCallback);
    },
    signup(newUserId, newPassword, newName, successCallback, errorCallback) {
      const api = axios.create({
        baseURL: "https://port-0-backend-nodejs-20zynm2mlk2nnlwj.sel4.cloudtype.app",
      });
      api.post("/api/signup", {
        userId: newUserId,
        password: newPassword,
        name: newName,
      })
        .then(successCallback)
        .catch(errorCallback);
    },
    profileSearch(userid, successCallback, errorCallback) {
      const api = axios.create({
        baseURL: "https://port-0-backend-nodejs-20zynm2mlk2nnlwj.sel4.cloudtype.app",
      });
      api.post("/api/profileSearch", {
        userId: userid,
      })
        .then(successCallback)
        .catch(errorCallback);
    },
    profileAdj(userid, username, file_no, successCallback, errorCallback) {
      const api = axios.create({
        baseURL: "https://port-0-backend-nodejs-20zynm2mlk2nnlwj.sel4.cloudtype.app",
      });
      api.post("/api/profileAdj", {
        userId: userid,
        username: username,
        file_no: file_no,
      })
        .then(successCallback)
        .catch(errorCallback);
    },
  },
};
