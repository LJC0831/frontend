<template>
  <div>
    <div class="chat-main" v-if="selectedChatId !== null">
      <ChatRoom01 :selectedChatId="selectedChatId" />
      <button class="btn btn-primary" id="btn-exit" @click="exit()">나가기</button>
    </div>
    <div class="chat-room" v-if="selectedChatId === null">
      <section class="chat-section">
        <div class="chat_row">
          <div class="chat_left">
            <h1 class="chat-title">자유로운 채팅방</h1>
            <p class="chat-description">누구나 자유롭게 채팅이 가능합니다. 욕설 및 성희롱 등 입력 시 제재 될 수 있습니다. 매너채팅 부탁드립니다 ^^</p>
            <p>
              <input type="text" v-model="searchKeyword" @keyup.enter="search01()" placeholder="Search" class="search-input" />&nbsp;
              <button class="btn btn-primary search-button" @click="search01()">조회</button>
              <button class="btn btn-success create-button" @click="createChatRoom()">방 만들기</button>
            </p>
          </div>
        </div>
      </section>

      <div class="album py-5 bg-body-tertiary">
        <div class="container">
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4" id="chat_main_img">
            <div class="col" v-for="(chatRooms, index) in chatRooms" :key="index" @click="openChatRoom(chatRooms.id,chatRooms.pwd)">
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
    };
  },
  methods: {
    //채팅방 open
    openChatRoom(chat_id,pwd) {
      if(pwd ==! null){
        const enteredPassword = prompt('비밀번호를 입력하세요:');
        if (enteredPassword !== null) { 
          if (enteredPassword === pwd) {
            this.selectedChatId = chat_id;
          } else {
            alert('비밀번호가 일치하지 않습니다.');
          }
        }
      } else {
        this.selectedChatId = chat_id;
      }
      
    },
    exit() {
      this.selectedChatId = null;
    },
    //조회
    search01: debounce(async function () {
      try {
        const response = await api.get("/api/chat/search");
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
        debugger;
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

  .chat-title {
    font-family: 'Arial', sans-serif;
    font-size: 28px;
    color: #333;
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

</style>