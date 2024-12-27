<template>
  <div>
    <div class="chat-main" v-if="selectedChatId !== null">
      <ChatRoom01 ref="chatComponent" :selectedChatId="selectedChatId" :selectSubject="selectSubject" :selectUser="selectUser" @changeSelectedChatId="changeSelectedChatId" />
      <button class="btn btn-primary search-button" id="btn-exit" v-if="exitbuttonFlag" @click="exit()">뒤로가기</button>
    </div>
    <div class="chat-room" v-if="selectedChatId === null">
      <section class="chat-section">
        <div class="chat_row">
          <div class="chat_left">
            <p>
              <input type="text" v-model.trim="searchKeyword" v-if="activeTab === 'ALL'" @keyup.enter="search01('ALL')" placeholder="Search" class="search-input" />
              <input type="text" v-model.trim="searchKeyword" v-if="activeTab === 'My Chat'" @keyup.enter="search01('My Chat')" placeholder="Search" class="search-input" />&nbsp;
              <button v-if="activeTab === 'ALL'" @click="search01('ALL')" class="search-button"><font-awesome-icon icon="search" /></button>
              <button v-if="activeTab === 'My Chat'" @click="search01('My Chat')" class="search-button"><font-awesome-icon icon="search" /></button>
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
            <div>
              <div class="col" v-for="(chatRooms, index) in displayedChatRooms" :key="index"  @click="openChatRoom(chatRooms)">
                <div class="card shadow-sm">
                  <div class="card-body">
                      <span>
                        <img v-if="chatRooms.profile_id !== null" :src="chatRooms.imageUrl" class="thumbnail-image" />
                        <img v-if="chatRooms.profile_id === null" src="../../assets/profile-user.png" class="thumbnail-image" />
                      </span>
                      <span class="chatroom-subject">{{ chatRooms.subject }}</span>
                      <span v-if="chatRooms.pwd !== null"><font-awesome-icon icon="lock" /></span>
                      <span class="chatroom-readCount" id="notReadCount">{{ chatRooms.notReadCnt }}</span>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-secondary" style="display:none;">Edit</button>
                      </div>
                      <span class="chatromm-cnt" style="margin-left: 50px;">{{ chatRooms.user_cnt }}/{{ chatRooms.expire_cnt }}</span>
                      <small class="text-body-secondary">{{ chatRooms.formatted_date }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="page-container" v-if="selectedChatId === null">
                <div>
                  <img src="../../assets/prevButton.png" @click="prevPage" :disabled="currentPage === 1" style="width: 30px; height: 30px; cursor: pointer;">&nbsp;
                  <span class="page-indicator">{{ currentPage }} / {{ pageCount }}</span>&nbsp;
                  <img src="../../assets/nextButton.png" @click="nextPage" :disabled="currentPage === pageCount" style="width: 30px; height: 30px; cursor: pointer;">&nbsp;
                </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 등록버튼 -->
      <div class="regist-container">
        <button @click="createChatRoom()" class="regist-button">
          +방만들기
        </button>
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
      <!-- 모달 창 END-->
    </div>
</template>

<script>
/* eslint-disable */
import { debounce } from 'lodash';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import ChatRoom01 from './chat_01.vue';
import chatMethods from '../../scripts/chat.js';
import * as commons from '../../scripts/common.js';


const api = axios.create({
  baseURL: "https://backendserver.shop:3000",
  //baseURL: "http://localhost:3000",
});

export default {
  props: {
    chatData: String,
  },
  components: {
    ChatRoom01,
  },
  mounted() {
    if(this.chatData !== null) {
        this.selectedChatId = this.chatData;
    }
    // 모바일 뒤로가기 이벤트 감지
    window.addEventListener("popstate", this.handleMobileBackButton);
    this.pushEmptyState();
  },
  beforeDestroy() {
    // 컴포넌트가 제거되기 전에 이벤트 리스너 해제
    window.removeEventListener("popstate", this.handleMobileBackButton);
  },
  data() {
    return {
      loginUserId:null,
      searchKeyword: '',
      chatRooms: [],
      selectedChatId: null,
      selectSubject:null,
      selectUser:[],
      checkFlag:false,
      exitbuttonFlag:this.isMobile() ? false : true, //뒤로가기버튼활성화여부
      myUserYn:false,  //방 입장여부(본인)
      tabs:['ALL', 'My Chat'],
      activeTab: 'ALL',
      searchUserId: null,
      createChatModal: false, // 모달 창 띄우기 여부
      expire_cnt: 2, // 초기 값 1로 설정
      subject: '방제목을 입력해주세요', // 초기 값 1로 설정
      chatRooms: [],        // 전체 채팅방 정보가 들어 있는 배열
      itemsPerPage: this.isMobile() ? 4 : 9,
      currentPage: 1,        // 현재 페이지 번호
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(this.chatRooms.length / this.itemsPerPage);
    },
    displayedChatRooms() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      const displayedRooms = this.chatRooms.slice(startIndex, endIndex);
      this.getImageUrls(displayedRooms); // 이미지 URL 가져오기 호출
      return displayedRooms;
    }
  },
  methods: {
    //탭 선택
    handleTabClick(tab) {
      this.currentPage = 1;
      this.activeTab = tab;
      this.search01(tab);
    },
    isMobile() {
      return window.innerWidth <= 800; // 600px 이하면 모바일로 판단
    },
    // 소켓끊기
    exitChat() {
      this.$refs.chatComponent.disconnectWebSocket();
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

      
      if(!commons.loginCheck()) return;
      const userIdsArray = userIds.split(',');


      for (const userId of userIdsArray){
        if(userId === this.loginUserId ){ //방에 본인이 있을시
          this.myUserYn = true;
          if(chat_type==="1" ){
            this.checkFlag = true;
          }
        }
      }
      if(!this.checkFlag && chat_type==="1"){
        commons.showToast(this, '입장할 수 없습니다. 방장에게 초대를 받으세요');
        return;
      }

      if(!this.myUserYn){
        if(pwd !== null){
          const enteredPassword = prompt('비밀번호를 입력하세요:');
            if(enteredPassword === null){
              return;
            }
            if (enteredPassword !== pwd) {
              commons.showToast(this, '비밀번호가 일치하지 않습니다.');
              return;
            } 
        } 
      }

      if(!this.myUserYn){
        if(user_cnt >= expire_cnt){
          commons.showToast(this, '입장할 수 없습니다. 방이 가득 찼습니다.');
          return;
        }
      }   

      if(!this.myUserYn){
        chatMethods.methods.chatInsertUser(chat_id,this.loginUserId,(res) => {
            if(res.status === 200){
              userIdsArray.push(this.loginUserId);
              this.selectedChatId = chat_id;
              this.selectSubject = subject;
              this.selectUser = userIdsArray;
              //this.$router.push(`/chat/${this.selectedChatId}`);
            }
          },
          (error) => { // 에러 콜백
            if(error.response.status === 401){
              commons.showToast(this, '방 인원이 가득찼습니다. ');
              this.search01(this.activeTab);
              return;
            } else {
              commons.showToast(this, '일반유저는 최대 방10개까지만 입장 및 개설이 가능합니다.');
              return;
            }
            
          }
        );
      } else {
        this.selectedChatId = chat_id;
        this.selectSubject = subject;
        this.selectUser = userIdsArray;
        //this.$router.push(`/chat/${this.selectedChatId}`);
      }

      
    },
    nextPage() {
      if (this.currentPage < this.pageCount) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    //채팅>채팅목록 호출
    changeSelectedChatId(chatId) {
      this.selectedChatId = chatId;
      this.myUserYn = false;
      this.search01(this.activeTab);
    },
    exit() {
      try{
        for (let key in localStorage) {
          if (key !== "token") {
            localStorage.removeItem(key);
          }
        }
        this.exitChat(); //소켓종료
        this.search01(this.activeTab);
      } catch(error){}
      this.selectedChatId = null;
      this.myUserYn=false;
    },
    //조회
    search01: debounce(async function (tab) {
      try { 
        const token = localStorage.getItem('token');
        if(token){
          this.searchUserId = this.loginUserId; // 사용자 아이디 추출
          this.searchUserId2 = this.loginUserId; // 사용자 아이디 추출
        } else {
          this.searchUserId = null;
          this.searchUserId2 = null;
        }
        
        if (tab === 'ALL'){
          this.searchUserId = null; // 사용자 아이디 추출
        } 
        const response = await api.get("/api/chat/search",{ params: { q: this.searchKeyword, userId:this.searchUserId , userId2: this.searchUserId2 } });
        this.chatRooms = response.data;
        this.searchUserId = null;
      } catch (error) {
        console.error("검색 오류:", error);
      }
    }, 200),
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
        commons.showToast(this, '방 제목을 입력해주세요.');
        return;
      } 
      if(this.subject.length >= 40){
        commons.showToast(this, '제목은 20자내로 입력해주세요.');
        return;
      } 
      if(this.expire_cnt === '' ){
        commons.showToast(this, '인원수를 입력해주세요.');
        return;
      }
      if(!commons.loginCheck()) return;
      const userid = this.loginUserId; 
      chatMethods.methods.createChatRoom(this.subject, this.newPassword, userid, this.expire_cnt, (res) => {
            if(res.status === 200){
              this.createChatRoom02(res.data.chat_id, userid);
            }
          },
          (error) => { // 에러 콜백
            commons.showToast(this, '일반유저는 최대 방10개까지만 입장 및 개설이 가능합니다.');
            this.createChatModal = false;
            console.error("방만들기 오류:", error);
          });
    },
    //방만들기 후처리
    createChatRoom02(chat_id, userid){
      chatMethods.methods.createChatRoom02(chat_id, userid, (res) => {
            if(res.status === 200){
              commons.showToast(this, '방이 생성되었습니다.');
              this.createChatModal = false;
              this.search01(this.activeTab);
            }
          },
          (error) => { // 에러 콜백
            this.createChatModal = false;
            console.error("채팅방 입장 오류:", error);
          });
    },
    pushEmptyState() {
      window.history.pushState({}, ""); // 브라우저 히스토리 변경
    },
    handleMobileBackButton(event) {
      // 모바일 뒤로가기 버튼이 눌렸을 때 실행할 로직
      this.exit(); 
    },
    //imgurl조회전처리
    async getImageUrls(chatRooms){
      for (const chatRoom of chatRooms) {
        if (chatRoom.profile_id !== null) {
          try {
            chatRoom.imageUrl = chatRoom.profile_id;
          } catch (error) {
            console.error("이미지 URL 조회 오류:", error);
          }
        }
      }
    },
  },
  created() {
    const token = localStorage.getItem('token');
    if(token){
      const login_token = localStorage.getItem('token');
      const decoded_Token = jwtDecode(login_token);
      this.loginUserId = decoded_Token.username;
    }
    this.search01('ALL');
  },
  watch: {
    chatData(newChatData) {
      this.selectedChatId = null;
      setTimeout(() => {
       this.selectedChatId = newChatData;
      }, 200); // 500ms(0.5초) 후에 실행됩니다.
    },
  },
};
</script>
  
