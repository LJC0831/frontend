<template>
  <div @drop.prevent="handleDrop" @dragover.prevent @dragenter.prevent :class="['chat-container', { 'focused': isChatTextareaFocused }]">
    <!-- 채팅헤더 -->
    <div class="chat-header">
        <span><img src="@/assets/back-img.png" @click="exit()" style="width: 15px; margin-right: 10px;"></span> <!--https://www.flaticon.com/kr/free-icon/backward_318339 출처-->
        <span>{{ selectSubject }}</span>
        <span style="float: right;">
            <input v-if="isSearchChat" v-model.trim="searchKeyword" type="text" @keyup.enter="searchChatContent()" @input="handleInputChange" style="margin-right: 5px; height: 30px;"/>
            <span v-if="isSearchChat" style="margin-right: 5px;">{{searchChatContentArray.length}}/{{searchAllcount}}</span>
            <img src="@/assets/search-image.jpg"  @click="isSearchCheck()" class="class-search" style="width:30px; margin-right: 10px;"/>
            <i :class="'fas fa-bars'" @click="toggleSearch()"></i>
        </span>
    </div>
    <!-- 채팅 메세지 -->
    <div class="chat-messages" ref="chatContainer" @scroll="checkScrollPosition">
      <!-- 메세지 표시 -->
      <div v-for="(message, index) in messages" :key="index" class="message" :ref="`chatItem-${index}`">
        <img v-if="!message.profilePicture && message.chat_type !== 'announcement'" src="@/assets/profile-user.png" alt="내 정보" class="profile-image" @click="profilePop(message.user_id, message.editedName)"/>
        <img v-if="message.profilePicture && message.chat_type !== 'announcement'" class="profile-image" :src="message.profilePicture" alt="프로필 사진"  @click="profilePop(message.user_id, message.editedName)"/>
        <div class="message-container" >
          <div class="message-content">
          <span class="message-name">{{ message.editedName }} </span>
          <span @click="answer_search(message)" v-if="message.answer_message && message.answer_message !== `undefined`" class="message-answer-text">{{ message.answer_user_id }} : {{ message.answer_message }}</span>   
            <div @click="AnswerActive()" class="message-bubble" :class="{ 'announcement-message': message.chat_type === 'announcement' && message.chat_type !== 'search'
                                                , 'search-message': message.chat_type === 'search'
                                                , 'other-message': message.user_id !== this.loginUserId && message.chat_type !== 'search'
                                                , 'my-message': message.user_id === this.loginUserId && message.chat_type !== 'search' }">
              <span class="message-text" v-html="formatMessage(message.message)"></span>
            </div>
            <div v-if="message.chat_type === 'image'" class="message-bubble image-bubble">
              <img v-if="message.chat_type === 'image'" :src="message.chatimageUrl" alt="이미지" class="message-image" @click="openImageModal(message.chatimageUrl, message.id)"/>
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
          <div>
            <span v-if="message.description" class="message-bubble">{{ message.description }}</span>
          </div>
        </div>
        <span class="message-date" v-if="this._isAnswerActive" @click="chat_answer(message)"><img src="@/assets/back-img.png" style="width: 20px;"></span>
        <span class="message-date" v-if="this._isAnswerActive" @click="kakaoSend(message)" style="width: 20px;"><font-awesome-icon :icon="['fas', 'envelope']" :style="{ fontSize: iconSize }"/></span>
        <span class="message-view" v-if="message.selectUserCount !== 0" >{{ message.selectUserCount }}</span>
        <span class="message-date">{{ formatDate(message.ins_ymdhms) }}</span>
      </div>
    </div>
    <!-- 채팅 입력 -->
    <div class="chat-input">
      <label for="imageInput" class="upload-button">
          <img src="../../assets/uploadIKon.png" alt="첨부 아이콘" />
      </label>
      <div class="textarea-container">
        <textarea  autocomplete="off" v-model="newMessage" class ="chat-textarea" v-if="!loading"
        ref="sendButton"
        @keyup.esc="answerFocusProc()"
        @focus="handleChatTextareaFocus"
        @blur="handleChatTextareaBlur"
        @paste="handleImagePaste" @keydown="handleKeyDown" placeholder="메시지를 입력하세요..." />
          <span class="imoticon-button" @click="openEmoticonModal">
            <font-awesome-icon :icon="['fas', 'smile']" />
          </span>
      </div>
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
    <!-- 로딩영역 -->
    <div class="loading-overlay" v-if="loading">
          <img src="@/assets/loading.gif" alt="로딩 중" class="loading-spinner" />
    </div>
    <!-- 이미지url 모달 창 -->
    <div v-if="isImageModalOpen" class="modal">
      <div class="modal-content2"  @click="this.$refs.closeButton.focus()">
        <div class="image-container">
          <button class="modal_close prev-button" @click="prevGetImg('prev')">이전</button>
          <img :src="selectedImage" alt="확대 이미지" class="enlarged-image">
          <button class="modal_close next-button" @click="prevGetImg('next')">다음</button>
        </div>
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
  import axios from 'axios';

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
        newMessage2 : '', //전달
        editedName : "", 
        profilePicture: null,
        chatContainer: null,
        loadingPreviousMessages: false, // 이전 채팅 내역 로딩 상태
        shouldMaintainScroll: true, // 스크롤을 유지할지 여부를 나타내는 변수
        oldestMessageTime: null,   //이전메세지 시간
        lastMessageTimestamps: [], // 최근 8개 메시지의 타임스탬프를 저장합니다.
        showModal: false, // 모달 표시 여부
        userPicture:[], // 참가유저들 사진
        maxFileSize: 20 * 1024 * 1024, // 20MB (메가바이트)
        isImageModalOpen: false,
        selectedImage: '',
        selectedImageId: '',
        previousNotification :false, //알람처리변수
        userSockets: [],//소켓
        loginUserId:null, //로그인유저
        firstChat:null, //스크롤 기준 맨위채팅
        loading2: false,
        isChatTextareaFocused: false, //텍스트박스 포커싱여부
        ismobile:this.isMobile() ? false : true, //뒤로가기버튼활성화여부
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
        thumbnailUrl:'', //썸네일이미지
        description:'', //썸네일설명
        _isAnswerActive:false, //답장활성화여부
        iconSize: '1.3rem',
      };
    },
    created() {
      const login_token = localStorage.getItem('token');
      const decoded_Token = jwtDecode(login_token);
      this.loginUserId = decoded_Token.username;
      // Socket.IO 클라이언트를 초기화하고 서버에 연결합니다.
      //this.socket = io('http://localhost:3000', {
      this.socket = io('https://backendserver.shop:3000', {
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
        if (String(message.chatId) === String(this.selectedChatId)) {
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
              this.scrollToBottom();
            }, 300); // 100ms(0.1초) 후에 실행됩니다.
          }
        }
      });
      // 메세지 읽음처리
      this.socket.on('getMessageRead', (lastMessage) => {
         for (var i = 1; i <= this.messages.length; i ++){
          this.messages[this.messages.length-i].selectUserCount = lastMessage[lastMessage.length-i].selectUserCount;
          this.messages[this.messages.length-i].id = lastMessage[lastMessage.length-i].id;
          if(i === '199'){
            break;
          }
         }
      });

      // 서버로부터 최근 메시지를 받을 때 호출되는 콜백 함수
      this.socket.on('messageHistory', (messages) => {
        // 받은 채팅 메시지들을 화면에 표시하는 로직
        this.messages = messages;
        //const urlsToFetch = [];
        for (let i = 1; i <= this.messages.length; i ++){
          // 프로필사진 가져오기
          this.messages[this.messages.length-i].profilePicture = this.chatUserProfileUrl(this.messages[this.messages.length-i].user_id);
         }
        // chatContainer 요소의 레퍼런스를 가져옵니다.
        this.$nextTick(() => {
          this.chatContainer = this.$refs.chatContainer;
          // 최근 메시지를 받은 후에 스크롤을 아래로 이동합니다.
          setTimeout(() => {
            if(this.messages.length > 0 ){
              if(this.messages[0].type ===''){ //20개이상 안읽었을 시 
                this.scrollToBottom();
              }
            }
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
              this.chatContainer.scrollTop = 1665; 
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
      async fetchThumbnail(sendUrl) {
        // 백엔드 서버로 URL을 전송하고 썸네일 이미지 URL을 받아옴
        try {
          //const response = await fetch('https://port-0-backend-nodejs-20zynm2mlk2nnlwj.sel4.cloudtype.app/api/fetchThumbnail', {
            const response = await fetch('https://backendserver.shop:3000/api/fetchThumbnail', {
            method: 'POST',
            body: JSON.stringify({ url: sendUrl }),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            this.thumbnailUrl = data.thumbnailUrl;
            this.description = data.description;
          }
        } catch (error) {
          console.error('오류 발생:', error);
        }
      },
      // 채팅답장시작
      chat_answer(message){
        this.$refs.sendButton.focus();
        this.answerFoucs = true;
        this.answerMessage = message.message === '' ? '이미지' : message.message;
        this.answerId = message.id;
        this.answerUserId = message.editedName;
      },
      kakaoSend(message){
        const accessToken = localStorage.getItem('kakao_code');
        let kakaoMessage = '';
        if (!accessToken) {
          commons.showToast(this, '카카오 로그인 후 사용 가능합니다.');
          return;
        }
          console.log(message);
          if(message.chat_type==='image'){
            const imageUrl = message.chatimageUrl;
            kakaoMessage = {
              object_type: 'feed', // 'feed' 형식으로 메시지 전송
              content: {
                title: `이미지`,
                description: `이미지을 다운로드하려면 링크를 클릭하세요:\n${imageUrl}`, 
                image_url: imageUrl, // 전송할 이미지 URL
                link: {
                  web_url: 'https://friendtalk.netlify.app', // 웹 링크
                  mobile_web_url: 'https://friendtalk.netlify.app', // 모바일 웹 링크
                },
              },
            };
          } else if (message.chat_type==='file'){
            const fileUrl = message.chatimageUrl; // 파일 다운로드 링크
            kakaoMessage = {
              object_type: 'text', // 텍스트 형식으로 파일 링크 공유
              text: `파일을 다운로드하려면 링크를 클릭하세요:\n${fileUrl}`,
              link: {
                web_url: fileUrl,
                mobile_web_url: fileUrl,
              },
            };

          }else {
            kakaoMessage = {
              object_type: 'text',  // 'text' 형식으로 메시지 전송
              text: message.message,
              link: {
                web_url: 'https://friendtalk.netlify.app',
                mobile_web_url: 'https://friendtalk.netlify.app',
              },
            };
          }

        const data = new URLSearchParams();
        data.append('template_object', JSON.stringify(kakaoMessage));

        axios({
            method: 'post',
            url: 'https://kapi.kakao.com/v2/api/talk/memo/default/send',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/x-www-form-urlencoded', // 수정된 헤더
            },
            data: data,  // data를 URLSearchParams로 변환하여 전달
          })
            .then((response) => {
              console.log('메시지 전송 성공:', response.data);
            })
            .catch((error) => {
              console.error('메시지 전송 실패:', error);
            });
      },
      // 알림
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
      if ((event.key === "Enter"||event.keyCode === 13) && !event.shiftKey && !this.loading) {
        this.sendMessage();
        this.$refs.sendButton.focus();
        this.answerFocusProc();
        event.preventDefault();
      }
    },
    // 답장포커싱처리
    answerFocusProc(){
      this.replyText = ""; //답장
      this.answerMessage = null;//답장선택한메세지
      this.answerId = null;//답장선택한메세지 id
      this.answerUserId = null; //답장선택한userid
      this.answerFocusColor = null; //포커스color 
      this.answerFoucs = null; //답장포커스여부
      this._isAnswerActive = false; //답장비활성화
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
      this.answerFocusProc();
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
        const adjustedDate = new Date(dateTime);

        // 대한민국 시간대로 조정
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
      // 답장활성화
      AnswerActive(){
        this._isAnswerActive = !this._isAnswerActive;
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
      async sendMessage() {
        this.newMessage2 = this.newMessage.trim(); // 앞뒤 공백 제거
        this.newMessage = '';
        // 도배체크
        const now = new Date();
        this.lastMessageTimestamps.push(now);
        // 10초 이전의 타임스탬프 제거
        const tenSecondsAgo = new Date(now - 10000);
        this.lastMessageTimestamps = this.lastMessageTimestamps.filter(timestamp => timestamp > tenSecondsAgo);
        if (this.lastMessageTimestamps.length >= 20) {
          // 사용자가 최근 10초 내에 8개 이상의 메시지를 보냄
          commons.showToast(this, '메시지를 10초 내에 20개 이상 보낼 수 없습니다.');
          return;
        }
        if(!commons.loginCheck()){
          this.$router.push('/login');
          return;
        }
        if (this.newMessage2.trim() === '') return;
        if(this.newMessage2.length>=4000){
          commons.showToast(this, '2000자 이상 입력불가합니다.');
          return;
        }

          //썸네일 입력
            const linkTagPattern = /https?:\/\/\S+|www\.\S+/g;
            if(linkTagPattern.test(this.newMessage2)){
              let url = this.newMessage2;
              if (url.startsWith('www.')) {
                url = 'http://' + url;
              }
              await this.fetchThumbnail(url);
          }

          const messageObject = {
            editedName: this.editedName,
            user_id: this.loginUserId,
            message: this.newMessage2,
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
            thumbnailUrl:this.thumbnailUrl,
            description:this.description,
            ins_ymdhms: now // 서버에서 받은 시간 정보
        };
          this.socket.emit('message', messageObject);
          this.thumbnailUrl = '';
          this.description = '';
          this.newMessage2 = '';
          // this.$nextTick(() => {
          //   setTimeout(() => {
          //     this.scrollToBottom();
          //     }, 400);
          // });
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
        this.loading = true;
        const formData = new FormData();
        const timestamp = Date.now();
        const uniqueFileName = `CHAT_${timestamp}_img_upload`;
        formData.append('file', file);
        formData.append('fileName', uniqueFileName);
        const token = localStorage.getItem('token');
        chatMethods.methods.uploadImageToServer(formData,token,(res) => {
              const chat_file_id = res.data.fileId;
              this.chatImgurl(chat_file_id,'image');
              this.loading = false;
            },
            (error) => { // 에러 콜백
              console.error("이미지 업로드 오류:", error);
            }
        );
      },
      // 업로드메세지
      handleUpload(event) {
        const file = event.target.files ? event.target.files[0] : event.dataTransfer.files[0];
        //const imageInput = this.$refs.imageInput;
        //const file = imageInput.files[0];

        // 파일 크기 확인
        if (file && file.size > this.maxFileSize) {
            commons.showToast(this, '파일 또는 이미지 크기가 너무 큽니다. 20MB 이하의 이미지를 선택해주세요.');
            return;
           }
        const reader = new FileReader();
        if (file) {
          reader.readAsDataURL(file);
          const timestamp = Date.now();
          const uniqueFileName = `CHAT_${timestamp}_${file.name}`;
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
      handleDrop(event) {
        const files = event.dataTransfer.files;
        if (files.length) {
          this.handleUpload({ target: { files } });
        }
      },
      // 파일 메세지 전송1
      async chatfileUrl(chat_file_id, originalFileName) {
        if(!commons.loginCheck()) {
          this.$router.push('/login');
          return;
        }
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
          //chatimageUrl: `https://port-0-backend-nodejs-20zynm2mlk2nnlwj.sel4.cloudtype.app/api/file/download/${chat_file_id}`,
          chatimageUrl: `https://backendserver.shop:3000/api/file/download/${chat_file_id}`,
          chatId: this.selectedChatId,
          isMyMessage: true,
          selectUserCount: 0,
          answer_message:this.answerMessage,
          answer_id:this.answerId,
          answer_user_id:this.answerUserId,
          thumbnailUrl:this.thumbnailUrl,
          description:this.description,
          ins_ymdhms: now,
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
        if(!commons.loginCheck()) {
          this.$router.push('/login');
          return;
        }
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
          thumbnailUrl:this.thumbnailUrl,
          description:this.description,
          ins_ymdhms: now,
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
      openImageModal(imageUrl, id) {
        this.selectedImage = imageUrl;
        this.selectedImageId = id; //선택된 채팅id
        this.isImageModalOpen = true;
         // 이미지 모달이 열릴 때 닫기 버튼에 포커스를 줌
         this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.closeButton.focus();
          }, 0);
        });
      },
      // 이미지 모달 이전
      prevGetImg(job_type){
        chatMethods.methods.chatPrevImgSearch(this.selectedChatId,this.selectedImageId,job_type,(res) => {
              this.selectedImageId = res.data[0].id; //변경된 이미지 file id
              this.selectedImage = res.data[0].img_url; //이미지변경
            },
            (error) => { // 에러 콜백
              console.error("대상자 이미지url 조회:", error);
            }
        );
      },

      // 이미지 모달 닫기
      closeImageModal() {
        setTimeout(() => {
          this.selectedImage = '';
          this.selectedImageId = '';
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
          const date = new Date(this.messages[0].ins_ymdhms);
          const formattedTime = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
          try {
            const oldestMessage = {
              oldestMessageTime: formattedTime,
              chatId:this.selectedChatId,
            };
            if(this.firstChat !== formattedTime){
              this.socket.emit('getPreviousMessages', oldestMessage);
            }
            this.firstChat = formattedTime;
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
            if (key !== "token" && key !=="kakao_code") {
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
            this.profilePicture  = res.data[0].img_url;  
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
</style>

<style scoped src="@/styles/common.css"></style>
<style scoped src="@/styles/chat.css"></style>