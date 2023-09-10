<template>
  <header>
    <div class="login-container">
      <div class="header-name" @click="refreshPage"><img src="@/assets/main_logo.png" style="width: 60px; height: 60px; margin-top: -10px;"></div>
      <div class="login-button-container">
        <div v-if="!isLoggedIn" class="signup-button" @click="showSignupModal = true">
          <button class="signup-btn">회원가입</button>&nbsp;
        </div>
        <div v-if="!isLoggedIn" class="login-button" @click="showLoginModal = true">
          <!-- 로그인 이미지 대신 일반 버튼으로 변경 -->
          <button class="login-btn">로그인</button>
        </div>
        <div v-if="isLoggedIn" class="user-profile-button" @click="profileSearch('')">
          <img v-if="!profilePicture" src="@/assets/profile-user.png" alt="내 정보" class="profile-img" />
          <img v-if="profilePicture" :src="profilePicture" alt="프로필 사진" class="profile-img" />
        </div>
        <div v-if="isLoggedIn" class="logout-button" @click="logout">
          <button class="logout-btn">로그아웃</button>
        </div>
      </div>

      <!-- 로그인 모달 -->
      <div v-if="showLoginModal" class="login-modal">
      <div class="login-form">
        <h2>로그인</h2>
        <label for="username">이메일 :</label>&nbsp;
        <input type="text" v-model="username" id="username" @keydown.enter="login(null,null,'N')"/>&nbsp;
        <label for="password">비밀번호: </label>&nbsp;
        <input type="password" v-model="password" id="password" @keydown.enter="login(null,null,'N')"/>&nbsp;
        <button ref="loginButton" @click="login"  @keydown.enter="login(null,null,'N')" :disabled="loading">
          <span v-if="!loading">로그인</span>
          <span v-else>로딩 중...</span>
        </button>&nbsp;
        <button @click="cancel">취소</button>&nbsp;
        <div @click="loginWithGoogle" class="google-login">
          <img src="@/assets/google-icon.png" alt="구글로그인" class="google-login-image"/>Sign in with Google
        </div>
        <span @click="this.showSearchPwd = true; this.showLoginModal = false;"><label for="username" style="cursor: pointer;">비밀번호를 잊으셨나요?</label></span>
      </div>
    </div>
    <!-- 패스워드 찾기 모달 -->
    <div v-if="showSearchPwd" class="login-modal">
      <div class="login-form">
        <h2>패스워드 찾기</h2>
        <label for="searchUserId">아이디(인증가능한 이메일)</label>
        <input type="text" v-model="searchUserId" id="searchUserId" />
        <button @click="emailCheck(searchUserId)">인증하기</button>&nbsp;
        <label v-if="mailCheck && !signUpAppr2" for="checkNumber">인증번호</label>
        <input v-if="mailCheck && !signUpAppr2" type="text" v-model="checkNumberInput2"/>
        <button v-if="mailCheck && !signUpAppr2" @click="emailNumCheck(checkNumberInput2,20)">확인</button>&nbsp;
        <label for="searchPassword">비밀번호 </label>
        <input type="password" v-model="searchPassword" id="searchPassword" />
        <input type="password" v-model="searchPassword2" id="searchPassword2" />
        <button @click="searchPwd">변경하기</button>&nbsp;
        <button @click="cancelsearchPwd">취소</button>&nbsp;
      </div>
      <div class="close-button" @click="showSignupModal = false">X</div>
    </div>
    <!-- 회원가입 모달 -->
    <div v-if="showSignupModal" class="login-modal">
      <div class="login-form">
        <h2>회원가입</h2>
        <div @click="loginWithGoogle" class="google-login">
          <img src="@/assets/google-icon.png" alt="구글로그인" class="google-login-image"/>구글아이디로 로그인하기
        </div>
        <label for="newUserId">아이디(인증가능한 이메일)</label>
        <input type="text" v-model="newUserId" id="newUserId" />
        <button @click="emailCheck(newUserId)">인증하기</button>&nbsp;
        <label v-if="mailCheck && !signUpAppr" for="checkNumber">인증번호</label>
        <input v-if="mailCheck && !signUpAppr" type="text" v-model="checkNumberInput"/>
        <button v-if="mailCheck && !signUpAppr" @click="emailNumCheck(checkNumberInput,10)">확인</button>&nbsp;
        <label for="newPassword">비밀번호 </label>
        <input type="password" v-model="newPassword" id="newPassword" />
        <input type="password" v-model="newPassword2" id="newPassword2" />
        <label for="newName">이름 </label>
        <input type="text" v-model="newName" id="newName" />
        <label for="newName">성별 </label>
        <div class="radio-buttons">
          <label>남</label>
          <input type="radio" v-model="newGender" name="gender"  value="male" checked/>
          <label>여</label>
          <input type="radio" v-model="newGender" name="gender" value="female"/>
        </div>
        <button @click="signup">회원가입</button>&nbsp;
        <button @click="cancelSignup">취소</button>&nbsp;
      </div>
      <div class="close-button" @click="showSignupModal = false">X</div>
    </div>
    <!-- 내 정보 모달 -->
      <div v-if="isUserProfileModalVisible" class="login-modal">
        <div class="login-form">
          <h2>내 정보</h2>
          <!-- 프로필 사진 추가 -->
          <label>프로필사진</label>&nbsp;
          <div class="profile-picture-container">
            <img :src="profilePicture" alt="프로필 사진" class="profile-picture" />
          </div>
          <input v-if="!profilePicture || isEditingProfilePicture" type="file" @change="handleFileUpload" accept="image/*" />
          <button v-if="profilePicture && !isEditingProfilePicture" @click="startEditingProfilePicture">프로필사진편집</button>
          <label for="editName">이름:</label>
          <input type="text" v-model="editedName" id="editName" />&nbsp;

          <button @click="saveUserProfile" :disabled="loading">
            <span v-if="!loading">저장</span>
            <span v-else>로딩 중...</span>
          </button>&nbsp;
          <button @click="cancelUserProfile">취소</button>&nbsp;
        </div>
        <div class="close-button" @click="closeUserProfileModal">X</div>
      </div>
  </div>
  </header>
