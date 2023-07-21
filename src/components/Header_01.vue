<template>
    <header>
      
      <div class="login-container">
        <div class="header-name"> Memo App </div>
        <div class="login-button" @click="showLoginModal = true">
          <!-- 로그인 이미지를 추가하세요 -->
          <img
            class="login-image"
            src="/경로/로그인이미지.jpg"
            alt="로그인"
          />
        </div>
  
        <!-- 로그인 모달 -->
        <div v-if="showLoginModal" class="login-modal">
          <div class="login-form">
            <label for="username">아이디 :</label>&nbsp;
            <input type="text" v-model="username" id="username" />&nbsp;
            <label for="password">비밀번호: </label>&nbsp;
            <input type="password" v-model="password" id="password" />&nbsp;
            <button @click="login">로그인</button>&nbsp;
            <button @click="cancel">취소</button>&nbsp;
          </div>
          <div class="close-button" @click="showLoginModal = false">X</div>
        </div>
      </div>
    </header>
  </template>
  
  <script>
  /* eslint-disable */
  import axios from "axios";
  import {reactive} from "vue";
  import { mapActions } from 'vuex'

  export default {
    data() {
      return {
        showLoginModal: false,
        username: "",
        password: "",
      };
    },
    methods: {
            ...mapActions(["setToken"]),
            login() {
              const api = axios.create({
              baseURL: "https://port-0-backend-nodejs-20zynm2mlk2nnlwj.sel4.cloudtype.app",
              });

              const state = reactive({
                  data : [],
              });

              api.post("/api/user", {username: this.username, password: this.password}).then((res)=>{
                if (res.data.message === "로그인 성공") {
                  alert("로그인에 성공했습니다!");

                  // 토큰을 Vuex에 저장
                  this.setToken(res.data.token);
                  
                  this.showLoginModal = false; // 로그인 성공 시 모달 닫기
                  this.username = ""; // 입력한 사용자 이름 초기화
                  this.password = ""; // 입력한 비밀번호 초기화
                } 
              }) 
              .catch((error) => {
                console.error("로그인 오류:", error);
                alert("아이디 패스워드가 틀립니다. ");
              });
            },

            cancel() {
              this.showLoginModal = false; // 취소 버튼 클릭 시 모달 닫기
              this.username = ""; // 입력한 사용자 이름 초기화
              this.password = ""; // 입력한 비밀번호 초기화
            },
          },
  };
  </script>
  
  <style scoped>
  header {
    text-align: center;
    padding: 25px;
    border-bottom: 1px solid #eee;
    background: #f7f7f7;
  }
  
  .login-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  
  .login-button {
    margin-left: auto; /* 이미지 버튼을 오른쪽으로 이동 */
    cursor: pointer; /* 버튼 모양을 나타내기 위해 커서 모양 변경 */
  }
  
  .login-image {
    width: 30px;
    height: 30px;
    /* 원하는 이미지 크기에 맞게 조절 */
  }
  
  /* 로그인 모달 스타일 */
  .login-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .login-form {
    background: #fff;
    padding: 20px;
    border-radius: 5px;
  }
  
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }

  .header-name {
    margin-left: auto; /* 이미지 버튼을 오른쪽으로 이동 */
  }
  </style>