<template>
  <div>
    <div class="chat-main" v-if="selectedChatId !== null">
      <ChatRoom01 ref="chatComponent" :selectedChatId="selectedChatId" :selectSubject="selectSubject" :selectUser="selectUser" @changeSelectedChatId="changeSelectedChatId" />
    </div>
    <div class="chat-room" v-if="selectedChatId === null">
      
      

        <div class="album py-5 bg-body-tertiary">
          <div class="container">
            <div class="tabs-container">
              <div class="tabs">
                <div v-for="(tab, index) in tabs" :key="index" @click="handleTabClick(tab)" :class="{ active: activeTab === tab }"  class="tab">
                  {{ tab }}
                </div>
              </div>
            </div>
            <section>
                <div class="bottom_10">
                  <p>
                    <input type="text" v-model.trim="searchKeyword" v-if="activeTab === 'ALL'" @keyup.enter="search01('ALL')" placeholder="Search" class="search-input" />
                    <input type="text" v-model.trim="searchKeyword" v-if="activeTab === 'My Chat'" @keyup.enter="search01('My Chat')" placeholder="Search" class="search-input" />&nbsp;
                    <button v-if="activeTab === 'ALL'" @click="search01('ALL')" class="search-button"><font-awesome-icon icon="search" /></button>
                    <button v-if="activeTab === 'My Chat'" @click="search01('My Chat')" class="search-button"><font-awesome-icon icon="search" /></button>
                  </p>
                </div>
            </section>
            
            <div>
              <div class="bottom_10" v-for="(chatRooms, index) in displayedChatRooms" :key="index"  @click="openChatRoom(chatRooms)">
                <div class="card shadow-sm">
                  <div class="card-body">
                      <span>
                        <img v-if="chatRooms.profile_id !== null" :src="chatRooms.imageUrl" class="thumbnail-image" />
                        <img v-if="chatRooms.profile_id === null" src="../../assets/profile-user.png" class="thumbnail-image" />
                        <span class="chatromm-cnt" style="margin-left: 10px;">{{ chatRooms.user_cnt }}/{{ chatRooms.expire_cnt }}</span>
                      </span>
                      <span class="chatroom-subject">{{ chatRooms.subject }}</span>
                      <span v-if="chatRooms.pwd !== null"><font-awesome-icon icon="lock" /></span>
                      <span class="chatroom-readCount" id="notReadCount">{{ chatRooms.notReadCnt }}</span>
                    <div class="d-flex justify-content-between align-items-center">
                      <span  class="chatroom-message">{{ truncatedTitle(chatRooms.message) }}</span>
                      
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
      <div class="regist-container" v-if="selectedChatId === null">
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
       <!-- 로딩영역 -->
       <div class="loading-overlay" v-if="loading">
          <img src="@/assets/loading.gif" alt="로딩 중" class="loading-spinner" />
        </div>
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
  unmounted() {
    // 컴포넌트가 제거되기 전에 이벤트 리스너 해제
    window.removeEventListener("popstate", this.handleMobileBackButton);
  },
  data() {
    return {
      loading:false,
      loginUserId:null,
      searchKeyword: '',
      chatRooms: [],
      selectedChatId: null,
      selectSubject:null,
      selectUser:[],
      checkFlag:false,
      myUserYn:false,  //방 입장여부(본인)
      tabs:['My Chat', 'ALL'],
      activeTab: 'My Chat',
      searchUserId: null,
      createChatModal: false, // 모달 창 띄우기 여부
      expire_cnt: 2, // 초기 값 1로 설정
      subject: '방제목을 입력해주세요', // 초기 값 1로 설정
      chatRooms: [],        // 전체 채팅방 정보가 들어 있는 배열
      itemsPerPage: 100,
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
    truncatedTitle(title) {
      if(title !== null){
        let maxLength = 30;
        // 최대 길이 설정
        return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
      }
      else return title
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
        this.loading = true;
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
        this.loading = false;
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
    this.search01('My Chat');
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
</style>

<style scoped src="@/styles/common.css"></style>
<style scoped src="@/styles/chat_main.css"></style>