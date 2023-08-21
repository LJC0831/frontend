<template>
  <div>
    <div class="chat-main" v-if="selectedChatId !== null">
      <ChatRoom01 :selectedChatId="selectedChatId" :selectSubject="selectSubject"/>
      <button class="btn btn-primary search-button" id="btn-exit" @click="exit()">나가기</button>
    </div>
    <div class="chat-room" v-if="selectedChatId === null">
      <section class="chat-section">
        <div class="chat_row">
          <div class="chat_left">
            <h1 class="chat-title">자유로운 채팅방</h1>
            <p class="chat-description">누구나 자유롭게 채팅이 가능합니다. 욕설 및 성희롱 등 입력 시 제재 될 수 있습니다. 매너채팅 부탁드립니다 ^^</p>
            <p>
              <input type="text" v-model.trim="searchKeyword" @keyup.enter="search01()" placeholder="Search" class="search-input" />&nbsp;
              <button class="btn btn-primary search-button" @click="search01()">조회</button>
              <button class="btn btn-success create-button" @click="createChatRoom()">방 만들기</button>
            </p>
          </div>
        </div>
      </section>

      <div class="album py-5 bg-body-tertiary">
        <div class="container">
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4" id="chat_main_img">
            <div class="col" v-for="(chatRooms, index) in chatRooms" :key="index" @click="openChatRoom(chatRooms)">
              <div class="card shadow-sm">
                <div class="card-img-top">
                  <img v-if="chatRooms.file_no !== null" :src="chatRooms.imageUrl" alt="Chat Room Thumbnail" class="thumbnail-image" />
                  <svg v-else class="bd-placeholder-img" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#55595c" /><text x="40%" y="50%" fill="#eceeef" dy=".3em">사진없음</text></svg>
                </div>
                <div class="card-body">
                  <p class="card-text">
                    <span class="chatromm-subject">{{ chatRooms.subject }}</span>
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
  </div>
</template>

<script>
/* eslint-disable */
import { debounce } from 'lodash';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import ChatRoom01 from './chat_01.vue';
import loginMethods from '../../scripts/login.js';

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
      checkFlag:false,
    };
  },
  methods: {
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
        debugger;
        if(userId === userid  && chat_type==="1" ){
          this.checkFlag = true;
        }
      }
      if(!this.checkFlag && chat_type==="1"){
        alert('입장할 수 없습니다. 방장에게 초대를 받으세요');
        return;
      }

      if(pwd ==! null){
        const enteredPassword = prompt('비밀번호를 입력하세요:');
        if (enteredPassword !== null) { 
          if (enteredPassword === pwd) {
            this.selectedChatId = chat_id;
            this.selectSubject = subject;
          } else {
            alert('비밀번호가 일치하지 않습니다.');
          }
        }
      } else {
        this.selectedChatId = chat_id;
        this.selectSubject = subject;
      }
      
    },
    exit() {
      this.selectedChatId = null;
    },
    //조회
    search01: debounce(async function () {
      try {
        debugger;
        
        const response = await api.get("/api/chat/search",{ params: { q: this.searchKeyword } });
        this.chatRooms = response.data;

        for (const chatRoom of this.chatRooms) {
          if (chatRoom.file_no !== null) {
            try {
              const imageUrl = await this.getFileUrl(chatRoom.file_no);
              chatRoom.imageUrl = imageUrl;
            } catch (error) {
              console.error("이미지 URL 조회 오류:", error);
            }
          }
        }
      } catch (error) {
        console.error("검색 오류:", error);
      }
    }, 500),
    // 방만들기
    createChatRoom(){
      alert('아직은 관리자만 개설가능합니다.');
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
    this.search01();
  }
};
</script>
  
<style scoped>
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
    max-width: 100%;
    height: 225px;
    object-fit: cover;
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
  


</style>