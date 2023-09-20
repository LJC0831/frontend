<template>
  <div :class="['chat-container', { 'focused': isChatTextareaFocused }]">
    <!-- 채팅헤더 -->
    <div class="chat-header">
        <span><img src="@/assets/back-img.png" @click="exit()" style="width: 15px; margin-right: 10px;"></span> <!--https://www.flaticon.com/kr/free-icon/backward_318339 출처-->
        <span>{{ selectSubject }}</span>
        <span style="float: right;">
            <input v-if="isSearchChat" v-model.trim="searchKeyword" type="text" @keyup.enter="searchChatContent()" @input="handleInputChange" style="margin-right: 5px; height: 30px;"/>
            <span v-if="isSearchChat" style="margin-right: 5px;">{{searchChatContentArray.length}}/{{searchAllcount}}</span>
            <img src="../../assets/search-image.jpg"  @click="isSearchCheck()" class="class-search" style="width:30px; margin-right: 10px;"/>
            <i :class="'fas fa-bars'" @click="toggleSearch()"></i>
            
        </span>
    </div>
    <!-- 로딩 오버레이 -->
    <div v-if="loading" class="loading-overlay">
        <img src="../../assets/loading.gif" alt="loading" class="loading-image">
    </div>

    <!-- 채팅 메세지 -->
    <div class="chat-messages" ref="chatContainer" @scroll="checkScrollPosition">
      <!-- 메세지 표시 -->
      <div v-for="(message, index) in messages" :key="index" class="message" :ref="`chatItem-${index}`">
        <img v-if="!message.profilePicture && message.chat_type !== 'announcement'" src="../../assets/profile-user.png" alt="내 정보" class="profile-image" @click="profilePop(message.user_id, message.editedName)"/>
        <img v-if="message.profilePicture && message.chat_type !== 'announcement'" class="profile-image" :src="message.profilePicture" alt="프로필 사진"  @click="profilePop(message.user_id, message.editedName)"/>
        <div class="message-container" >
          <div class="message-content">
          <span class="message-name">{{ message.editedName }} </span>
          <span @click="answer_search(message)" v-if="message.answer_message && message.answer_message !== `undefined`" class="message-answer-text">{{ message.answer_user_id }} : {{ message.answer_message }}</span>   
            <div @click="chat_answer(message)" class="message-bubble" :class="{ 'announcement-message': message.chat_type === 'announcement' && message.chat_type !== 'search'
                                                , 'search-message': message.chat_type === 'search'
                                                , 'other-message': message.user_id !== this.loginUserId && message.chat_type !== 'search'
                                                , 'my-message': message.user_id === this.loginUserId && message.chat_type !== 'search' }">
              <span class="message-text" v-html="formatMessage(message.message)"></span>
            </div>
            <div v-if="message.chat_type === 'image'" class="message-bubble image-bubble">
              <img v-if="message.chat_type === 'image'" :src="message.chatimageUrl" alt="이미지" class="message-image" @click="openImageModal(message.chatimageUrl)"/>
            </div>
            <div v-if="message.chat_type === 'emoticon'" class="message-bubble image-bubble">
              <img v-if="message.chat_type === 'emoticon'" :src="message.chatimageUrl" alt="이모티콘" class="message-image"/>
            </div>
            <div v-else-if="message.chat_type === 'file'" class="message-bubble file-bubble">
              <a :href="message.chatimageUrl" target="_blank">다운로드</a>
            </div>
          </div>
          <div>
            <img v-if="message.thumbnailUrl" :src="message.thumbnailUrl" alt="미리보기 사진"  class="chat_thumbnailUrl" />
          </div>
        </div>
        <span class="message-view" v-if="message.selectUserCount !== 0" >{{ message.selectUserCount }}</span>
        <span class="message-date">{{ formatDate(message.ins_ymdhms) }}</span>
      </div>
    </div>
    <!-- 채팅 입력 -->
    <div class="chat-input">
      <label for="imageInput" class="upload-button">
          <img src="../../assets/uploadIKon.png" alt="첨부 아이콘" />
      </label>
      <textarea  autocomplete="off" v-model="newMessage" class ="chat-textarea" 
      ref="sendButton"
      @keyup.esc="this.answerMessage = null"
      @focus="handleChatTextareaFocus"
      @blur="handleChatTextareaBlur"
      @paste="handleImagePaste" @keydown="handleKeyDown" placeholder="메시지를 입력하세요..." />
      <label for="imoticon" class="imoticon-button" @click="openEmoticonModal">
          <img src="../../assets/imoticon.png" alt="이모티콘" style="width:30px;" />
      </label>
      <div>
        <input type="file" id="imageInput" ref="imageInput" @change="handleUpload" class="hidden-input"/>
        <button @click="sendMessage()" v-if="!loading" class="send-button"><i class="fas fa-paper-plane"></i> </button>
        <button @click="sendMessage()" v-if="loading" class="send-button">Loading...</button>
      </div>
    </div>
    <!-- 모달 창 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>접속 중인 대상자 목록</h2>
        <ul>
          <li v-for="(selectUser, index) in selectUser" :key="index">
            <img v-if="userPicture[index]" class="profile-image" :src="userPicture[index]" width="100" height="100" alt="프로필 사진" /> 
            <img v-else class="profile-image" src="@/assets/profile-user.png" width="100" height="100" alt="프로필 사진" /> 
            {{ selectUser }}
          </li>
        </ul>
        <button v-if="!loading2" class="chat_exit" @click="exitUser()">방나가기</button>
        <button v-if="loading2" class="chat_exit" @click="exitUser()">Loading...</button>
        <button class="modal_close" @click="closeModal">닫기</button>
        
      </div>
    </div>
    <!-- 이미지url 모달 창 -->
    <div v-if="isImageModalOpen" class="modal">
      <div class="modal-content2"  @click="this.$refs.closeButton.focus()">
        <img :src="selectedImage" alt="확대 이미지" class="enlarged-image">
        <button ref="closeButton" class="modal_close" @click="closeImageModal" @keyup.esc="closeImageModal">닫기</button>
      </div>
    </div>
    <!-- 스크롤 다운 버튼과 팝업 컨테이너 -->
    <div v-if="showScrollPopup && !isChatTextareaFocused"  class="scroll-down-container">
      <button @click="scrollToBottom" class="scroll-down-button">
        <i class="fas fa-chevron-down"></i>
      </button>
    </div>
    <!-- 프로필 조회 모달 -->
    <div v-if="isUserProfileModalVisible" class="profile-modal">
    <div class="profile-modal-content">
          <div class="profile-picture-container">
              <img v-if="!profilePopimgUrl" src="../../assets/profile-user.png" alt="내 정보" class="profile-pop-image" />
              <img v-if="profilePopimgUrl" class="profile-pop-image" :src="profilePopimgUrl" alt="프로필 사진" />
          </div>
          <div class="profile-details">
              <span><h2>{{ profilePopId }}</h2></span>
              <!-- 다른 프로필 정보를 표시할 수도 있습니다. -->
          </div>
          <div class="profile-actions">
              <button ref="closeButton" @click="isUserProfileModalVisible = false;" @keyup.esc="isUserProfileModalVisible = false;">닫기</button>
          </div>
      </div>
    </div>
    <!-- 선택한 메시지가 확장되었을 때만 표시 -->
     <div v-if="this.answerFoucs" @click="this.answerFoucs = null" class="message-answer-text">
        <p style="margin-left:50px;">답장 → {{ this.answerUserId }} : {{ this.answerMessage }}</p>
    </div>
    <!-- 이모티콘 모달 -->
    <div v-if="isStickerModal" class="sticker-modal">
      <!-- 이모티콘 선택 영역 -->
      <div class="sticker-selector" style="width:250px">
        <img
            class="sticker-image"
            v-for="stickerId in ['281', '282', '283', '284', '285', '286', '287', '288', '289', '290', '291', '292', '293', '294']"
            :key="stickerId"
            :src="require(`../../assets/sticker/bear-image${stickerId}.png`)"
            @click="selectEmoticon(stickerId)"
          />
      </div>
      <span><a href="https://www.flaticon.com/kr/" target="_blank" title="스티커">출처</a></span>
      <!-- 닫기 버튼 -->
      <button class="modal-close" @click="closeEmoticonModal">X</button>
    </div>

  </div>
