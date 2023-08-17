<template>
  <div>
    <div class="chat-main" v-if="selectedChatId !== null">
      <ChatRoom01 :selectedChatId="selectedChatId" />
      <button class="btn btn-primary" id="btn-exit" @click="exit()">나가기</button>
    </div>
    <div class="chat-room" v-if="selectedChatId === null">
      <section>
        <div class="chat_row">
          <div class="chat_left">
            <h1 class="fw-light">자유로운 채팅방</h1>
            <p class="">누구나 자유롭게 채팅이 가능합니다. 욕설 및 성희롱 등 입력 시 제재 될 수 있습니다. 매너채팅 부탁드립니다 ^^</p>
            <p>
              <input type="text" v-model="searchKeyword" @keyup.enter="search01()" placeholder="Search" />&nbsp;
              <button class="btn btn-primary" @click="search01()">조회 </button>
            </p>
          </div>
        </div>
      </section>

      <div class="album py-5 bg-body-tertiary">
        <div class="container">
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4" id="chat_main_img">
            <div class="col" v-for="(chatRooms, index) in chatRooms" :key="index" @click="openChatRoom(chatRooms.id)">
              <div class="card shadow-sm">
                <div class="card-img-top">
                  <img v-if="chatRooms.file_no !== null" :src="chatRooms.imageUrl" alt="Chat Room Thumbnail" style="max-width: 100%; height: 225px;" />
                  <svg v-else class="bd-placeholder-img" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#55595c" /><text x="50%" y="50%" fill="#eceeef" dy=".3em">사진없음</text></svg>
                </div>
                <div class="card-body">
                  <p class="card-text">
                    <span class="chatromm-subject">{{ chatRooms.subject }}</span>
                    <span class="chatromm-user_id">{{ chatRooms.ins_user_id }}</span>
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
    openChatRoom(chat_id) {
      this.selectedChatId = chat_id;
    },
    exit() {
      this.selectedChatId = null;
    },
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
   .bd-placeholder-img {
        font-size: 1.125rem;
        text-anchor: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
      }

      @media (min-width: 768px) {
        .bd-placeholder-img-lg {
          font-size: 3.5rem;
        }
      }

      .b-example-divider {
        width: 100%;
        height: 3rem;
        background-color: rgba(0, 0, 0, .1);
        border: solid rgba(0, 0, 0, .15);
        border-width: 1px 0;
        box-shadow: inset 0 .5em 1.5em rgba(0, 0, 0, .1), inset 0 .125em .5em rgba(0, 0, 0, .15);
      }

      .b-example-vr {
        flex-shrink: 0;
        width: 1.5rem;
        height: 100vh;
      }

      .bi {
        vertical-align: -.125em;
        fill: currentColor;
      }

      .nav-scroller {
        position: relative;
        z-index: 2;
        height: 2.75rem;
        overflow-y: hidden;
      }

      .nav-scroller .nav {
        display: flex;
        flex-wrap: nowrap;
        padding-bottom: 1rem;
        margin-top: -1px;
        overflow-x: auto;
        text-align: center;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
      }

      .btn-bd-primary {
        --bd-violet-bg: #712cf9;
        --bd-violet-rgb: 112.520718, 44.062154, 249.437846;

        --bs-btn-font-weight: 600;
        --bs-btn-color: var(--bs-white);
        --bs-btn-bg: var(--bd-violet-bg);
        --bs-btn-border-color: var(--bd-violet-bg);
        --bs-btn-hover-color: var(--bs-white);
        --bs-btn-hover-bg: #6528e0;
        --bs-btn-hover-border-color: #6528e0;
        --bs-btn-focus-shadow-rgb: var(--bd-violet-rgb);
        --bs-btn-active-color: var(--bs-btn-hover-color);
        --bs-btn-active-bg: #5a23c8;
        --bs-btn-active-border-color: #5a23c8;
      }
      .bd-mode-toggle {
        z-index: 1500;
      }

      .chatromm-user_id{
        float: right;
      }
      .chat_row{
        margin-top: 20px;
      }
      .chat_left{
        margin-left: 20px;
      }
      #btn-exit{
        float: right;
      }


@media (max-width: 768px) {

  #chat_main_img{
        width:100%;
      }
}

</style>