<template>
  <header>
    <div class="login-container">
      <div class="header-name" @click="refreshPage"><img src="@/assets/main_logo.png" class="main_logo_img"></div>
      <div class="login-button-container">
        <div v-if="!isLoggedIn" class="signup-button" @click="showSignupModal = true">
          <button class="signup-btn">회원가입</button>&nbsp;
        </div>
        <!-- <div v-if="!isLoggedIn" class="login-button" @click="$emit('menuSelected', 'login');$router.push('/login');"> -->
        <div v-if="!isLoggedIn" class="login-button" @click="$router.push('/login');">
            <button class="login_btn">로그인</button>
        </div>
        <div v-if="isLoggedIn" class="user-profile-button" @click="profileSearch('')">
          <img v-if="!profilePicture" src="@/assets/profile-user.png" alt="내 정보" class="profile-img" />
          <img v-if="profilePicture" :src="profilePicture" alt="프로필 사진" class="profile-img" />
        </div>
        <div class="icon-container"  v-if="!showNotification && isLoggedIn && notificationCount !== 0">
          <i class="fas fa-bell" @click="toggleNotification"><span class="badge" v-if="notificationCount !== 0">{{ notificationCount }}</span></i>
        </div>
        <div v-if="showNotification && isLoggedIn">
          <div class="notification" v-for="(notificationMessage, index) in notificationMessages" :key="index" :style="{ top: (index * 47) + 'px' }" @click="navigateToChatRoom(notificationMessage.chat_id)">
            <!-- 알람 메시지 내용 -->
            <span class="alarm-class"> {{ notificationMessage.subject }}<br></span>
          </div>
        </div>
        <div v-if="isLoggedIn" class="logout-button" @click="logout">
          <button class="logout-btn">로그아웃</button>
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

          <label for="editIntro">소개:</label>
          <textarea v-model="editIntro" class="profile-intro" placeholder="나를 소개해주세요..." />&nbsp;

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
  props: ['menuSelected'], // 부모 컴포넌트로부터 menuSelected 프롭을 받음
  data() {
    return {
      loading: false,
      loginUserId: null,
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
      showNotification: false, // 알람 표시 여부
      notificationMessages: [], // 채팅알람
      notificationCount: 0, //알람개수
      timer: null, // setInterval 타이머 변수
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
                  this.editIntro = res.data[0].intro;
                  this.profilePicture = res.data[0].img_url;
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
            if(this.editedName.length === 0){
              commons.showToast(this, '이름은 필수값입니다.');
              return;
            } else if(this.editedName.length >= 10){
              commons.showToast(this, '이름은 10자 내외로 입력해주세요.');
              return;
            }

            if(this.editIntro){
              if(this.editIntro.length >= 2000){
                commons.showToast(this, '1000자 내외로 소개해주세요');
                return;
              }
            } else {
              this.editIntro = '';
            }
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
            loginMethods.methods.profileAdj( userid, this.editedName, this.file_no, this.editIntro,
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
              commons.showToast(this, ' 이미지 크기가 너무 큽니다. 4MB 이하의 이미지를 선택해주세요.');
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
              const uniqueFileName = `PROFILE_${timestamp}_${file.name}`;
              const formData = new FormData();
              formData.append('file', file);
              formData.append("fileName", encodeURIComponent(uniqueFileName)); // 파일명을 인코딩하여 formData에 추가
              const api = axios.create({
                baseURL: "https://backendserver.shop:3000",
                //baseURL: "https://port-0-backend-nodejs-20zynm2mlk2nnlwj.sel4.cloudtype.app",
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
              },
              (error) => {
                // 에러 콜백
                console.error("이메일 인증오류:", error);
                commons.showToast(this, '인증오류입니다. 문의바랍니다.');
              }
            );
          },
          //메일인증비교
          emailNumCheck(checkNumberInput, FLAG){
            if(this.checkNumber === checkNumberInput){
              commons.showToast(this, '인증되었습니다.');
              if (FLAG === 10) { //회원가입
                this.signUpAppr = true; 
              } else { //패스워드찾기
                this.signUpAppr2 = true;
              }
              
            } else {
              commons.showToast(this, '인증번호가 일치하지 않습니다. 다시확인해주세요.');
            }
          },
          //패스워드찾기
          searchPwd() {
            if(this.searchPassword !== this.searchPassword2){
              commons.showToast(this, '패스워드가 일치하지 않습니다. 다시확인해주세요.');
              return;
            }
            if(this.searchPassword.length < 8){
              commons.showToast(this, '패스워드는 8자리 이상 입력해주세요.');
              return;
            }
            if(this.signUpAppr2){
              loginMethods.methods.changePwd(
                this.searchUserId,
                this.searchPassword,
                (res) => {
                  commons.showToast(this, '패스워드를 변경하였습니다.');
                  this.showSearchPwd = false;
                  this.searchUserId = "";
                  this.searchPassword = "";
                  this.mailCheck = false;
                  this.signUpAppr2 =false;
                },
                (error) => {
                  // 에러 콜백
                  console.error("패스워드 변경 오류:", error);
                  commons.showToast(this, '패스워드 변경실패. 문의바랍니다.');
                  this.signUpAppr2 = false;
                }
              );
            } else {
              commons.showToast(this, '이메일 인증해주세요.');
              return;
            }
          },
          // 회원가입처리
          signup() {
            if(this.newPassword !== this.newPassword2){
              commons.showToast(this, '패스워드가 일치하지 않습니다. 다시확인해주세요.');
              return;
            }
            if(this.newPassword.length < 8){
              commons.showToast(this, '패스워드는 8자리 이상 입력해주세요.');
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
                  commons.showToast(this, ' 이미 사용 중인 아이디입니다.');
                  this.signUpAppr = false;
                }
              );
            } else {
              commons.showToast(this, '이메일 인증해주세요.');
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
          //토글알림
          toggleNotification() {
            this.showNotification = !this.showNotification;
          },
          startInterval() {
            // 10분(600000 밀리초)마다 myFunction 함수를 실행합니다.
            this.timer = setInterval(this.alarmCheck, 600000);
          },
          stopInterval() {
            // setInterval을 멈춥니다.
            clearInterval(this.timer);
          },
          alarmCheck() {
            // 이 함수는 10분마다 호출됩니다.
            const token = localStorage.getItem('token');
            if(token != null) {
              loginMethods.methods.alarmSearch(this.loginUserId, (res) => {
                    this.notificationMessages = [];
                    this.notificationCount = 0;
                    this.notificationCount = res.data.length;
                    for(let i = 0; i <res.data.length; i ++){
                      if(res.data[i].chat_id > 0){
                        this.notificationMessages.push({subject:'새로운메세지: ' + res.data[i].content, chat_id:res.data[i].chat_id});
                      } else {
                        this.notificationMessages.push({subject:res.data[i].content, chat_id:res.data[i].chat_id});
                      }
                      
                    }
                },
                  (error) => {
                    // 에러 콜백
                    console.error("알람 조회 오류", error);
                  }
                );
              }
          },
          // 알림 메시지 클릭 시 채팅방으로 이동하는 메서드
          navigateToChatRoom(chatRoomNumber) {
            //this.notificationMessages[index] = null;
            this.toggleNotification();
            if(chatRoomNumber > 0){
              this.$emit('menuSelected', 'chat_main' + '/' + chatRoomNumber);
            } else {
              this.$emit('menuSelected', 'userList' + '/' + chatRoomNumber);
            }
            setTimeout(() => {
              this.alarmCheck();
            }, 500); // 500ms(0.5초) 후에 실행됩니다.
            // 알림을 닫으려면 toggleNotification 메서드 또는 다른 방법을 호출하세요.
          },
        },
  mounted() {
      this.startInterval();
    },
    unmounted() {
    // 컴포넌트가 파괴되기 전에 setInterval을 멈춥니다.
    this.stopInterval();
  },
  created() {
      // 페이지가 로드될 때 로컬 스토리지에 토큰이 있는지 확인하여 로그인 상태를 설정
      const token = localStorage.getItem("token");
      if (token) {
        this.isLoggedIn = true;
        const decoded_Token = jwtDecode(token);
        this.loginUserId = decoded_Token.username;
      }
      this.profileSearch("load");
      this.alarmCheck();
    },
};


