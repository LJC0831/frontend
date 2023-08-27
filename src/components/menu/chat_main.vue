<template>
  <div>
    <div class="chat-main" v-if="selectedChatId !== null">
      <ChatRoom01 :selectedChatId="selectedChatId" :selectSubject="selectSubject" :selectUser="selectUser" @changeSelectedChatId="changeSelectedChatId" />
      <button class="btn btn-primary search-button" id="btn-exit" @click="exit()">뒤로가기</button>
    </div>
    <div class="chat-room" v-if="selectedChatId === null">
      <section class="chat-section">
        <div class="chat_row">
          <div class="chat_left">
            <h1 class="chat-title">자유로운 채팅방</h1>
            <p class="chat-description">누구나 자유롭게 채팅이 가능합니다. 욕설 및 성희롱 등 입력 시 제재 될 수 있습니다. 매너채팅 부탁드립니다 ^^</p>
            <p>
              <input type="text" v-model.trim="searchKeyword" v-if="activeTab === 'ALL'" @keyup.enter="search01('ALL')" placeholder="Search" class="search-input" />&nbsp;
              <input type="text" v-model.trim="searchKeyword" v-if="activeTab === 'Chatting'" @keyup.enter="search01('Chatting')" placeholder="Search" class="search-input" />&nbsp;
              <button class="btn btn-primary search-button" v-if="activeTab === 'ALL'" @click="search01('ALL')">조회</button>
              <button class="btn btn-primary search-button" v-if="activeTab === 'Chatting'" @click="search01('Chatting')">조회</button>
              <button class="btn btn-success create-button" @click="createChatRoom()">방 만들기</button>
            </p>
          </div>
        </div>
      </section>
      <div class="tabs-container">
        <div class="tabs">
          <div v-for="(tab, index) in tabs" :key="index" @click="handleTabClick(tab)" :class="{ active: activeTab === tab }"  class="tab">
            {{ tab }}
          </div>
        </div>
      </div>

        <div class="album py-5 bg-body-tertiary">
          <div class="container">
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4" id="chat_main_img">
              <div class="col" v-for="(chatRooms, index) in chatRooms" :key="index" @click="openChatRoom(chatRooms)">
                <div class="card shadow-sm">
                  <div class="card-body">
                    <p class="card-text">
                      <span>
                        <img v-if="chatRooms.profile_id !== null" :src="chatRooms.imageUrl" class="thumbnail-image" />
                        <img v-if="chatRooms.profile_id === null" src="../../assets/profile-user.png" class="thumbnail-image" />
                      </span>
                      <span class="chatromm-subject">{{ chatRooms.subject }}</span>
                      <span><img v-if="chatRooms.pwd !== null" src="../../assets/pwdIkon.jpg" /></span>
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                      </div>
                      <span class="chatromm-cnt">{{ chatRooms.user_cnt }}/{{ chatRooms.expire_cnt }}</span>
                      <small class="text-body-secondary">{{ chatRooms.formatted_date }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
       <!-- 모달 창 -->
       <div v-if="createChatModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeCreateChatModal">&times;</span>
          <!-- 모달 창 내용 -->
          <h2 class="modal-title">방 만들기</h2>
          <div class="form-group">
              <label for="subject">방 제목</label>
              <input type="text" v-model="subject" id="subject" class="form-control" />
            </div>
            <div class="form-group">
              <label for="newPassword">비밀번호(선택)</label>
              <input type="password" v-model="newPassword" id="newPassword" class="form-control" />
            </div>
            <div class="form-group">
              <label for="newPassword">인원(명)</label>
              <input type="number" v-model="expire_cnt" id="expire_cnt" class="form-control" />
            </div>
            <button class="btn btn-success" @click="createChatRoom01">방 만들기</button>&nbsp;
            <button class="search-button" @click="this.createChatModal=false;">취소</button>
        </div>
      </div>
    </div>
</template>

<script>
/* eslint-disable */
import { debounce } from 'lodash';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import ChatRoom01 from './chat_01.vue';
import loginMethods from '../../scripts/login.js';
import chatMethods from '../../scripts/chat.js';

const api = axios.create({
  baseURL: "https://port-0-backend-nodejs-20zynm2mlk2nnlwj.sel4.cloudtype.app",
  //baseURL: "http://localhost:3000",
});

export default {
  components: {
    ChatRoom01,
  },
  data() {
    return {
      searchKeyword: '',
      chatRooms: [],
      selectedChatId: null,
      selectSubject:null,
      selectUser:[],
      checkFlag:false,
      myUserYn:false,  //방 입장여부(본인)
      tabs:['ALL', 'Chatting'],
      activeTab: 'ALL',
      searchUserId: null,
      createChatModal: false, // 모달 창 띄우기 여부
      expire_cnt: 1, // 초기 값 1로 설정
      subject: '방제목을 입력해주세요', // 초기 값 1로 설정
    };
  },
  methods: {
    //탭 선택
    handleTabClick(tab) {
      this.activeTab = tab;
      this.search01(tab);
    },
    //채팅방 open
    openChatRoom(chatRooms) {
      const pwd = chatRooms.pwd; // 방 비밀번호
      const chat_id = chatRooms.id; //방 id
      const subject = chatRooms.subject; // 방 제목
      const user_cnt = chatRooms.user_cnt; //현재 인원수
      const expire_cnt = chatRooms.expire_cnt; //방 제한인원
      const chat_type = chatRooms.chat_type; //방유형 0: 자유, 1: 제한
      const userIds = chatRooms.user_id; //방 인원list

      const token = localStorage.getItem('token');
      if(token == null) {
          alert('로그인 세션이 종료되었습니다. 재로그인해주세요.');
          window.location.reload();
          // 페이지 새로고침
          return;
        }
      const decodedToken = jwtDecode(token);
      const userid = decodedToken.username; // 사용자 아이디 추출
      const userIdsArray = userIds.split(',');


      for (const userId of userIdsArray){
        if(userId === userid ){ //방에 본인이 있을시
          this.myUserYn = true;
          if(chat_type==="1" ){
            this.checkFlag = true;
          }
        }
      }
      if(!this.checkFlag && chat_type==="1"){
        alert('입장할 수 없습니다. 방장에게 초대를 받으세요');
        return;
      }

      if(!this.myUserYn){
        if(user_cnt >= expire_cnt){
          alert('입장할 수 없습니다. 방이 가득 찼습니다.');
          return;
        }
      } 
      

      if(pwd ==! null){
        const enteredPassword = prompt('비밀번호를 입력하세요:');
          if (enteredPassword !== pwd) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
          } 
      } 

      if(!this.myUserYn){
        chatMethods.methods.chatInsertUser(chat_id,userid,(res) => {
            if(res.status === 200){
              userIdsArray.push(userid);
              this.selectedChatId = chat_id;
              this.selectSubject = subject;
              this.selectUser = userIdsArray;
            }
          },
          (error) => { // 에러 콜백
            alert('일반유저는 최대 방5개까지만 입장가능합니다.');
            console.error("채팅방 입장 오류:", error);
            return;
          }
        );
      } else {
        this.selectedChatId = chat_id;
        this.selectSubject = subject;
        this.selectUser = userIdsArray;
      }

      
    },
    //채팅>채팅목록 호출
    changeSelectedChatId(chatId) {
      this.selectedChatId = chatId;
      this.myUserYn = false;
      this.search01('ALL');
    },
    exit() {
      this.selectedChatId = null;
      this.myUserYn=false;
      this.search01('ALL');
    },
    //조회
    search01: debounce(async function (tab) {
      try {
        
        if (tab !== 'ALL'){
          const token = localStorage.getItem('token');
          const decodedToken = jwtDecode(token);
          this.searchUserId = decodedToken.username; // 사용자 아이디 추출
        } 
        const response = await api.get("/api/chat/search",{ params: { q: this.searchKeyword, userId:this.searchUserId } });
        this.chatRooms = response.data;
        this.searchUserId = null;
        for (const chatRoom of this.chatRooms) {
          if (chatRoom.profile_id !== null) {
            try {
              const imageUrl = await this.getFileUrl(chatRoom.profile_id);
              chatRoom.imageUrl = imageUrl;
            } catch (error) {
              console.error("이미지 URL 조회 오류:", error);
            }
          }
        }
      } catch (error) {
        console.error("검색 오류:", error);
      }
    }, 400),
    // 방만들기
    createChatRoom(){
      this.createChatModal = true;
    },
    closeCreateChatModal() {
      this.createChatModal = false;
    },
    //방만들기
    createChatRoom01(){
      if(this.subject === ''){
        alert('방 제목을 입력해주세요.');
        return;
      } 
      if(this.expire_cnt === '' ){
        alert('인원수를 입력해주세요.');
        return;
      }
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userid = decodedToken.username; // 사용자 아이디 추출
      chatMethods.methods.createChatRoom(this.subject, this.newPassword, userid, this.expire_cnt, (res) => {
            if(res.status === 200){
              this.createChatRoom02(res.data.chat_id, userid);
            }
          },
          (error) => { // 에러 콜백
            alert('방만들기 최대횟수를 초과하였습니다.');
            this.createChatModal = false;
            console.error("방만들기 오류:", error);
          });
    },
    //방만들기 후처리
    createChatRoom02(chat_id, userid){
      chatMethods.methods.createChatRoom02(chat_id, userid, (res) => {
            if(res.status === 200){
              alert('방이 생성되었습니다.');
              this.createChatModal = false;
              this.search01(this.activeTab);
            }
          },
          (error) => { // 에러 콜백
            this.createChatModal = false;
            console.error("채팅방 입장 오류:", error);
          });
    },
    //imgurl조회
    async getFileUrl(fileNo) {
      try {
        const response = await new Promise((resolve, reject) => {
          loginMethods.methods.profileImgURL(
            fileNo,
            (res) => resolve(res),
            (error) => reject(error)
          );
        });
        return response.data.imageUrl;
      } catch (error) {
        console.error('이미지 URL 조회 오류:', error);
        throw error;
      }
    }
  },
  created() {
    this.search01('ALL');
  }
};
</script>
  
