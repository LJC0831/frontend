<template>
  <div>
    <div class ="chat-main" v-if="selectedChatId !== null">
      <ChatRoom01 :selectedChatId=selectedChatId />
      <button class="btn btn-primary" id ="btn-exit" @click="exit()">나가기</button>
  </div>
  <div class = "chat-room" v-if="selectedChatId === null">
  <section class="py-5 text-center container">
    <div class="row py-lg-5">
      <div class="col-lg-6 col-md-8 mx-auto">
        <h1 class="fw-light">자유로운 채팅방</h1>
        <p class="lead text-body-secondary">누구나 자유롭게 채팅이 가능합니다. 욕설 및 성희롱 등 입력 시 제재 될 수 있습니다. 매너채팅 부탁드립니다 ^^</p>
        <p>
          <button class="btn btn-primary my-2">채팅방 +</button>
        </p>
        <div>
          <input type="text" v-model="searchKeyword" @keyup.enter="search01()" placeholder="Search"/>&nbsp;
          <button class="btn btn-primary" @click="search01()">조회 </button>
        </div>
      </div>
    </div>
  </section>

  <div class="album py-5 bg-body-tertiary">
    <div class="container">

      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        <div class="col" v-for="(chatRooms, index) in chatRooms" :key="index" @click="openChatRoom(chatRooms.id)">
          <div class="card shadow-sm">
            <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em">{{ chatRooms.subject }}</text></svg>
            <div class="card-body">
              <p class="card-text">
                <span class="chatromm-subject">{{ chatRooms.subject }}</span>
                <span class="chatromm-user_id">{{ chatRooms.ins_user_id }}</span>
              </p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
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

// axios 인스턴스 생성
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
        searchKeyword: '', // 검색어를 담을 변수 추가
        chatRooms: [],
        selectedChatId: null,
      };
    },
    methods: {
      openChatRoom(chat_id) { //채팅방 open
        
        this.selectedChatId = chat_id;
        //this.$emit('open-chat-room', chat_id); //이벤트발생
      },
      exit(){ //채팅방 나가기
        this.selectedChatId = null;
      },
      search01: debounce(function(){
        api.get("/api/chat/search").then((res) => {
          this.chatRooms = res.data;
      })
        }, 500)
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

      #btn-exit{
        float: right;
      }
</style>