</script>

<style scoped>
* {
  font-weight: 500;
}
header {
  font-family: "Pretendard";
  text-align: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  background: #252525;
  height: 80px;
}

.main_logo_img{
  width: 60px; 
  height: 60px; 
  margin-top: -10px;
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
width:500px;
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

.login_btn, .signup-btn, .logout-btn {
padding: 8px 16px;
background-color: #007bff;
color: #ffffff;
border: none;
border-radius: 5px;
cursor: pointer;
}

.login_btn:hover {
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

.profile-intro{
  width: 100%; 
  border: 1px solid #ccc; 
  border-radius: 8px; 
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1); 
  padding: 10px; 
  resize: none;
  height: 100px;
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
.icon-container {
  margin-top: -20px; /* 원하는 위치로 조정하세요. */
  margin-right: 10px;
  z-index: 9999;
  color:white;
  cursor: pointer;
}
.notification {
  position: fixed;
  right: 10px; /* 알람 메시지 위치를 조정하세요. */
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 10px;
  z-index: 9998;
  width: 200px;
  white-space: nowrap; /* 텍스트를 한 줄로 표시 */
  overflow: hidden; /* 넘치는 텍스트를 숨김 */
  text-overflow: ellipsis; /* 넘치는 텍스트 대신 "..."을 표시 */
}
.badge {
  background-color: red; /* 뱃지의 배경색을 설정합니다. */
  color: white; /* 뱃지의 텍스트 색상을 설정합니다. */
  border-radius: 50%; /* 뱃지를 원 모양으로 만듭니다. */
  font-size: 12px; /* 뱃지의 글꼴 크기를 조정합니다. */
  font-weight: bold; /* 뱃지의 글꼴 굵기를 조정합니다. */
}
.alarm-class{
  font-size: 12px;
  border-radius: 5px; /* 모서리 둥글게 만들기 */
  padding: 5px; /* 내부 여백 설정 */
  width: 200px;
}

@media (max-width: 768px) {
  header {
    height: 60px;
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
  .main_logo_img{
    width: 50px; 
    height: 50px; 
    margin-top: -20px;
  }
  .login-button-container{
    margin-top:-15px;
  }

  .login_btn, .signup-btn, .logout-btn {
    padding: 4px 8px;
    background-color: #007bff;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    }

    .login-form {
      background: #ffffff;
      padding: 10px;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      z-index: 100;
      width:300px;
      }

}
</style>