</template>

<script>
/* eslint-disable */
import { mapActions } from 'vuex';
import loginMethods from '../scripts/login.js';
import jwtDecode from 'jwt-decode';
import * as commons from '../scripts/common.js';
import axios from 'axios';

export default {
  data() {
    return {
      loading: false,
      loginUserId: null,
      showLoginModal: false,
      showSignupModal: false, // 회원가입 모달 표시 여부
      username: "",
      password: "",
      newUserId: "", // 회원가입용 새 아이디
      newPassword: "", // 회원가입용 새 비밀번호
      newName: "",
      newGender: "male",
      isLoggedIn: false, // 로그인 상태를 저장하는 데이터 속성
      isUserProfileModalVisible: false, // 내정보 모달 표시 여부 추가
      editedName: "", 
      profilePicture: null,
      file_no: null,
      isEditingProfilePicture: false, // 프로필사진수정여부
      maxFileSize: 4 * 1024 * 1024, // 1MB (메가바이트)
      mailCheck:false, //메일체크여부
      signUpAppr:false, //인증완료처리 (회원가입)
      signUpAppr2:false, //인증완료처리 (패스워드찾기)
      showSearchPwd:false, //패스워드찾기 팝업 활성화여부
    };
  },
  methods: {
          ...mapActions(["setToken"]),
          ...loginMethods.methods,
          refreshPage() {
            // 페이지 새로고침
            window.location.reload();
          },
          isMobile() {
            return window.innerWidth <= 800; // 600px 이하면 모바일로 판단
          },
          // 모달이 열릴 때 로그인 버튼으로 포커스를 이동
          focusLoginButton() {
            this.$refs.loginButton.focus();
          },
          // Google 로그인 처리 로직 추가
        async loginWithGoogle() {
          try {
            const url = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=' +
                        process.env.VUE_APP_apiKey +
                        '&redirect_uri=' +
                        process.env.VUE_APP_redirect_uri +
                        '&response_type=code' +
                        '&scope=email profile';
            window.location.href = url;
          } catch (error) {
            console.error('Google 로그인 오류:', error);
          }
        },

        async exchangeGoogleAuthCodeForAccessToken(Googlecode) {
          const client_id = process.env.VUE_APP_apiKey;
          const client_secret = process.env.VUE_APP_client_secret;
          const redirect_uri = process.env.VUE_APP_redirect_uri;
          const code = Googlecode; // Google 로그인 후 받은 인증 코드
          const grant_type = 'authorization_code';

          try {
            const response = await fetch('https://oauth2.googleapis.com/token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                client_id,
                client_secret,
                redirect_uri,
                code,
                grant_type,
              }),
            });

            if (response.ok) {
              const data = await response.json();
              const access_token = data.access_token;
              try {
                const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  method: 'GET',
                  headers: {
                    'Authorization': 'Bearer ' + access_token, // 액세스 토큰을 헤더에 추가
                  },
                });

                if (response.ok) {
                  const userData = await response.json();
                  // 여기에서 userData를 사용하여 원하는 작업을 수행할 수 있습니다.
                  this.login(userData.email, userData.name, 'Y'); // Vue 컴포넌트의 login 메서드 호출
                } else {
                  console.error('Google 사용자 정보 가져오기 실패:', response.status, response.statusText);
                }
              } catch (error) {
                console.error('Google 사용자 정보 가져오기 오류:', error);
              }

            } else {
              console.error('액세스 토큰 교환 실패:', response.status, response.statusText);
            }
          } catch (error) {
            console.error('액세스 토큰 교환 오류:', error);
          }
        },
          login(oauthUserId, oauthUsername, oauth_yn) {
            this.loading = true; //로딩 상태 활성화
            if(oauth_yn === 'Y'){ //구글로그인
              loginMethods.methods.Oauthlogin( oauthUserId, oauthUsername, (res) => { //아이디, 이름
                    // 토큰을 Vuex에 저장
                  this.setToken(res.data.token);

                  // 토큰을 로컬 스토리지에 저장
                  localStorage.setItem("token", res.data.token);

                  this.showLoginModal = false; // 로그인 성공 시 모달 닫기
                  this.username='';
                  this.newName='';
                  window.location.href = process.env.VUE_APP_redirect_uri;
                  alert("로그인에 성공했습니다!");
                },
                (error, res) => {
                  this.username='';
                  this.newName='';
                  alert("네트워크에 문제가 발생했습니다.");
                  console.error("로그인 오류:", error);
                  this.showLoginModal = false; // 로그인 성공 시 모달 닫기
                }
              );
            } else { //일반로그인
              loginMethods.methods.login( this.username, this.password, (res) => {
                    // 토큰을 Vuex에 저장
                  this.setToken(res.data.token);

                  // 토큰을 로컬 스토리지에 저장
                  localStorage.setItem("token", res.data.token);

                  this.showLoginModal = false; // 로그인 성공 시 모달 닫기
                  this.username = ""; // 입력한 사용자 이름 초기화
                  this.password = ""; // 입력한 비밀번호 초기화
                  window.location.reload();
                  alert("로그인에 성공했습니다!");
                },
                (error, res) => {
                  if(error.response.status === 401){
                    alert("존재하지 않는 이메일입니다.");
                  } else if(error.response.status === 402){
                    alert("패스워드가 틀렸습니다.");
                  } else {
                    alert("네트워크에 문제가 발생했습니다.");
                  }
                  console.error("로그인 오류:", error);
                  this.showLoginModal = false; // 로그인 성공 시 모달 닫기
                  this.username = ""; // 입력한 사용자 이름 초기화
                  this.password = ""; // 입력한 비밀번호 초기화
                }
              );
            }
            this.loading = false; //로딩 상태 활성화
          },
         
          logout() {
                // 로그아웃 처리 로직
                // 로컬 스토리지에서 토큰 제거
                localStorage.removeItem("token");
                // 로그인 상태를 false로 변경
                this.isLoggedIn = false;
          },
          // 내정보 조회
          profileSearch(job){
            const token = localStorage.getItem('token');
            if(token != null) {
              loginMethods.methods.profileSearch(this.loginUserId, (res) => {
                  this.editedName = res.data[0].user_nm;
                  // 이미지 URL 받아오기
                  if(res.data[0].img_id){
                    this.file_no = res.data[0].img_id;
                    try {
                      loginMethods.methods.profileImgURL(
                        res.data[0].img_id,
                          (res) => {
                            this.profilePicture = res.data.imageUrl;
                          },
                          (error) => {
                            // 에러 콜백
                            console.error("프로필 이미지 조회 오류:", error);
                          }
                        );
                    } catch (error) {
                      console.error('이미지 URL 조회 오류:', error);
                    }
                  }
                    if(job != "load"){
                      this.isUserProfileModalVisible = true;
                    }
                      
                    },
                    (error) => {
                      // 에러 콜백
                      console.error("프로필 조회 오류", error);
                    }
                  );
              }
          },
          // 내정보 수정
          saveUserProfile() {
            if(!commons.loginCheck()) return;
            const userid = this.loginUserId; // 사용자 아이디 추출

            // 이미지 URL 받아오기
            if(this.file_no){
                  try {
                    loginMethods.methods.profileImgURL(
                      this.file_no,
                        (res) => {
                          this.profilePicture = res.data.imageUrl;
                        },
                        (error) => {
                          // 에러 콜백
                          console.error("프로필 이미지 조회 오류:", error);
                        }
                      );
                  } catch (error) {
                    console.error('이미지 URL 조회 오류:', error);
                  }
                }
            loginMethods.methods.profileAdj( userid, this.editedName, this.file_no,
              (res) => {
                alert("수정완료 되었습니다.");
                this.isUserProfileModalVisible = false; // 데이터 속성을 수정하여 팝업을 닫도록 변경
                this.isEditingProfilePicture = false;
              },
              (error) => {
                // 에러 콜백
                console.error("내정보 수정 오류", error);
                alert("내정보 수정 오류발생");
              }
            );
            
            
          },
          //프로필사진 편집여부
          startEditingProfilePicture() {
            this.isEditingProfilePicture = true;
          },
          // 프로필사진 업로드      
          handleFileUpload(event){
            const file = event.target.files[0];

             // 파일 크기 확인
            if (file && file.size > this.maxFileSize) {
              alert("이미지 크기가 너무 큽니다. 4MB 이하의 이미지를 선택해주세요.");
              return;
            }
            const reader = new FileReader();

            reader.onloadend = () => {
              this.profilePicture = reader.result; // Update the profilePicture data property with the uploaded image
            };
            this.loading = true;
            if (file) {
              reader.readAsDataURL(file);
              const timestamp = Date.now();
              const uniqueFileName = `${timestamp}_${file.name}`;
              const formData = new FormData();
              formData.append('file', file);
              formData.append("fileName", encodeURIComponent(uniqueFileName)); // 파일명을 인코딩하여 formData에 추가
              const api = axios.create({
                baseURL: "https://port-0-backend-nodejs-20zynm2mlk2nnlwj.sel4.cloudtype.app",
                //baseURL: "http://localhost:3000",
              });
              // 파일 업로드 요청
              api.post('/api/upload', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // 토큰을 요청 헤더에 추가
                },
                }).then((response) => {
                        this.file_no = response.data.fileId;
                        alert('업로드 하였습니다.');
                        this.loading = false;
                    // 파일 업로드 성공 시 처리할 로직을 여기에 작성합니다.
                    // 예: 성공 메시지 출력, 업로드 결과를 다른 동작에 활용 등
                    })
            }
            
          },

          // 데이터 속성을 수정하여 팝업을 닫도록 변경
          cancelUserProfile() {
            this.isUserProfileModalVisible = false; 
            this.isEditingProfilePicture = false;
          },
          cancel() {
            this.showLoginModal = false; // 취소 버튼 클릭 시 모달 닫기
            this.username = ""; // 입력한 사용자 이름 초기화
            this.password = ""; // 입력한 비밀번호 초기화
          },

          // 메일인증
          emailCheck(email) {
            function isValidEmail(email) {
              // 이메일 형태를 확인하는 정규표현식
              const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
              return emailPattern.test(email);
            }

            if (!isValidEmail(email)) {
              alert("유효한 이메일이 아닙니다.");
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
                alert("메일확인 후 인증번호를 입력하세요.!");
                this.mailCheck = true;
              },
              (error) => {
                // 에러 콜백
                console.error("이메일 인증오류:", error);
                alert("인증오류입니다. 문의바랍니다.");
              }
            );
          },
          //메일인증비교
          emailNumCheck(checkNumberInput, FLAG){
            if(this.checkNumber === checkNumberInput){
              alert('인증되었습니다.');
              if (FLAG === 10) { //회원가입
                this.signUpAppr = true; 
              } else { //패스워드찾기
                this.signUpAppr2 = true;
              }
              
            } else {
              alert('인증번호가 일치하지 않습니다. 다시확인해주세요.');
            }
          },
          //패스워드찾기
          searchPwd() {
            if(this.searchPassword !== this.searchPassword2){
              alert('패스워드가 일치하지 않습니다. 다시확인해주세요.');
              return;
            }
            if(this.searchPassword.length < 8){
              alert('패스워드는 8자리 이상 입력해주세요.');
              return;
            }
            if(this.signUpAppr2){
              loginMethods.methods.changePwd(
                this.searchUserId,
                this.searchPassword,
                (res) => {
                  alert("패스워드를 변경하였습니다.");
                  this.showSearchPwd = false;
                  this.searchUserId = "";
                  this.searchPassword = "";
                  this.mailCheck = false;
                  this.signUpAppr2 =false;
                },
                (error) => {
                  // 에러 콜백
                  console.error("패스워드 변경 오류:", error);
                  alert("패스워드 변경실패. 문의바랍니다.");
                  this.signUpAppr2 = false;
                }
              );
            } else {
              alert('이메일 인증해주세요.');
              return;
            }
          },
          // 회원가입처리
          signup() {
            if(this.newPassword !== this.newPassword2){
              alert('패스워드가 일치하지 않습니다. 다시확인해주세요.');
              return;
            }
            if(this.newPassword.length < 8){
              alert('패스워드는 8자리 이상 입력해주세요.');
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
                  this.newGender = "";
                  this.mailCheck = false;
                  this.signUpAppr2 =false;
                },
                (error) => {
                  // 에러 콜백
                  console.error("회원가입 오류:", error);
                  alert(" 이미 사용 중인 아이디입니다.");
                  this.signUpAppr = false;
                }
              );
            } else {
              alert('이메일 인증해주세요.');
              return;
            }
          },
          //회원가입팝업닫기
          cancelSignup() {
            this.showSignupModal = false;
            this.newUserId = "";
            this.newPassword = "";
            this.newName = "";
            this.mailCheck = false; 
            this.signUpAppr =false; 
          },
          //패스워드찾기팝업닫기
          cancelsearchPwd(){
            this.showSearchPwd = false;
            this.searchUserId = "";
            this.searchPassword = "";
            this.mailCheck = false; 
            this.signUpAppr2 =false;
          },
        },
  mounted() {
      document.addEventListener('deviceready', () => {
        // Cordova 이벤트가 준비되면 이곳에서 딥링크 핸들러 함수를 호출합니다.
        alert('1');
        //handleOpenURL();
      }, false);

      // 페이지가 로드될 때 실행할 함수
      window.addEventListener('load', () => {
        // URL에서 쿼리 문자열 파싱
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        // 'code' 매개 변수 값 가져오기
        const code = urlParams.get('code');

        if (code) {
          // 구글 연동 로그인
          if (!this.ismobile) {
            const url = `friendtalk://action?code=${code}`;
            window.location.href = url;
          }
          this.exchangeGoogleAuthCodeForAccessToken(code);
        }
      });
    },
  created() {
      // 페이지가 로드될 때 로컬 스토리지에 토큰이 있는지 확인하여 로그인 상태를 설정
      const token = localStorage.getItem("token");
      if (token) {
        this .isLoggedIn = true;
        const decoded_Token = jwtDecode(token);
        this.loginUserId = decoded_Token.username;
      }
      this.profileSearch("load");
    },
    watch: {
        // showLoginModal 데이터 변경 감지
        showLoginModal(newValue) {
          if (newValue) {
            this.$nextTick(() => {
              this.focusLoginButton(); // 모달이 열릴 때 버튼으로 포커스 이동
            });
          }
        },
      }
};
</script>