</template>
  
  <script>
  /* eslint-disable */
  import io from 'socket.io-client';
  import jwtDecode from 'jwt-decode';
  import loginMethods from '../../scripts/login.js';
  import chatMethods from '../../scripts/chat.js';
  import * as commons from '../../scripts/common.js';

  export default {
    props: {
      selectedChatId: String, // 전달되는 chatId의 타입
      selectSubject: String,
      selectUser: String,
    },
    data() {
      return {
        messages: [],
        loading: false,
        newMessage : '',
        editedName : "", 
        file_no : null,
        profilePicture: null,
        chatContainer: null,
        loadingPreviousMessages: false, // 이전 채팅 내역 로딩 상태
        shouldMaintainScroll: true, // 스크롤을 유지할지 여부를 나타내는 변수
        oldestMessageTime: null,   //이전메세지 시간
        lastMessageTimestamps: [], // 최근 8개 메시지의 타임스탬프를 저장합니다.
        messageCount: 0, // 최근 10초 내에 보낸 메시지의 수를 저장합니다.
        showModal: false, // 모달 표시 여부
        userPicture:[], // 참가유저들 사진
        maxFileSize: 10 * 1024 * 1024, // 10MB (메가바이트)
        isImageModalOpen: false,
        selectedImage: '',
        scrollPosition: [], //현재스크롤위치
        previousNotification :false, //알람처리변수
        userSockets: [],//소켓
        loginUserId:null, //로그인유저
        firstChat:null, //스크롤 기준 맨위채팅
        loading2: false,
        isChatTextareaFocused: false, //텍스트박스 포커싱여부
        ismobile:this.isMobile() ? false : true, //뒤로가기버튼활성화여부
        userViewCount:0,
        isSearchChat:false, //채팅검색여부
        searchChatcontentPosition:0, //채팅검색위치id
        searchChatContentArray: [], //검색위치배열저장
        searchPosition: 0, //검색위치
        searchAllcount:null, //검색채팅(전체개수)
        isStickerModal:false, //이모티콘 활성화여부
        showScrollPopup:false, //스크롤모달 활성화여부
        isUserProfileModalVisible: false, // 프로필확인
        profilePopId: null, //프로필확인대상 Id
        profilePopimgUrl: null, // 프로필확인대상 이미지
        replyText: "", //답장
        answerMessage: null,//답장선택한메세지
        answerId: null,//답장선택한메세지 id
        answerUserId: null, //답장선택한userid
        answerFocusColor:null, //포커스color 
        answerFoucs:null, //답장포커스여부
        thumbnailUrl:null, //썸네일이미지
      };
    },
    created() {
      const login_token = localStorage.getItem('token');
      const decoded_Token = jwtDecode(login_token);
      this.loginUserId = decoded_Token.username;
      // Socket.IO 클라이언트를 초기화하고 서버에 연결합니다.
      //this.socket = io('http://localhost:3000', {
      this.socket = io('https://port-0-backend-nodejs-20zynm2mlk2nnlwj.sel4.cloudtype.app', {
        withCredentials: true, // 쿠키와 인증 정보를 전송할 수 있도록 설정 (선택 사항)
        query:{
          userId:this.loginUserId, //로그인유저
        }
      });
      this.socket.emit('getLatestMessages',this.selectedChatId, this.loginUserId);
      this.manageUserSocket(this.loginUserId, this.socket);

      this.profileSearch(this.loginUserId);
      // 서버에 최근 메시지를 요청합니다.
      this.loading = true;
      if(!this.ismobile){
        commons.showToast(this, '채팅내역을 불러옵니다.');
        this.getChatUserInfo();
      }
      

      // 서버로부터 메시지를 받으면 채팅 화면에 메시지를 표시합니다.
      this.socket.on('message', (message) => {
        if (message.chatId === this.selectedChatId) {
          if(message.user_id !== this.loginUserId){ //채팅을 받을때
              this.previousMessage = message.message;
              message.profilePicture = this.chatUserProfileUrl(message.user_id);
              this.showNotification(message.message,message.profilePicture); // 새 메시지 알림 표시
              // 메시지 읽음 처리 후 데이터 갱신
              if(document.hasFocus()) { //포커싱중일때 메세지확인처리
                this.socket.emit('setMessageRead',message.chatId, this.loginUserId, 'Y');
              } else {
                this.socket.emit('setMessageRead',message.chatId, this.loginUserId, 'N');
              }
                this.$nextTick(() => {
                  this.messages.push(message);
                  if(this.chatContainer.scrollTop * 2 > this.chatContainer.scrollHeight){
                      setTimeout(() => {
                      this.scrollToBottom();
                    }, 100); // 100ms(0.1초) 후에 실행됩니다.
                  }
                  
                });
          } else { //채팅을 내가 입력할때
            this.messages.push(message);
            this.newMessage = '';
            setTimeout(() => {
              this.socket.emit('setMessageRead',message.chatId, this.loginUserId, 'Y');
            }, 300); // 100ms(0.1초) 후에 실행됩니다.
          }
        }
      });
      // 메세지 읽음처리
      this.socket.on('getMessageRead', (lastMessage) => {
        const urlsToFetch = [];
         for (var i = 1; i <= this.messages.length; i ++){
          this.messages[this.messages.length-i].selectUserCount = lastMessage[lastMessage.length-i].selectUserCount;
          this.messages[this.messages.length-i].id = lastMessage[lastMessage.length-i].id;
          const linkTagPattern = /https?:\/\/\S+|www\.\S+/g;
          if(linkTagPattern.test(this.messages[this.messages.length-i].message) && this.messages[this.messages.length-i].thumbnailUrl === undefined){
            let url = this.messages[this.messages.length-i].message;
            if (url.startsWith('www.')) {
              url = 'http://' + url;
            }
            urlsToFetch.push({ url, index: this.messages.length - i });
          }
          if(i === '199'){
            break;
          }
         }
         urlsToFetch.forEach(async ({ url, index }) => {
          await this.fetchThumbnail(url, index);
        });

        setTimeout(() => {
          this.scrollToBottom();
        }, 100); // 100ms(0.1초) 후에 실행됩니다.
      });

      // 서버로부터 최근 메시지를 받을 때 호출되는 콜백 함수
      this.socket.on('messageHistory', (messages) => {
        // 받은 채팅 메시지들을 화면에 표시하는 로직
        this.messages = messages;
        const urlsToFetch = [];
        for (let i = 1; i <= this.messages.length; i ++){
          // 프로필사진 가져오기
          this.messages[this.messages.length-i].profilePicture = this.chatUserProfileUrl(this.messages[this.messages.length-i].user_id);

          const linkTagPattern = /https?:\/\/\S+|www\.\S+/g;
          if(linkTagPattern.test(this.messages[this.messages.length-i].message) && this.messages[this.messages.length-i].thumbnailUrl === undefined){
            let url = this.messages[this.messages.length-i].message;
            if (url.startsWith('www.')) {
              url = 'http://' + url;
            }
            urlsToFetch.push({ url, index: this.messages.length - i });
          }
         }
         urlsToFetch.forEach(async ({ url, index }) => {
          await this.fetchThumbnail(url, index);
        });

        setTimeout(() => {
          this.scrollToBottom();
        }, 100); // 100ms(0.1초) 후에 실행됩니다.
        // chatContainer 요소의 레퍼런스를 가져옵니다.
        this.$nextTick(() => {
          this.chatContainer = this.$refs.chatContainer;
          // 최근 메시지를 받은 후에 스크롤을 아래로 이동합니다.
          setTimeout(() => {
            this.scrollToBottom();
            this.loading = false;
          }, 100); // 100ms(0.1초) 후에 실행됩니다.
        });

      });
      // 스크롤 올릴떄 이전내역 가져오기
      this.socket.on('previousMessages', (previousMessages) => {
        this.loading = true;
        // 받아온 이전 채팅 내역을 messages 배열의 앞쪽에 추가
        for (var i = 1; i <= previousMessages.length; i ++){
          previousMessages[previousMessages.length-i].profilePicture = this.chatUserProfileUrl(previousMessages[previousMessages.length-i].user_id);
         }
        this.messages.unshift(...previousMessages);
          
        // 이전 채팅 내역을 받아온 후 스크롤 위치를 조정
        this.$nextTick(() => {
          if (this.chatContainer) {
            // 스크롤을 유지하도록 조정
            if (this.shouldMaintainScroll) {
              this.scrollPosition.push(this.chatContainer.scrollHeight / 2);
              this.chatContainer.scrollTop = this.scrollPosition[0]; 
            } else {
              this.shouldMaintainScroll = true; // 스크롤 유지 변수를 다시 활성화
            }
          }
        });
        setTimeout(() => {
          this.loading = false;
         }, this.chatContainer.scrollHeight/100); // 300ms(0.3초) 후에 실행됩니다.
        
      });

      // 채팅내역찾기
      this.socket.on('messageSearch', (messages) => {
        // 받은 채팅 메시지들을 화면에 표시하는 로직
        this.messages = messages;
        for (var i = 1; i <= this.messages.length; i ++){
          this.messages[this.messages.length-i].profilePicture = this.chatUserProfileUrl(this.messages[this.messages.length-i].user_id);
         }
        if(messages.length > 0){
          this.searchChatcontentPosition = messages[0].id;
          this.searchChatContentArray.push(this.searchChatcontentPosition);
          this.searchPosition = messages.length;
          this.searchAllcount = messages[0].tot_search_count;
          this.loading = false;
          // chatContainer 요소의 레퍼런스를 가져옵니다.
          setTimeout(() => {
            this.chatContainer = this.$refs.chatContainer;
            if(this.searchPosition <= 7){
              this.chatContainer.scrollTop = 2000;
            } 
            else {
              this.chatContainer.scrollTop = 1;
            }
          }, 300); // 300ms(0.3초) 후에 실행됩니다.
        } else {
          commons.showToast(this, '찾는 메세지가 없습니다.');
          this.loading = false;
          this.socket.emit('getLatestMessages',this.selectedChatId, '');
        }
        
      });

      // 답장내역찾기
      this.socket.on('setSearchAnswer', (messages) => {
        // 받은 채팅 메시지들을 화면에 표시하는 로직
        this.messages = messages;
        for (var i = 1; i <= this.messages.length; i ++){
          this.messages[this.messages.length-i].profilePicture = this.chatUserProfileUrl(this.messages[this.messages.length-i].user_id);
         }
        if(messages.length > 0){
          this.searchChatcontentPosition = messages[0].id;
          this.searchChatContentArray.push(this.searchChatcontentPosition);
          this.searchPosition = messages.length;
          this.searchAllcount = messages[0].tot_search_count;
          this.loading = false;
          // chatContainer 요소의 레퍼런스를 가져옵니다.
          setTimeout(() => {
            this.chatContainer = this.$refs.chatContainer;
            this.chatContainer.scrollTop = 1;
          }, 300); // 300ms(0.3초) 후에 실행됩니다.
        } else {
          commons.showToast(this, '찾는 메세지가 없습니다.');
          this.loading = false;
          this.socket.emit('getLatestMessages',this.selectedChatId, '');
        }
        
      });
    },
    mounted() {
      // 페이지 로드 시 로컬 스토리지에서 이미지 URL을 로드합니다.
      this.getChatUserInfo();
      // 3시간(밀리초 단위)마다 this.getChatUserInfo() 호출
      this.intervalId = setInterval(() => {
        this.getChatUserInfo();
      }, 3 * 60 * 60 * 1000); // 3시간 간격
    },
    beforeUnmount() {
        // 컴포넌트가 파괴되기 직전에 interval을 클리어해야 함
        clearInterval(this.intervalId);
      },
    methods: {
      //모바일판단
      isMobile() {
        return window.innerWidth <= 800; // 600px 이하면 모바일로 판단
      },
      // 썸네일 가져오기
      async fetchThumbnail(sendUrl, index) {
        // 백엔드 서버로 URL을 전송하고 썸네일 이미지 URL을 받아옴
        try {
          const response = await fetch('https://port-0-backend-nodejs-20zynm2mlk2nnlwj.sel4.cloudtype.app/api/fetchThumbnail', {
            method: 'POST',
            body: JSON.stringify({ url: sendUrl }),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            this.messages[index].thumbnailUrl = data.thumbnailUrl;
            setTimeout(() => {
                      this.scrollToBottom();
            }, 50); // 100ms(0.1초) 후에 실행됩니다.
          }
        } catch (error) {
          console.error('오류 발생:', error);
        }
      },
      // 채팅답장
      chat_answer(message){
        this.$refs.sendButton.focus();
        this.answerFoucs = true;
        this.answerMessage = message.message;
        this.answerId = message.id;
        this.answerUserId = message.editedName;
      },
      // Search 내용 초기화
      handleInputChange() { 
        // 입력값이 변경될 때 실행되는 로직을 여기에 작성
        this.searchChatcontentPosition = 0; //채팅검색위치id
        this.searchAllcount = null; //검색된채팅전체개수
        this.searchChatContentArray= []; //검색위치배열저장
        this.searchPosition = 0; //검색위치
      },
      // 웹소켓종료
      disconnectWebSocket() {
      // 웹소켓 연결을 끊는 작업을 수행합니다.
        if (this.socket) {
          this.socket.close();
          this.socket = null; // 소켓 변수 초기화
        }
      },
      // 채팅목록 이동
      changeChatIdInChild() {
        // 새로운 채팅 ID로 변경
        this.$emit('changeSelectedChatId', null);
      },
      //소켓유저확인
      manageUserSocket(userId, socket){
        if (this.userSockets[userId]) {
          // 이미 해당 사용자의 연결이 존재하면 연결을 종료합니다.
          this.userSockets[userId].disconnect();
        }
        // 새로운 웹소켓 연결을 저장합니다.
        this.userSockets[userId] = socket;
      },
    //채팅전송(엔터처리)
    handleKeyDown(event) {
      // 쉬프트 엔터처리
      if ((event.key === "Enter"||event.keyCode === 13) && !event.shiftKey) {
        this.sendMessage();
      }
    },
    //textarea 포커싱
    handleChatTextareaFocus() {
      if(!this.ismobile){
        setTimeout(() => {
          this.chatContainer.scrollTop = this.chatContainer.scrollHeight + 2000;
        }, 500); // 100ms(0.1초) 후에 실행됩니다.
      }
      
      this.socket.emit('setMessageRead',this.selectedChatId, this.loginUserId, 'Y');
      this.isChatTextareaFocused = true;
    },
    // textarea 포커싱해제
    handleChatTextareaBlur() {
      this.isChatTextareaFocused = false;
      this.answerFoucs = false;
      const currentlyFocusedElement = document.activeElement; // 현재 포커스를 가진 요소 가져오기
      currentlyFocusedElement.blur();
    },
      //메세지 줄바꿈처리
      formatMessage(message) {
        // URL 처리
        const urlPattern = /https?:\/\/\S+|www\.\S+/g;
        const formattedMessage = message.replace(/\n/g, '<br>').replace(/ /g, "&nbsp;").replace(urlPattern, (url) => {
          if (url.startsWith("www.")) {
            // "www"로 시작하는 URL 앞에 "https://"를 추가
            return `<a href="https://${url}" target="_blank">${url}</a>`;
          } else {
            return `<a href="${url}" target="_blank">${url}</a>`;
          }
        });
        
        return formattedMessage;
      },
      //뒤로가기
      exit(){
        this.disconnectWebSocket();
        this.changeChatIdInChild();
      },
      //방 나가기
      exitUser(){
        this.loading2 = true;
        this.disconSession();
        const chat_id = this.selectedChatId;
        this.disconnectWebSocket();
        chatMethods.methods.chatDeleteUser(chat_id,this.loginUserId,(res) => {
            if(res.status === 200){
            this.showModal = false;
            this.loading2 = false;
            this.changeChatIdInChild();
            }
          },
          (error) => { // 에러 콜백
            console.error("채팅방 입장 오류:", error);
          }
        );
      },
      //날짜 포맷
      formatDate(dateTime) {
        const originalDate = new Date(dateTime);

        // 대한민국 시간대로 조정
        const adjustedDate = new Date(originalDate.getTime() - (9 * 60 * 60 * 1000));

        // 월과 일 추출
        const month = adjustedDate.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줌
        const day = adjustedDate.getDate();
        // 시간과 분 추출
        const hours = adjustedDate.getHours();
        const minutes = adjustedDate.getMinutes();

        // 오전/오후 및 12시간 형식으로 변환
        const ampm = hours < 12 ? '오전' : '오후';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        // 최종 포맷팅된 시간 문자열 생성
        const formattedTime = `${month}/${day} ${ampm} ${formattedHours}:${formattedMinutes}`;

        return formattedTime;
      },
      // 브라우저 알림 생성
      showNotification(message, imgUrl) {
        if (this.previousNotification || document.hasFocus()) {
          return; // 이미 알림이 떠 있는 경우 함수 종료
        }
        if ('Notification' in window) {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              this.previousNotification = true;

              const notification = new Notification('새로운 채팅', {
                body: message,
                icon: imgUrl
              });
              this.previousNotification = notification;
              // 2초 뒤에 알림 닫기
            setTimeout(() => {
               notification.close();
               this.previousNotification = false; // 알림이 닫힘을 표시
                }, 2000);
               }
          });
          
        }
      },
      //프로필조회
      profilePop(userId, userNm){
        this.isUserProfileModalVisible = true;
        this.profilePopId = userNm;
        const key = `profileImageUrl_${userId}`;
        this.profilePopimgUrl = localStorage.getItem(key);
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.closeButton.focus();
          }, 0);
        });
      },
      // 채팅찾기 활성화여부
      isSearchCheck(){
        if(!this.isSearchChat){
          this.isSearchChat = true;
        } else {
          this.isSearchChat = false;
        }
      },
      // 채팅찾기
      searchChatContent(){
        if(this.isSearchChat){
          //this.searchChatcontentPosition = res.data[0].id;
          this.loading = true;
          this.socket.emit('getSearchMessages',this.selectedChatId, this.searchKeyword, this.searchChatcontentPosition);
        }
      },
      // 답장찾기
      answer_search(answer_messages){
        let flag = true;
        //채팅내역에 있는경우
        if(this.answerFocusColor){
          this.answerFocusColor.style.color='black';
          this.answerFocusColor = null;
        }
          for (const [index, item] of this.messages.entries()) {
            if(String(item.id) === answer_messages.answer_id || item.id === answer_messages.answer_id){
              const chatItem = this.$refs[`chatItem-${index}`][0].querySelector('.message-text');
              
              if (chatItem) { // chatItem이 존재하는지 확인합니다.
                  chatItem.focus(); // chatItem에 포커스를 설정합니다.
                  this.answerFocusColor = chatItem;
                  this.answerFocusColor.style.color='red';
                  const scrollContainer = this.$refs.chatContainer; // chatContainer에 해당하는 ref를 사용합니다.
                  if (scrollContainer) {
                    // 포커스된 요소가 화면 중앙에 오도록 스크롤을 이동합니다.
                    scrollContainer.scrollTop = chatItem.offsetTop - scrollContainer.clientHeight / 2;
                  }
              }
              flag = false;
              return;
            }
          }
          // search해서 가져와야하는경우
          if(flag){
            if(answer_messages.answer_id && answer_messages.answer_id !=='undefined'){
              this.socket.emit('getSearchAnswer',this.selectedChatId, answer_messages.answer_id);
            } 
          }
      },
      // 메세지 보내기
      sendMessage() {
        if(!commons.loginCheck()) return;

        if (this.newMessage.trim() === '') return;
        
        if(this.newMessage.length>=4000){
          commons.showToast(this, '2000자 이상 입력불가합니다.');
          return;
        }
        if (!event.shiftKey) { //쉬프트 엔터 시 줄바꿈
          // 도배체크
          const now = new Date();
          this.lastMessageTimestamps.push(now);

          // 10초 이전의 타임스탬프 제거
          const tenSecondsAgo = new Date(now - 10000);
          this.lastMessageTimestamps = this.lastMessageTimestamps.filter(timestamp => timestamp > tenSecondsAgo);

          if (this.lastMessageTimestamps.length >= 8) {
            // 사용자가 최근 10초 내에 8개 이상의 메시지를 보냄
            commons.showToast(this, '메시지를 10초 내에 8개 이상 보낼 수 없습니다.');
            return;
          }
          this.loading = true;
          const messageObject = {
            editedName: this.editedName,
            user_id: this.loginUserId,
            message: this.newMessage,
            chat_type: 'text', // 이미지 타입
            chat_file_id: null,
            profilePicture: this.profilePicture,
            chatimageUrl:null,
            chatId: this.selectedChatId,
            isMyMessage: true,
            selectUserCount: 0,
            answer_message:this.answerMessage,
            answer_id:this.answerId,
            answer_user_id:this.answerUserId,
            ins_ymdhms: now - 10800000  // 서버에서 받은 시간 정보
          };
          this.socket.emit('message', messageObject);
          this.loading = false;
          this.$nextTick(() => {
            setTimeout(() => {
              this.scrollToBottom();
              }, 100);
          });
          }
          event.preventDefault();
          this.$refs.sendButton.focus();
          this.answerMessage = null;
          this.answer_id = null;
          this.answer_user_id = null;
          this.answerFoucs = null;
      },
      //이모티콘 팝업 활성화
      openEmoticonModal() {
        this.isStickerModal = true; // 이모티콘 모달을 엽니다.
      },
      //이모티콘 팝업 닫기
      closeEmoticonModal() {
        this.isStickerModal = false; // 이모티콘 모달을 닫습니다.
      },
      // 이모티콘 팝업 처리
      selectEmoticon(stickerFileid) {
        this.chatImgurl(stickerFileid,'emoticon');

        this.closeEmoticonModal();
      },

      // 이미지 붙여넣기 event
      handleImagePaste(event) {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        for (const item of items) {
          if (item.type.indexOf("image") !== -1) {
            const file = item.getAsFile();
            this.uploadImageToServer(file);
          }
        }
      },
      // 이미지 붙여넣기 작업
      async uploadImageToServer(file) {
        const formData = new FormData();
        const timestamp = Date.now();
        const uniqueFileName = `${timestamp}_img_upload`;
        formData.append('file', file);
        formData.append('fileName', uniqueFileName);
        const token = localStorage.getItem('token');
        chatMethods.methods.uploadImageToServer(formData,token,(res) => {
              const chat_file_id = res.data.fileId;
              this.chatImgurl(chat_file_id,'image');
            },
            (error) => { // 에러 콜백
              console.error("이미지 업로드 오류:", error);
            }
        );
      },
      // 업로드메세지
      handleUpload() {
        const imageInput = this.$refs.imageInput;
        const file = imageInput.files[0];

        // 파일 크기 확인
        if (file && file.size > this.maxFileSize) {
            commons.showToast(this, '파일 또는 이미지 크기가 너무 큽니다. 10MB 이하의 이미지를 선택해주세요.');
            return;
           }
        const reader = new FileReader();
        if (file) {
          reader.readAsDataURL(file);
          const timestamp = Date.now();
          const uniqueFileName = `${timestamp}_${file.name}`;
          const originalFileName = `${file.name}`;
          const formData = new FormData();
          formData.append('file', file);
          formData.append("fileName", encodeURIComponent(uniqueFileName)); // 파일명을 인코딩하여 formData에 추가
          // 파일 업로드 요청
          this.loading = true;
          // 이미지 파일 확장자들의 배열
          const imageExtensions = ["jpg", "jpeg", "png", "gif"];
          const fileExtension = uniqueFileName.slice(((uniqueFileName.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
          const isImageFile = imageExtensions.includes(fileExtension);
          const token = localStorage.getItem('token');
          chatMethods.methods.uploadImageToServer(formData,token,(res) => {
                   if(isImageFile){
                        this.chatImgurl(res.data.fileId,'image');
                      } else {
                        this.chatfileUrl(res.data.fileId, originalFileName);
                      }
                      this.loading = false;
                },
                (error) => { // 에러 콜백
                  console.error("이미지 업로드 오류:", error);
                }
          );
        }
      },
      // 파일 메세지 전송1
      async chatfileUrl(chat_file_id, originalFileName) {
        if(!commons.loginCheck()) return;
        const now = new Date();
        this.lastMessageTimestamps.push(now);

        // 10초 이전의 타임스탬프 제거
        const tenSecondsAgo = new Date(now - 10000);
        this.lastMessageTimestamps = this.lastMessageTimestamps.filter(timestamp => timestamp > tenSecondsAgo);

        if (this.lastMessageTimestamps.length >= 8) {
          commons.showToast(this, '메시지를 10초 내에 8개 이상 보낼 수 없습니다.');
          return;
        }
        
        const messageObject = {
          editedName: this.editedName,
          user_id: this.loginUserId,
          message: originalFileName, // 이미지 데이터를 메시지로 첨부
          chat_type: 'file', // 이미지 타입
          chat_file_id: chat_file_id,
          profilePicture: this.profilePicture,
          chatimageUrl: `/api/file/download/${chat_file_id}`,
          chatId: this.selectedChatId,
          isMyMessage: true,
          selectUserCount: 0,
          answer_message:this.answerMessage,
          answer_id:this.answerId,
          answer_user_id:this.answerUserId,
          ins_ymdhms: now - 10800000,
        };

        this.socket.emit('message', messageObject);
        this.loading = false;
        this.newMessage = '';
        this.$nextTick(() => {
          setTimeout(() => {
            this.scrollToBottom();
          }, 50);
        });
      },
      // 이미지 메세지 전송1
      async chatImgurl(chat_file_id, imageType) {
        loginMethods.methods.profileImgURL(chat_file_id,(res) => {
                      this.sendImageMessage(chat_file_id, res.data.imageUrl, imageType);
                      this.$nextTick(() => {
                        setTimeout(() => {
                          this.scrollToBottom();
                        }, 50);
                      });
                    },
                    (error) => { // 에러 콜백
                      console.error("프로필 이미지 조회 오류:", error);
                    }
        );
      },
      // 이미지 메세지 전송2
      async sendImageMessage(chat_file_id, chatimageUrl, imageType) {
        if(!commons.loginCheck()) return;
        const now = new Date();
        this.lastMessageTimestamps.push(now);

        // 10초 이전의 타임스탬프 제거
        const tenSecondsAgo = new Date(now - 10000);
        this.lastMessageTimestamps = this.lastMessageTimestamps.filter(timestamp => timestamp > tenSecondsAgo);

        if (this.lastMessageTimestamps.length >= 8) {
          commons.showToast(this, '메시지를 10초 내에 8개 이상 보낼 수 없습니다.');
          return;
        }
        const messageObject = {
          editedName: this.editedName,
          user_id: this.loginUserId,
          message: '', // 이미지 데이터를 메시지로 첨부
          chat_type: imageType, // 이미지 타입
          chat_file_id: chat_file_id,
          profilePicture: this.profilePicture,
          chatimageUrl:chatimageUrl,
          chatId: this.selectedChatId,
          isMyMessage: true,
          selectUserCount: 0,
          answer_message:this.answerMessage,
          answer_id:this.answerId,
          answer_user_id:this.answerUserId,
          ins_ymdhms: now - 10800000,
        };

        this.socket.emit('message', messageObject);
        this.newMessage = '';
        this.$nextTick(() => {
          setTimeout(() => {
            this.scrollToBottom();
          }, 50);
        });
      },
      // 이미지 모달 열기
      openImageModal(imageUrl) {
        this.selectedImage = imageUrl;
        this.isImageModalOpen = true;
         // 이미지 모달이 열릴 때 닫기 버튼에 포커스를 줌
         this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.closeButton.focus();
          }, 0);
        });
      },

      // 이미지 모달 닫기
      closeImageModal() {
        setTimeout(() => {
          this.selectedImage = '';
          this.isImageModalOpen = false;
          }, 0);
      },
      // 채팅접속자 내역조회
      toggleSearch() {
         this.selectUser.length = 0;
         this.userPicture.length = 0;
          chatMethods.methods.chatUserSearch(this.selectedChatId,(res) => {
              for (const item of res.data) {
                this.selectUser.push(item.user_id);
                this.userPicture.push(item.profile_url);
              }
            },
            (error) => { // 에러 콜백
              console.error("채팅방 대상자 조회:", error);
            }
        );
        this.showModal = true; // 모달 토글
          
        },
      closeModal() {
          this.showModal = false; // 모달 닫기
      },
      scrollToBottom() {
        // chatContainer 요소가 렌더링되지 않은 경우에 대한 예외 처리
        if (this.chatContainer) {
          this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        }
      },
      
      async checkScrollPosition() {
        const chatContainer = this.$refs.chatContainer;
        // 스크롤 한번에 내리기 모달
        if (chatContainer) {
              if (chatContainer.scrollTop < chatContainer.scrollHeight - chatContainer.clientHeight  - 1000 ) {
                // 스크롤이 맨 아래가 아니면 팝업을 표시
                  this.showScrollPopup = true;
              } else {
                // 스크롤이 맨 아래에 도달하면 팝업을 숨김
                this.showScrollPopup = false;
              }
          }
        // 스크롤 한번에 내리기 모달 END
        if (chatContainer.scrollTop === 0 && !this.loadingPreviousMessages && this.shouldMaintainScroll) {
          this.loadingPreviousMessages = true;
          try {
            const oldestMessage = {
              oldestMessageTime: this.messages[0].ins_ymdhms,
              chatId:this.selectedChatId,
            };
            if(this.firstChat !== this.messages[0].ins_ymdhms){
              this.socket.emit('getPreviousMessages', oldestMessage);
            }
            this.firstChat = this.messages[0].ins_ymdhms;
          } catch (error) {
            console.error('이전 채팅 조회 오류:', error);
          } finally {
            this.loadingPreviousMessages = false;
          } 
        }
      },
      // 세션종료
      disconSession(){
        for (let key in localStorage) {
            if (key !== "token") {
              localStorage.removeItem(key);
            }
          }
      },
      // 채팅접속자들 프로필사진 url정보가져오기
      getChatUserInfo(){
        // 각 사용자의 이미지를 로컬 스토리지에서 가져와 설정합니다.
        this.disconSession();
        chatMethods.methods.chatUserSearch(this.selectedChatId,(res) => {
              for (const item of res.data) {
                if(!localStorage.getItem(`profileImageUrl_${item.user_id}`)){
                  if(item.profile_url){
                    localStorage.setItem(`profileImageUrl_${item.user_id}`, item.profile_url);  
                  } else {
                    localStorage.setItem(`profileImageUrl_${item.user_id}`, '');  
                  }
                } 
              }
            },
            (error) => { // 에러 콜백
              console.error("대상자 이미지url 조회:", error);
            }
        );
      },
      //세션 이미지 url 출력 
      chatUserProfileUrl(userId){
        const key = `profileImageUrl_${userId}`;
        return localStorage.getItem(key);
      },
      // 내정보 조회
      profileSearch(user_id){
        loginMethods.methods.profileSearch(user_id, (res) => {
            this.editedName = res.data[0].user_nm;
            // 이미지 URL 받아오기
            if(res.data[0].img_id){
              this.file_no = res.data[0].img_id;
              try {
                loginMethods.methods.profileImgURL(
                  res.data[0].img_id,
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
              },
              (error) => {
                // 에러 콜백
                console.error("프로필 조회 오류", error);
              }
            );
        }
      },
  };
  </script>
  
<style scoped>

.chat-textarea{
  width: 100%; 
  border: 1px solid #ccc; 
  border-radius: 8px; 
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1); 
  padding: 10px; 
  resize: none;
  height: 50px;
}

