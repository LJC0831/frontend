<template>
  <div class="content">
    <ul>
      <li v-for="(user, index) in userList" :key="index" class="user-item" :class="user.gender">
        <img v-if="user.img_id !== null" :src="user.profile_url" alt="프로필 사진" class="profile-picture" @click="profile_search(user.user_id, user.user_nm, user.profile_url, user.gender_type, user.intro, user.appl_yn)"/>
        <img v-if="user.img_id === null" src="../../assets/profile-user.png" class="profile-picture" @click="profile_search(user.user_id, user.user_nm, user.profile_url, user.gender_type, user.intro, user.appl_yn)"/>
        <div class="user-info">
        <span style="display: none;">{{ user.user_id }}</span>
        <h5>{{ user.user_nm }} ({{ user.gender_type }})
          <button v-if="user.talk_yn === 'T'" style="margin-right:10px;" class="talk-button">1:1대화 수락</button>
          <button v-if="user.talk_yn === 'T'" class="talk-button2" @click="chatApplDel(user.user_id)">거절</button>
          <i class="fas fa-comment" style="padding: 5px; "></i></h5>
          <p>{{ truncateIntro(user.intro) }}</p>
        </div>
      </li>
    </ul>

      <!-- 프로필 팝업 -->
    <div class="profile-popup" v-if="showProfilePopup">
      <div class="profile-popup-content">
        <img v-if="this.selectedimg_url === undefined" src="../../assets/profile-user.png" class="profile-picture" />
        <img v-if="this.selectedimg_url !== undefined" :src="this.selectedimg_url" alt="프로필 사진" class="profile-picture" />
        <h2>{{ this.selectedUserNM }} ({{ this.selectedGender }})</h2>
        <p v-if="this.selectedIntro !== null"><span>자기소개</span></p>
        <div class="modal_intro">{{ this.selectedIntro }}</div>
        <button v-if="this.selectedApplYn === 'T'" style="margin-right:10px;">요청대기중..</button>
        <button v-else style="margin-right:10px;" @click="this.isApplContentPopup=true">1:1대화신청</button>
        <button @click="closeProfilePopup">닫기</button>
      </div>
    </div>

    <div class="profile-popup" v-if="isApplContentPopup">
      <div class="profile-popup-content">
        <div class="modal-body" >
            <textarea v-model="applContent" style="width:500px;" placeholder="상대방에게 메세지를 전해주세요" />
        </div>
        <button style="margin-right:10px;" @click="chatAppl(this.selectedUser)">신청</button>
        <button @click="this.isApplContentPopup=false;this.applContent='';">닫기</button>
      </div>
    </div>
    <Header_01 ref="headerComponent" style="display: none;"></Header_01>
  </div>
</template>