<style scoped>
.tabs-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
}
  .tabs {
    display: flex;
    margin-bottom: 10px;
  }

  .tab {
    padding: 10px 20px;
    cursor: pointer;
    color: #333;
    background-color: #fff;
    border-radius: 5px;
    margin: 0 5px;
    transition: background-color 0.3s, transform 0.3s;
  }

  .tab {
    padding: 10px;
    cursor: pointer;
  }

  .active {
    font-weight: bold;
    border-bottom: 2px solid #333; /* 선택된 탭 하단 선 색상 */
    background-color: #3498db; /* 선택된 탭 배경색 */
  }

  .chat-section {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
  }

  .chat-title  {
    font-family: 'Arial', sans-serif;
    font-size: 28px;
    color: #333;
    margin-bottom: 10px;
  }
  .chatromm-subject{
    font-family: 'Montserrat', sans-serif;
    font-size: 15px;
    color: #333;
    font-weight: bold;
    margin-bottom: 10px;
    margin-left: 5px;
  }

  .chat-description {
    font-family: 'Arial', sans-serif;
    font-size: 16px;
    color: #777;
    margin-bottom: 20px;
  }

  .search-input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    color: #333;
    width: 200px;
  }

  .search-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #3498db;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
  }

  .thumbnail-image {
    flex-shrink: 0;
    max-width: 40px;
    max-height: 40px;
    min-width: 40px;
    min-height: 40px;
    border-radius: 50%;
  }

  .create-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #2ecc71;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    margin-left: 10px;
  }
  #btn-exit{
    float: right;
    transition: background-color 0.3s, color 0.3s;
  }

  .col{
    margin-bottom: 10px;
  }

  /* 모달 스타일 */
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* 반투명 배경 */
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
}

.close {
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
  position: absolute;
  top: 15px;
  right: 20px;
  cursor: pointer;
}
.modal-title {
  font-size: 24px;
  margin-bottom: 15px;
}

.modal-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  color: #333;
}

.btn-success {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #2ecc71;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-success:hover {
  background-color: #27ae60;
}


.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
/* 모달 style 끝 */
  
  @media (max-width: 768px) {
    .create-button {
      border: none;
      border-radius: 5px;
      background-color: #2ecc71;
      font-size: 14px;
      color: #fff;
      cursor: pointer;
    }
    .chat-main {
      width: 80%;
    }
  }
  @media (min-width: 768px) {
    .chat-main {
      width: 100%;
    }
  }


</style>