.message-container{
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 이름을 왼쪽으로 정렬 */
  
}
.message-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.chat-header {
  background-color: #ffffff;
  color: #333;
  padding: 10px;
  font-weight: bold; /* 볼드체 */

}

.chat-messages {
  padding: 10px;
  overflow-y: auto;
  /*background-image: url("../../assets/img_background.jpg"); /* 이미지 파일 경로 */
}

.message {
  display: flex;
  align-items: center; /* 수직 가운데 정렬 */
  padding: 8px;
  border-radius: 5px;
  /* background-color: #f0f0f0;  */
  margin: 5px;
  
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 10px;
}

input[type="text"] {
  flex: 1;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}


.profile-image{
  border-radius: 50%; /* 원형태로 보여주기 위해 반지름을 50%로 설정 */
  width: 100px;
  height: 50px;
  object-fit: cover; /* 이미지 비율 유지 */
  border: 2px solid #ccc;
  height: 100%; /* 부모 컨테이너의 높이에 맞게 설정 */
  margin-right: 3px;
  cursor: pointer;
}

.message-bubble {
  background-color: #f0f0f0;
  border-radius: 5px;
  padding: 7px;
  display: inline-block;
  margin-top: 5px;
  cursor: pointer;
}

.message-answer-text {
  background-color: #f2f2f2; /* 배경색 설정 */
  padding: 7px;
  border-radius: 5px;
  color: gray; /* 글자색 설정 */
  padding: 5px; /* 선택한 메시지 주위에 여백 추가 (선택 사항) */
  border: 1px solid #ccc; /* 선택한 메시지 주위에 테두리 추가 (선택 사항) */
  margin-left: 10px;
  font-size: 12px;
}