<style scoped>
* {
  font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI"
  , "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
  font-weight: 500;
}
.tabs-container, .page-container {
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
    border: 1px solid #ccc;
  }

  .tab {
    padding: 10px;
    cursor: pointer;
  }

  .active {
    font-weight: bold;
    border-bottom: 2px solid #333; /* 선택된 탭 하단 선 색상 */
    background-color: #3498db; /* 선택된 탭 배경색 */
    color: white;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .chat-section {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
  }

  .chatroom-subject{
    font-size: 15px;
    color: #333;
    font-weight: bold;
    margin-bottom: 10px;
    margin-left: 5px;
  }

  .shadow-sm{
    background-color: rgb(227, 244, 255);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
 
  .search-input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    color: #333;
    width: 300px;
  }

  .thumbnail-image {
    flex-shrink: 0;
    max-width: 40px;
    max-height: 40px;
    min-width: 40px;
    min-height: 40px;
    border-radius: 50%;
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

.class-search{
  width:50px; 
  height: 42px; 
  margin-top:-5px; 
  margin-left: -8px;
}
.class-search:hover{
  cursor: pointer;
}

.create-button {
    cursor: pointer;
    margin-left: 5px;
    width:50px; 
    height:42px;
    margin-top:-5px; 
  }
  .chatroom-readCount {
  display: inline-block;
  width: 20px;
  height: 17px;
  background-color: red; /* 배경색 설정 */
  color: #FFFFFF; /* 글자색 설정 */
  border-radius: 50%; /* 원 모양으로 만들기 */
  text-align: center; /* 텍스트 가운데 정렬 */
  line-height: 17px; /* 수직 가운데 정렬 */
  font-size: 12px; /* 글자 크기 설정 */
  font-weight: bold; /* 글자 굵게 설정 */
  margin-left: 5px;
}
.chatroom-readCount:empty {
  display: none; /* 내용이 없는 경우 숨김 */
}

.search-button{
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 16px;
    margin-top: 20px;
    cursor: pointer;
  }

  .regist-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  font-size: 16px;
  cursor: pointer;
  outline: none;
}
.regist-container {
  position: fixed;
  bottom: 10%;
  right: 15%;
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 9999;
}

/* 모달 style 끝 */
  
  @media (max-width: 768px) {
    .class-search{
      width:40px; 
      height: 38px; 
      margin-top:-3px; 
      margin-left: -8px;
    }
    .create-button {
      cursor: pointer;
      margin-left: 5px;
      width:40px; 
      height:38px;
      margin-top:-3px; 
    }

    .search-button{
      font-size: 12px;
    }
    
    .search-input {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 12px;
      color: #333;
      width: 150px;
    }
 
    .regist-button {
    width: 60px;
    height: 60px;
    font-size: 10px;
    }
    .regist-container {
    top: 15%;
    right: 30px;
    width: 60px;
    height: 60px;
  }

  }
  @media (min-width: 768px) {
   
  }


</style>