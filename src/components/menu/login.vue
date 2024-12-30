<template>
    <div class="main_content_30">
      <span><h2>로그인</h2></span>
      <div class="resist_top_30">
        <label id="font_color_01">간편가입</label>
      </div>

      <div class="resist_top_30">
      <div class="OAuth-button">
        <a :href="kakao_url"><img src="@/assets/kakao_login.png" style="max-height: 40px; margin-left:5px;margin-top:5px;"></a>
      </div>
      </div>

      <div class="resist_top_30">
              <label id="font_color_01">이메일</label>
      </div>
      <input type="text" class="search-input" placeholder="이메일 입력" v-model="user_id" @keyup.enter="login()"/>

      <div class="resist_top_30">
            <label id="font_color_01">패스워드</label>
      </div>
      <input type="password" class="search-input" placeholder="패스워드 입력"  v-model="user_pwd" @keyup.enter="login()"/>

      <div class="resist_top_30">
        <div class="regist-div">
            <button class="login_btn"  @click="login()" @keyup.enter="login()">로그인</button>
            <button class="login_btn"  >회원가입</button>
        </div>
      </div>

      <!-- 로딩영역 -->
      <div class="loading-overlay" v-if="loading">
        <img src="@/assets/loading.gif" alt="로딩 중" class="loading-spinner" />
      </div>

    </div>
  </template>
  
  <script>
  /* eslint-disable */
  import { mapActions } from 'vuex';
  import loginMethods from '@/scripts/login.js';

  export default {
    name: 'login',
    data() {
      return {
        loading: false, // 로딩 상태 추가 true면 로딩처리
        user_id: null,
        user_pwd: null,
      };
    },
    created() {

    },
    mounted() {
    
    },
    methods: {
      ...mapActions(["setToken"]),
      login() {
            this.loading = true; //로딩 상태 활성화
              loginMethods.methods.login(escapeString(this.user_id), this.user_pwd, (res) => {
                    // 토큰을 Vuex에 저장
                  this.setToken(res.data.token);
                  // 토큰을 로컬 스토리지에 저장
                  localStorage.setItem("token", res.data.token);

                  this.user_id = ""; // 입력한 사용자 이름 초기화
                  this.user_pwd = ""; // 입력한 비밀번호 초기화
                  const url = window.location.href;
                  const baseUrl = url.split('/').slice(0, 3).join('/');
                  window.location.href = baseUrl;
                  alert('로그인에 성공했습니다!');
                },
                (error, res) => {
                  if(error.response.status === 401){
                    commons.showToast(this, '존재하지 않는 이메일입니다.');
                  } else if(error.response.status === 402){
                    commons.showToast(this, '패스워드가 틀렸습니다.');
                  } else {
                    alert("네트워크에 문제가 발생했습니다.");
                  }
                  console.error("로그인 오류:", error);
                  this.showLoginModal = false; // 로그인 성공 시 모달 닫기
                  this.username = ""; // 입력한 사용자 이름 초기화
                  this.password = ""; // 입력한 비밀번호 초기화
                }
              );
            this.loading = false; //로딩 상태 활성화
          },
    }
  };

  function escapeString(str) {
  // 이스케이핑 로직을 구현
  // 예: '를 ''로 대체하여 SQL Injection 방지
  return str.replace(/'/g, "''");
}
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  
  <style scoped src="@/styles/common.css"></style>
  <style scoped src="@/styles/login.css"></style>