.my-message { 
  margin-left:10px;
  background-color: lightskyblue; /* 다른 메시지의 배경색 */
}

.other-message {
  margin-left:10px;
  background-color: #f1e0e0;
}

.message-name {
  font-weight: bold; /* 볼드체 */
  font-size: 12px;
  display: inline-block;
  vertical-align: middle;
}

.message-date {
  font-size: 12px; /* 날짜 글씨체 크기 */
  color: #bbb; /* 연한 색상 */
  margin-left: 10px;
  margin-top:20px;
}

.message-text {
  font-size: 14px;
  color: #333;
}

.profile-image {
  flex-shrink: 0;
  max-width: 40px;
  max-height: 40px;
  min-width: 40px;
  min-height: 40px;
}

.message-image {
  max-width: 100%;
  max-height: 200px; /* 이미지의 최대 높이 설정 */
  object-fit: contain; /* 이미지를 가득 차게 표시 */
  background-color:  rgb(240, 252, 255);
}
.hidden-input {
  display: none;
}

.imoticon-button{
      border: 1px solid #ccc; 
      border-radius: 8px; 
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1); 
      padding: 5px; 
      resize: none;
      display: flex; align-items: center; justify-content: center;background-color: rgb(255, 255, 255);
    }
.chat_thumbnailUrl{
  width:200px;
  padding:10px;

}
/* 모달 스타일 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 모달을 다른 요소 위에 표시하기 위해 높은 z-index 설정 */
}

