<template>
    <div class="main_content_30">
      <span><h2>회원가입</h2></span>
      <div class="resist_top_30">
        <label id="font_color_01">간편로그인</label>
      </div>

      <div class="resist_top_30">
      <div class="OAuth-button">
        <a :href="kakao_url"><img src="@/assets/kakao_login.png" style="max-height: 40px; margin-left:5px;margin-top:5px;"></a>
      </div>
      </div>

      <div class="resist_top_30">
              <label id="font_color_01">이메일</label>
      </div>
      <input type="text" class="search-input" placeholder="이메일 입력" v-model="newUserId" />
      <button @click="emailCheck(newUserId)" class="login_btn" v-if="!mailCheck">인증하기</button>

      <div class="resist_top_30" v-if="mailCheck && !signUpAppr">
              <label id="font_color_01">인증번호</label>
      </div>
      <input v-if="mailCheck && !signUpAppr" type="text" v-model="checkNumberInput" class="search-input" />
      <button v-if="mailCheck && !signUpAppr" @click="emailNumCheck(checkNumberInput)" class="login_btn">확인</button>&nbsp;

      <div class="resist_top_30">
            <label id="font_color_01">패스워드</label>
      </div>
      <input type="password" class="search-input" placeholder="패스워드 입력"  v-model="newPassword" />
      <input type="password" class="search-input" placeholder="패스워드 한번 더 입력"  v-model="newPassword2" />

      <div class="resist_top_30">
            <label id="font_color_01">이름</label>
      </div>
      <input type="text" class="search-input" placeholder="이름을 입력하세요" v-model="newName" />

      <div class="resist_top_30">
        <div class="regist-div">
            <button class="login_btn"  @click="signup()" @keyup.enter="signup()">회원가입</button>
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
  import OAuth from '@/scripts/OAuth.js';
  import loginMethods from '@/scripts/login.js';
  import * as commons from '@/scripts/common.js';

  export default {
    name: 'signup',
    data() {
      return {
        loading: false, // 로딩 상태 추가 true면 로딩처리
        kakao_url: `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.VUE_APP_KAKAO_CLIENT_ID}&redirect_uri=${process.env.VUE_APP_KAKAO_REDIRECT_URL}&response_type=code`,
        newUserId: null,
        newPassword: null,
        newPassword: null,
        newName: null,
        mailCheck:false, //메일체크여부
        signUpAppr:false, //인증완료처리 (회원가입)
        isValidEmail:'',
        checkNumberInput:null,
      };
    },
    created() {

    },
    mounted() {
      OAuth.handleKakaoCallback(this.getKakaoToken); // 카카오 콜백처리
    
    },
    methods: {
      ...mapActions(["setToken"]),
      getKakaoToken(code) {
        OAuth.getKakaoToken(code, this.getKakaoUserInfo, this.$data);
      },
      getKakaoUserInfo(accessToken) {
        OAuth.getKakaoUserInfo(accessToken, this.setToken, this.$data);
      },
      signup() {
        if(this.newPassword !== this.newPassword2){
              commons.showToast(this, '패스워드가 일치하지 않습니다. 다시확인해주세요.');
              return;
            }
            if(this.newPassword.length < 8){
              commons.showToast(this, '패스워드는 8자리 이상 입력해주세요.');
              return;
            }
            if(this.isValidEmail !== this.newUserId){
              commons.showToast(this, '인증한 이메일과 가입하려는 이메일이 다릅니다. 처음부터 다시 진행해주세요.');
              this.mailCheck = false;
              this.signUpAppr = false;
              this.isValidEmail = '';
              this.newUserId = null;
              this.checkNumberInput = null;
              return;
            }
            if(this.signUpAppr){
              loginMethods.methods.signup(
                this.newUserId,
                this.newPassword,
                this.newName,
                this.newGender,
                (res) => {
                  alert("회원가입에 성공했습니다!");
                  this.showSignupModal = false;
                  this.newUserId = "";
                  this.newPassword = "";
                  this.newName = "";
                  this.mailCheck = false;
                  $this.router.push('/login');
                },
                (error) => {
                  // 에러 콜백
                  if(error.response.status === 400){
                    commons.showToast(this, '이미 사용 중인 이메일 입니다.');
                  } else {
                    commons.showToast(this, '회원가입 중 오류가 발생했습니다. 관리자에게 문의하세요.');
                  }
                  console.error("회원가입 오류:", error);
                  
                  this.signUpAppr = false;
                  this.mailCheck = false;
                }
              );
            } else {
              commons.showToast(this, '이메일 인증해주세요.');
              return;
            }
          },
          // 메일인증
          emailCheck(email) {
            function isValidEmail(email) {
              // 이메일 형태를 확인하는 정규표현식
              const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
              return emailPattern.test(email);
            }

            if (!isValidEmail(email)) {
              commons.showToast(this, '유효한 이메일이 아닙니다.');
              return;
            } 
            let randomNumber = '';
            for (let i = 0; i < 6; i++) {
              const digit = Math.floor(Math.random() * 10); // 0부터 9까지의 난수 생성
              randomNumber += digit.toString();
            }
            this.checkNumber = randomNumber;
            loginMethods.methods.emailCheck(
              email,
              this.checkNumber,
              (res) => {
                commons.showToast(this, '메일확인 후 인증번호를 입력하세요!');
                this.mailCheck = true;
                this.isValidEmail = email;
              },
              (error) => {
                // 에러 콜백
                console.error("이메일 인증오류:", error);
                commons.showToast(this, '인증오류입니다. 문의바랍니다.');
              }
            );
          },
          //메일인증비교
          emailNumCheck(checkNumberInput){
            if(this.checkNumber === checkNumberInput){
              commons.showToast(this, '인증되었습니다.');
                this.signUpAppr = true; 
            } else {
              commons.showToast(this, '인증번호가 일치하지 않습니다. 다시확인해주세요.');
            }
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