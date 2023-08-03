<template>
    <header>
      <div class="login-container">
        <div class="header-name" @click="refreshPage">MEMO App</div>
        <div class="login-button-container">
          <div v-if="!isLoggedIn" class="signup-button" @click="showSignupModal = true">
            <button class="signup-btn">회원가입</button>&nbsp;
          </div>
          <div v-if="!isLoggedIn" class="login-button" @click="showLoginModal = true">
            <!-- 로그인 이미지 대신 일반 버튼으로 변경 -->
            <button class="login-btn">로그인</button>
          </div>
          <div v-if="isLoggedIn" class="user-profile-button" @click="profileSearch()">
            <img src="@/assets/profile-user.png" alt="내 정보" class="profile-img" />
          </div>
          <div v-if="isLoggedIn" class="logout-button" @click="logout">
            <button class="logout-btn">로그아웃</button>
          </div>
        </div>
  
        <!-- 로그인 모달 -->
        <div v-if="showLoginModal" class="login-modal">
        <div class="login-form">
          <h2>로그인</h2>
          <label for="username">아이디 :</label>&nbsp;
          <input type="text" v-model="username" id="username" />&nbsp;
          <label for="password">비밀번호: </label>&nbsp;
          <input type="password" v-model="password" id="password" />&nbsp;
          <button @click="login">로그인</button>&nbsp;
          <button @click="cancel">취소</button>&nbsp;
        </div>
        <div class="close-button" @click="showLoginModal = false">X</div>
      </div>
      <!-- 회원가입 모달 -->
      <div v-if="showSignupModal" class="login-modal">
        <div class="login-form">
          <h2>회원가입</h2>
          <label for="newUserId">아이디 :</label>&nbsp;
          <input type="text" v-model="newUserId" id="newUserId" />&nbsp;
          <label for="newPassword">비밀번호: </label>&nbsp;
          <input type="password" v-model="newPassword" id="newPassword" />&nbsp;
          <label for="newName">이름: </label>&nbsp; 
          <input type="text" v-model="newName" id="newName" />&nbsp; 
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
            <div class="profile-picture-container">
              <img :src="profilePicture" alt="프로필 사진" class="profile-picture" />
              <input type="file" @change="onProfilePictureChange" accept="image/*" />
            </div>
            
            <label for="editName">이름:</label>&nbsp;
            <input type="text" v-model="editedName" id="editName" />&nbsp;

            <button @click="saveUserProfile">저장</button>&nbsp;
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

  export default {
    data() {
      return {
        showLoginModal: false,
        showSignupModal: false, // 회원가입 모달 표시 여부
        username: "",
        password: "",
        newUserId: "", // 회원가입용 새 아이디
        newPassword: "", // 회원가입용 새 비밀번호
        newName: "",
        isLoggedIn: false, // 로그인 상태를 저장하는 데이터 속성
        isUserProfileModalVisible: false, // 내정보 모달 표시 여부 추가
        editedName: "",
      };
    },
    methods: {
            ...mapActions(["setToken"]),
            ...loginMethods.methods,
            refreshPage() {
              // 페이지 새로고침
              window.location.reload();
            },
            login() {
              loginMethods.methods.login( this.username, this.password,(res) => {
                      alert("로그인에 성공했습니다!");
                      // 토큰을 Vuex에 저장
                    this.setToken(res.data.token);

                    // 토큰을 로컬 스토리지에 저장
                    localStorage.setItem("token", res.data.token);

                    this.showLoginModal = false; // 로그인 성공 시 모달 닫기
                    this.username = ""; // 입력한 사용자 이름 초기화
                    this.password = ""; // 입력한 비밀번호 초기화
                    window.location.reload();
                  },
                  (error) => {
                    console.error("로그인 오류:", error);
                    alert("아이디 패스워드가 틀립니다. ");
                  }
                );
              },
           
            logout() {
                  // 로그아웃 처리 로직
                  // 로컬 스토리지에서 토큰 제거
                  localStorage.removeItem("token");
                  // 로그인 상태를 false로 변경
                  this.isLoggedIn = false;
            },
            // 내정보 조회
            profileSearch(){
              const token = localStorage.getItem('token');
              if(token == null) {
                alert('로그인 세션이 종료되었습니다. 재로그인해주세요.');
                return;
              }
              const decodedToken = jwtDecode(token);
              const userid = decodedToken.username; // 사용자 아이디 추출

              loginMethods.methods.profileSearch(
                userid,
                (res) => {
                  debugger;
                  //res.data
                  this.editedName = res.data[0].user_nm
                  this.isUserProfileModalVisible = true;
                },
                (error) => {
                  // 에러 콜백
                  console.error("프로필 조회 오류", error);
                }
              );
              
            },
            // 내정보 수정
            saveUserProfile() {
              const token = localStorage.getItem('token');
              if(token == null) {
                alert('로그인 세션이 종료되었습니다. 재로그인해주세요.');
                return;
              }
              const decodedToken = jwtDecode(token);
              const userid = decodedToken.username; // 사용자 아이디 추출
              loginMethods.methods.profileAdj(
                userid,
                this.editedName,
                (res) => {
                  alert("수정완료 되었습니다.");
                  this.isUserProfileModalVisible = false; // 데이터 속성을 수정하여 팝업을 닫도록 변경
                },
                (error) => {
                  // 에러 콜백
                  console.error("회원가입 오류:", error);
                  alert(" 이미 사용 중인 아이디입니다.");
                }
              );
              
              
            },
            cancelUserProfile() {
              this.isUserProfileModalVisible = false; // 데이터 속성을 수정하여 팝업을 닫도록 변경
            },
            cancel() {
              this.showLoginModal = false; // 취소 버튼 클릭 시 모달 닫기
              this.username = ""; // 입력한 사용자 이름 초기화
              this.password = ""; // 입력한 비밀번호 초기화
            },
            signup() {
              loginMethods.methods.signup(
                this.newUserId,
                this.newPassword,
                this.newName,
                (res) => {
                  alert("회원가입에 성공했습니다!");
                  this.showSignupModal = false;
                  this.newUserId = "";
                  this.newPassword = "";
                  this.newName = "";
                },
                (error) => {
                  // 에러 콜백
                  console.error("회원가입 오류:", error);
                  alert(" 이미 사용 중인 아이디입니다.");
                }
              );
            },
            cancelSignup() {
              this.showSignupModal = false;
              this.newUserId = "";
              this.newPassword = "";
              this.newName = "";
            },
          },

    created() {
        // 페이지가 로드될 때 로컬 스토리지에 토큰이 있는지 확인하여 로그인 상태를 설정
        const token = localStorage.getItem("token");
        if (token) {
          this.isLoggedIn = true;
        }
      },
  };
  </script>
  
  <style scoped>
  header {
    text-align: center;
    padding: 25px;
    border-bottom: 1px solid #eee;
    background: #333;
    height: 100px;
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



  </style>