.sticker-modal{
  position: fixed;
  bottom:20%;
  right: 20px; /* 우측 하단에서의 거리 조절 */
}
.modal-content {
  background-color: #fff; /* 배경을 흰색으로 설정 */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  width: 80%; /* 모달 창 너비 조절 */
  max-width: 400px; /* 최대 너비 설정 */
  color: #333; /* 글자를 검정색으로 설정 */
}
.modal-content2 {
  background-color: #fff; /* 배경을 흰색으로 설정 */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  width: 99%; /* 모달 창 너비 조절 */
  color: #333; /* 글자를 검정색으로 설정 */
}

.modal h2 {
  margin-top: 0;
  font-size: 24px;
}

.modal ul {
  list-style: none;
  padding: 0;
}

.modal li {
  margin-bottom: 10px;
  font-size: 18px;
}


.modal button:hover {
  background-color: #0056b3;
}


.chat_exit {
  background-color: brown;
  padding: 10px 20px;
  border-radius: 5px;
  margin-bottom: 10px;
  border: none;
  transition: background-color 0.3s;
}
.modal_close, .modal-close {
  padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #3498db;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
}
.enlarged-image {
  max-width: 100%; /* 이미지 최대 너비 설정 */
  max-height: 80vh; /* 이미지 최대 높이 설정 (화면 높이의 80%) */
  object-fit: contain; /* 이미지의 비율 유지하며 채우기 */
  margin: 0 auto; /* 가운데 정렬 */
  display: block; /* 블록 요소로 설정하여 가로 중앙 정렬을 위함 */
}
.upload-button{
      margin-top: 10px;
    }