<script>
/* eslint-disable */
import userListMethods from '../../scripts/userList.js'
import * as commons from '../../scripts/common.js';
import jwtDecode from 'jwt-decode';
import Header_01 from '../Header_01.vue';
export default {
  components: {
    Header_01
  },
  data() {
    return {
        userList: [],
        maxLength: 100, 
        showProfilePopup: false, // 프로필 팝업 표시 여부
        selectedUser: null, // 선택한 사용자 정보를 저장할 변수
        selectedUserNM: null,
        selectedimg_url: null,
        selectedGender:null,
        selectedIntro:null,
        selectedApplYn:null,
        selectedTalkYn:null,
        loginUserId:null,
        applContent:"",
        isApplContentPopup:false,
    };
  },
  created(){
    const token = localStorage.getItem("token");
    if (token) {
      this.isLoggedIn = true;
      const decoded_Token = jwtDecode(token);
      this.loginUserId = decoded_Token.username;
    }
    this.search01();
  },
  methods: {
    search01() {
        try { 
          userListMethods.methods.searchUserList(this.loginUserId, (res) => {
                if(res.status === 200){
                    this.userList = res.data;
                }
            },
            (error) => { // 에러 콜백
                console.error("검색 오류:", error);
            });
      } catch (error) {
        console.error("검색 오류:", error);
      }
    },
    chatAppl(user_id) {
      try { 
        userListMethods.methods.saveUserList(this.loginUserId, user_id, this.applContent, (res) => {
            if(res.status === 200){
                    alert('요청이 완료되었습니다.');
                    this.showProfilePopup = false;
                    this.isApplContentPopup = false;
                    this.applContent="";
                    this.search01();
                }
          },
          (error) => { // 에러 콜백
              console.error("검색 오류:", error);
          });
      } catch (error) {
        console.error("검색 오류:", error);
      }
    },
    chatApplDel(user_id) {
      try { 
        userListMethods.methods.deleteUserList(this.loginUserId, user_id, (res) => {
            if(res.status === 200){
                    commons.showToast(this, '처리되었습니다.');
                    this.showProfilePopup = false;
                    this.isApplContentPopup = false;
                    this.$refs.headerComponent.navigateToChatRoom();
                    this.search01();
                }
          },
          (error) => { // 에러 콜백
              console.error("검색 오류:", error);
          });
      } catch (error) {
        console.error("검색 오류:", error);
      }
    },

    // 프로필 팝업 닫기
    closeProfilePopup() {
      this.selectedUser = null;
      this.showProfilePopup = false;
    },

    truncateIntro(intro) {
      const windowWidth = window.innerWidth;
      if (windowWidth < 768) {
        this.maxLength = 10;
      } else {
        this.maxLength = 100;
      }
      if (intro !== null){
        if (intro.length <= this.maxLength) {
        return intro;
        } else {
          return intro.slice(0, this.maxLength) + '...';
        }
      }
    },
    // 프로필조회
    profile_search(user_id, user_nm, img_url, gender, intro, appl_yn){
      this.selectedUser = user_id; 
      this.selectedUserNM = user_nm; 
      this.selectedimg_url = img_url; 
      this.selectedGender = gender; 
      this.selectedIntro = intro; 
      this.selectedApplYn = appl_yn;
      this.showProfilePopup = true; // 팝업 표시
    }
  }
};
</script>

<style scoped>
.content{
  margin-bottom: 100px;
}
.user-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  background-color: rgb(255, 255, 255);
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
  width: 80%;
  background-color: rgb(197, 232, 253);
}
.user-item:hover {
  transform: translateY(-3px);
}

.profile-picture {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
  margin-left: 10px;
}

.user-info {
    display: flex;
    flex-direction: column;
    margin: 10px;
    height: 60px;
}

h5 {
  font-size: 17px;
  margin: 0;
}
p {
  font-size: 16px;
  margin: 0;
  color: #666;
}
/* 여성 사용자 스타일 */
.female {
  background-color: rgb(253, 240, 242);
  /* 기타 여성 스타일 속성 추가 */
}

/* 남성 사용자 스타일 */
.male {
  background-color: rgb(227, 244, 255);
  /* 기타 남성 스타일 속성 추가 */
}

.profile-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.profile-popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.profile-popup img {
  width: 400px;
  height: 400px;
  border-radius: 50%;
  object-fit: cover;
  margin: 10px auto;
}

.profile-popup h2 {
  font-size: 20px;
  margin: 0;
}

.profile-popup p {
  font-size: 18px;
  margin: 10px 0;
}

.profile-popup button {
  background-color: #333;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.modal_intro{
  width:500px;
  margin-bottom: 20px;
}

.talk-button {
  background-color: #007bff; /* 배경 색상을 원하는 색상으로 설정하세요 */
  color: #fff; /* 글자 색상을 원하는 색상으로 설정하세요 */
  border: none;
  border-radius: 4px; /* 원하는 둥근 모서리 설정 */
  padding: 10px 10px; /* 원하는 여백 설정 */
  font-size: 16px; /* 원하는 글자 크기 설정 */
  cursor: pointer;
  outline: none;
}
.talk-button2 {
  background-color: #ff0000; /* 배경 색상을 원하는 색상으로 설정하세요 */
  color: #fff; /* 글자 색상을 원하는 색상으로 설정하세요 */
  border: none;
  border-radius: 4px; /* 원하는 둥근 모서리 설정 */
  padding: 10px 10px; /* 원하는 여백 설정 */
  font-size: 16px; /* 원하는 글자 크기 설정 */
  cursor: pointer;
  outline: none;
}

.talk-button:hover {
  background-color: #0056b3; /* 마우스 호버 시 배경 색상 변경 */
}
.talk-button2:hover {
  background-color: #850606; /* 마우스 호버 시 배경 색상 변경 */
}

@media (max-width: 768px) {
  
  .modal_intro{
    width:100%;
    }
  .profile-popup-content {
    background-color: white;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    width:90%;
  }
  .profile-popup img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
  }
}
</style>