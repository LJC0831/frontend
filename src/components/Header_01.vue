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
            <label for="username">사용자 이름:</label>
            <input type="text" v-model="username" id="username" />
            <label for="password">비밀번호:</label>
            <input type="password" v-model="password" id="password" />
            <button @click="login">로그인</button>
          </div>
          <div class="close-button" @click="showLoginModal = false">X</div>
        </div>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    data() {
      return {
        showLoginModal: false,
        username: "",
        password: "",
      };
    },
    methods: {
      login() {
        // 로그인 로직 추가
        // 예: 사용자 이름과 비밀번호를 검사하고 인증 후 로그인 처리
        // 이후에 isLoggedIn 변수를 true로 설정하고, 서버와 통신하여 로그인 상태를 관리할 수 있습니다.
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