.announcement-message{
  background-color: #bbb; /* 공지사항 배경색 */
  border-radius: 10px; /* 공지사항 메시지 모서리 둥글게 */
  font-size: 1px;
}

.search-message{
  background-color: #fffccd; /* 공지사항 배경색 */
  border-radius: 10px; /* 공지사항 메시지 모서리 둥글게 */
  font-size: 1px;
}
.message-view {
    /* 배경색과 텍스트 색상 설정 */
    color: #e40b0b;
    
    /* 패딩과 마진 설정 */
    padding: 5px 10px;
    margin: 5px;
    
    /* 글꼴과 글꼴 크기 설정 */
    font-family: Arial, sans-serif;
    font-size: 11px;
    }
.sticker-image{
  width:40px;
  margin-right: 10px;
}
.image-bubble{
  background-color:  rgb(240, 252, 255);
}

/* CSS 스타일링 */
.scroll-down-container {
  position: fixed;
  bottom: 30%;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 9999;
}

.scroll-down-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  outline: none;
}

.scroll-down-button:hover {
  background-color: #0056b3;
}

.profile-modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

/* 모달 내용 스타일 */
.profile-modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    text-align: center;
}

/* 프로필 이미지 스타일 */
.profile-picture-container {
    margin-bottom: 20px;
}