<style scoped>
header {
  text-align: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  background: #252525;
  height: 80px;
}

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
z-index: 100;
}

.login-form {
background: #ffffff;
padding: 30px;
border-radius: 10px;
box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
z-index: 100;
}

.login-form h2 {
margin-bottom: 20px;
text-align: center;
}

.login-form label {
display: block;
font-weight: bold;
}

.login-form input {
width: 100%;
margin-bottom: 10px;
padding: 8px;
border: 1px solid #ccc;
border-radius: 5px;
}

.login-form button {
display: block;
width: 100%;
padding: 10px;
background-color: #007bff;
color: #ffffff;
border: none;
border-radius: 5px;
cursor: pointer;
}

.login-form button:hover {
background-color: #0056b3;
}

.login-btn, .signup-btn, .logout-btn {
padding: 8px 16px;
background-color: #007bff;
color: #ffffff;
border: none;
border-radius: 5px;
cursor: pointer;
}

.login-btn:hover {
background-color: #0056b3;
}

.close-button {
position: absolute;
top: 10px;
right: 10px;
font-size: 18px;
cursor: pointer;
color: #333;
}

.header-name {
font-size: 20px;
font-weight: bold;
color: #ffffff;
text-transform: uppercase;
text-align: center;
cursor: pointer;
}

.login-container {
display: flex;
justify-content: space-between;
align-items: center;
}
.login-button-container {
display: flex;
align-items: center;
}
.profile-img {
width: 35px;
  height: 35px;
  background-color: #ffffff;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 50%; /* Add the border-radius property to create a circular profile picture */
  object-fit: cover;
}

.profile-picture-container {
  display: flex;
  align-items: center;
  justify-content: center; /* 수평 가운데 정렬 */
  margin-bottom: 20px;
}

.profile-picture {
  border-radius: 50%; /* 원형태로 보여주기 위해 반지름을 50%로 설정 */
  width: 100px;
  height: 100px;
  object-fit: cover; /* 이미지 비율 유지 */
  border: 2px solid #ccc;
}

.profile-picture-container input[type="file"] {
  display: inline-block;
  margin-left: 10px;
}
.radio-buttons {
display: flex;
align-items: center;
}

.radio-buttons label {
margin-right: 10px;
}
.google-login-image{
margin-left: -40px;
width: 70px;
}
.google-login{
cursor: pointer;
}

</style>