.profile-pop-image {
    width: 250px;
    height: 200px;
    border-radius: 50%;
    border: 2px solid #ffffff;
}
.profile-details {
    margin-bottom: 20px;
}

.profile-details h2 {
    font-size: 24px;
    color: #333;
}

.profile-details label {
    font-size: 18px;
    font-weight: bold;
    color: #333;
}

.profile-details span {
    font-size: 16px;
    color: #777;
}

/* 작업 버튼 스타일 */
.profile-actions {
    display: flex;
    justify-content: center;
}

.profile-actions button {
    margin: 0 10px;
    padding: 10px 20px;
    font-size: 18px;
    border: none;
    border-radius: 5px;
    background-color: #3498db;
    cursor: pointer;
}



/* 모달 스타일 */

@media (min-width: 768px) {
    .chat-container{
    height: 80vh;
    display: flex;
    flex-direction: column;
    font-family: Arial, sans-serif;
    background-color: rgb(240, 252, 255);
    }
    .send-button {
      display: none;
      padding: 5px 0px;
      background-color: #6200ff;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      width: 25px;
      height: 50px;
      
    }

  }
@media (max-width: 768px) {
    .chat-container{
    height: 85vh;
    display: flex;
    flex-direction: column;
    background-color: rgb(240, 252, 255);
    font-family: Arial, sans-serif;
    transition: height 0.3s ease; /* 부드러운 애니메이션을 위해 트랜지션 적용 */
    }
    /* .chat-container.focused { */
      /* 포커싱됐을 때의 스타일 설정 */
      /* height: calc(85vh - 10vh);  
    }*/
    .chat-messages {
      max-height: none;
      overflow-y: auto;
      margin-left: -15px;
    }

    .chat-input {
      align-items: stretch;
      display: flex;
      padding: 10px;
    }
    .chat-textarea{
      width: 90%; 
      border: 1px solid #ccc; 
      border-radius: 8px; 
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1); 
      padding: 10px; 
      resize: none;
      height: 50px;
    }

    .profile-image{
    border-radius: 50%; /* 원형태로 보여주기 위해 반지름을 50%로 설정 */
      object-fit: cover; /* 이미지 비율 유지 */
      border: 2px solid #ccc;
      max-width: 35px;
      max-height: 35px;
      min-width: 35px;
      min-height: 35px;
  }

  .message-bubble.image-bubble {
    background-color: #f0f0f0;
    border-radius: 16px;
    padding: 10px;
    display: inline-block;
    max-width: 70%;
  }

  .other-message {
    background-color: #f1e0e0;
  }

  .message-name {
    font-weight: bold; /* 볼드체 */
    vertical-align: middle;
    font-size: 13px;
  }

  .message-date {
    font-size: 10px; /* 날짜 글씨체 크기 */
    color: #bbb; /* 연한 색상 */
    margin-left: 10px;
    margin-top:20px;
  }

  .message-text {
    font-size: 12px;
    color: #333;
  }

  .profile-image {
    flex-shrink: 0;
  }

  .loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
}

.loading-image {
  max-width: 100px; /* 이미지의 최대 너비 설정 */
  max-height: 100px; /* 이미지의 최대 높이 설정 */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  }

  .send-button {
  
  padding: 5px 0px;
  background-color: #6200ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 40px;
  height: 50px;
  
  }

}
  </style>