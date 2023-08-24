<template>
  <div class="chat-container">
    <!-- 채팅헤더 -->
    <div class="chat-header">
        <span>{{ selectSubject }}</span>
        <span style="float: right;">
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
      <div v-for="(message, index) in messages" :key="index" class="message">
        <img v-if="!message.profilePicture" src="../../assets/profile-user.png" alt="내 정보" class="profile-image" />
        <img v-if="message.profilePicture" class="profile-image" :src="message.profilePicture" alt="프로필 사진" />
        <span class="message-name">{{ message.editedName }} </span>
        <div class="message-bubble" :class="{ 'my-message': message.message }">
          <span class="message-text" v-html="formatMessage(message.message)"></span>
        </div>
        <div v-if="message.chat_type === 'image'" class="message-bubble image-bubble">
          <img v-if="message.chat_type === 'image'" :src="message.chatimageUrl" alt="이미지" class="message-image" @click="openImageModal(message.chatimageUrl)"/>
        </div>
        <div v-else-if="message.chat_type === 'file'" class="message-bubble file-bubble">
          <a :href="message.chatimageUrl" target="_blank">다운로드</a>
        </div>
        <span class="message-date">{{ formatDate(message.ins_ymdhms) }}</span>
      </div>
    </div>
    <!-- 채팅 입력 -->
    <div class="chat-input">
      <textarea  v-model="newMessage" 
      style="width: 92%; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1); padding: 10px; resize: none;"
      @paste="handleImagePaste" @keydown="handleKeyDown" placeholder="메시지를 입력하세요..." />
      <label for="imageInput" class="upload-button" style="margin-top: 9px;">
        <img src="../../assets/uploadIKon.png" alt="첨부 아이콘" style="width:40px"/>
      </label>
      <input type="file" id="imageInput" ref="imageInput" @change="handleUpload" class="hidden-input"/>
      <button @click="sendMessage" v-if="!loading" class="send-button">전송</button>
      <button @click="sendMessage" v-if="loading" class="send-button">Loading...</button>
    </div>
    <!-- 모달 창 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>접속 중인 대상자 목록</h2>
        <ul>
          <li v-for="(selectUser, index) in selectUser" :key="index">
            <img v-if="userPicture[selectUser]" class="profile-image" :src="userPicture[selectUser]" width="100" height="100" alt="프로필 사진" /> 
            <img v-if="!userPicture[selectUser]" class="profile-image" src="@/assets/profile-user.png" width="100" height="100" alt="프로필 사진" /> 
            {{ selectUser }}
          </li>
        </ul>
        <span>
          <input type="text" class="chat_input_invite" v-model="inviteUserId" placeholder="아이디 입력..." >
          <button class="chat_invite" @click="InviteUser()">초대하기</button>
        </span>
        <button class="chat_exit" @click="exitUser()">방나가기</button>
        <button class="modal_close" @click="closeModal">닫기</button>
        
      </div>
    </div>
    <!-- 이미지url 모달 창 -->
    <div v-if="isImageModalOpen" class="modal">
      <div class="modal-content2">
        <img :src="selectedImage" alt="확대 이미지" class="enlarged-image">
        <button class="modal_close" @click="closeImageModal">닫기</button>
      </div>
    </div>
  </div>
</template>
  
  <script>
  /* eslint-disable */
  import io from 'socket.io-client';
  import jwtDecode from 'jwt-decode';
  import loginMethods from '../../scripts/login.js';
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
        scrollPosition: null, //현재스크롤위치
        previousNotification :false, //알람처리변수
        userSockets: [],//소켓
        isShowingToast: false, // 토스트 메시지 표시 중 여부
      };
    },
    created() {
      const login_token = localStorage.getItem('token');
      const decoded_Token = jwtDecode(login_token);
      const user_id = decoded_Token.username;
      // Socket.IO 클라이언트를 초기화하고 서버에 연결합니다.
      //this.socket = io('http://localhost:3000', {
      this.socket = io('https://port-0-backend-nodejs-20zynm2mlk2nnlwj.sel4.cloudtype.app', {
        withCredentials: true, // 쿠키와 인증 정보를 전송할 수 있도록 설정 (선택 사항)
        query:{
          userId:user_id, //로그인유저
        }
      });
      this.manageUserSocket(user_id, this.socket);

      // 서버로부터 메시지를 받으면 채팅 화면에 메시지를 표시합니다.
      this.socket.on('message', (message) => {
        if (message.chatId === this.selectedChatId) {
          this.messages.push(message);
          this.$nextTick(() => {
            this.scrollToBottom();
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userid = decodedToken.username;
            if(message.user_id !== userid){
              this.previousMessage = message.message;
              this.showNotification(message.message,message.profilePicture); // 새 메시지 알림 표시
            }
          });
        }
      });

      // 서버로부터 최근 메시지를 받을 때 호출되는 콜백 함수
      this.socket.on('messageHistory', (messages) => {
        this.loading = true;
        // 받은 채팅 메시지들을 화면에 표시하는 로직
        this.messages = messages;
        // chatContainer 요소의 레퍼런스를 가져옵니다.
        this.$nextTick(() => {
          this.chatContainer = this.$refs.chatContainer;
          // 최근 메시지를 받은 후에 스크롤을 아래로 이동합니다.
          setTimeout(() => {
            this.scrollToBottom();
          }, 300); // 300ms(0.3초) 후에 실행됩니다.
        });
        this.loading = false;
      });
      // 스크롤 올릴떄 이전내역 가져오기
      this.socket.on('previousMessages', (previousMessages) => {
        this.loading = true;
        // 받아온 이전 채팅 내역을 messages 배열의 앞쪽에 추가
        this.messages.unshift(...previousMessages);

        // 이전 채팅 내역을 받아온 후 스크롤 위치를 조정
        this.$nextTick(() => {
          if (this.chatContainer) {
            // 스크롤을 유지하도록 조정
            if (this.shouldMaintainScroll) {
              this.scrollPosition = (this.scrollPosition + this.chatContainer.scrollHeight) / 2;
              this.chatContainer.scrollTop = this.scrollPosition; 
              this.scrollPosition = null;
            } else {
              this.shouldMaintainScroll = true; // 스크롤 유지 변수를 다시 활성화
            }
          }
        });

        setTimeout(() => {
          this.loading = false;
         }, 300); // 300ms(0.3초) 후에 실행됩니다.
        
      });

      //프로필정보조회
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userid = decodedToken.username; // 사용자 아이디 추출
      this.profileSearch(userid);
      // 서버에 최근 메시지를 요청합니다.
      const chatId = this.selectedChatId;
      this.socket.emit('getLatestMessages',chatId);
    },
    methods: {
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
      if (event.key === "Enter" && !event.shiftKey) {
        // Enter 키가 눌렸고 Shift 키가 눌리지 않았을 때만 전송
        event.preventDefault(); // 기본 동작(줄바꿈) 방지
        this.sendMessage();
      }
    },
      //메세지 줄바꿈처리
      formatMessage(message) {
        return message.replace(/\n/g, '<br>');
      },
      //날짜 포맷
      formatDate(dateTime) {
        const originalDate = new Date(dateTime);

        // 대한민국 시간대로 조정
        const adjustedDate = new Date(originalDate.getTime() - (9 * 60 * 60 * 1000));

        // 시간과 분 추출
        const hours = adjustedDate.getHours();
        const minutes = adjustedDate.getMinutes();

        // 오전/오후 및 12시간 형식으로 변환
        const ampm = hours < 12 ? '오전' : '오후';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        // 최종 포맷팅된 시간 문자열 생성
        const formattedTime = `${ampm} ${formattedHours}:${formattedMinutes}`;

        return formattedTime;
      },
      // 브라우저 알림 생성
      showNotification(message, imgUrl) {
        if (this.previousNotification) {
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
      // 메세지 보내기
      sendMessage() {
        const token = localStorage.getItem('token');
        if (this.newMessage.trim() === '') return;
        // 새 메시지를 서버로 보냅니다.
        if(token == null) {
          this.showToast('로그인 세션이 종료되었습니다. 재로그인해주세요.');
          window.location.reload();
          // 페이지 새로고침
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
            this.showToast('메시지를 10초 내에 8개 이상 보낼 수 없습니다.');
            return;
          }
          this.loading = true;
          const decodedToken = jwtDecode(token);
          const userid = decodedToken.username; // 사용자 아이디 추출
          const messageObject = {
            editedName: this.editedName,
            user_id: userid,
            message: this.newMessage,
            chat_type: 'text', // 이미지 타입
            chat_file_id: null,
            profilePicture: this.profilePicture,
            chatimageUrl:null,
            chatId: this.selectedChatId,
            ins_ymdhms: now - 10800000  // 서버에서 받은 시간 정보
          };
          this.newMessage = '';
          this.socket.emit('message', messageObject);
          this.loading = false;
          this.$nextTick(() => {
            setTimeout(() => {
                this.scrollToBottom();
              }, 50);
          });
          }
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
        formData.append('file', file);
        try {
          const api = axios.create({
                  baseURL: "https://port-0-backend-nodejs-20zynm2mlk2nnlwj.sel4.cloudtype.app",
                  //baseURL: "http://localhost:3000",
                });
          const response = await api.post('/api/upload', formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          const chat_file_id = response.data.fileId;
          this.chatImgurl(chat_file_id);
        } catch (error) {
          console.error('이미지 업로드 오류:', error);
        }
      },
      // 업로드메세지
      handleUpload() {
        const imageInput = this.$refs.imageInput;
        const file = imageInput.files[0];

        // 파일 크기 확인
        if (file && file.size > this.maxFileSize) {
            this.showToast('이미지 크기가 너무 큽니다. 1MB 이하의 이미지를 선택해주세요.');
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
          const api = axios.create({
                  baseURL: "https://port-0-backend-nodejs-20zynm2mlk2nnlwj.sel4.cloudtype.app",
                  //baseURL: "http://localhost:3000",
                });
          // 파일 업로드 요청
          this.loading = true;
          // 이미지 파일 확장자들의 배열
          const imageExtensions = ["jpg", "jpeg", "png", "gif"];
          const fileExtension = uniqueFileName.slice(((uniqueFileName.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
          const isImageFile = imageExtensions.includes(fileExtension);
          api.post('/api/upload', formData, {
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`, // 토큰을 요청 헤더에 추가
                  },
                  }).then((response) => {
                          if(isImageFile){
                            this.chatImgurl(response.data.fileId);
                          } else {
                            this.chatfileUrl(response.data.fileId, originalFileName);
                          }
                          this.loading = false;
                      // 파일 업로드 성공 시 처리할 로직을 여기에 작성합니다.
                      // 예: 성공 메시지 출력, 업로드 결과를 다른 동작에 활용 등
                      })
        }
      },
      // 파일 메세지 전송1
      async chatfileUrl(chat_file_id, originalFileName) {
        const token = localStorage.getItem('token');
        if (token == null) {
          this.showToast('로그인 세션이 종료되었습니다. 재로그인해주세요.');
          window.location.reload();
          return;
        }
        const now = new Date();
        this.lastMessageTimestamps.push(now);

        // 10초 이전의 타임스탬프 제거
        const tenSecondsAgo = new Date(now - 10000);
        this.lastMessageTimestamps = this.lastMessageTimestamps.filter(timestamp => timestamp > tenSecondsAgo);

        if (this.lastMessageTimestamps.length >= 8) {
          this.showToast('메시지를 10초 내에 8개 이상 보낼 수 없습니다.');
          return;
        }
        const decodedToken = jwtDecode(token);
        const userid = decodedToken.username;
        const messageObject = {
          editedName: this.editedName,
          user_id: userid,
          message: originalFileName, // 이미지 데이터를 메시지로 첨부
          chat_type: 'file', // 이미지 타입
          chat_file_id: chat_file_id,
          profilePicture: this.profilePicture,
          chatimageUrl: `/api/file/download/${chat_file_id}`,
          chatId: this.selectedChatId,
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
      // 이미지 메세지 전송1
      async chatImgurl(chat_file_id) {
        loginMethods.methods.profileImgURL(chat_file_id,(res) => {
                      this.sendImageMessage(chat_file_id, res.data.imageUrl);
                    },
                    (error) => { // 에러 콜백
                      console.error("프로필 이미지 조회 오류:", error);
                    }
        );
      },
      // 이미지 메세지 전송2
      async sendImageMessage(chat_file_id, chatimageUrl) {
        const token = localStorage.getItem('token');
        if (token == null) {
          this.showToast('로그인 세션이 종료되었습니다. 재로그인해주세요.');
          window.location.reload();
          return;
        }
        const now = new Date();
        this.lastMessageTimestamps.push(now);

        // 10초 이전의 타임스탬프 제거
        const tenSecondsAgo = new Date(now - 10000);
        this.lastMessageTimestamps = this.lastMessageTimestamps.filter(timestamp => timestamp > tenSecondsAgo);

        if (this.lastMessageTimestamps.length >= 8) {
          this.showToast('메시지를 10초 내에 8개 이상 보낼 수 없습니다.');
          return;
        }
        const decodedToken = jwtDecode(token);
        const userid = decodedToken.username;
        const messageObject = {
          editedName: this.editedName,
          user_id: userid,
          message: '', // 이미지 데이터를 메시지로 첨부
          chat_type: 'image', // 이미지 타입
          chat_file_id: chat_file_id,
          profilePicture: this.profilePicture,
          chatimageUrl:chatimageUrl,
          chatId: this.selectedChatId,
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
      },

      // 이미지 모달 닫기
      closeImageModal() {
        this.selectedImage = '';
        this.isImageModalOpen = false;
      },
      toggleSearch() {
          this.showModal = true; // 모달 토글
          this.getImageUrl(this.selectUser);
        },
      closeModal() {
          this.showModal = false; // 모달 닫기
      },

      //접속유저 프로필사진 가져오기
      async getImageUrl(userArray) {
        try {
          for (const user of userArray) {
            const profileSearchResponse = await new Promise((resolve, reject) => {
              loginMethods.methods.profileSearch(user, (res) => {
                resolve(res);
              });
            });
            if (profileSearchResponse.data[0].img_id) {
              this.file_no = profileSearchResponse.data[0].img_id;

              try {
                const profileImgResponse = await new Promise((resolve, reject) => {
                  loginMethods.methods.profileImgURL(profileSearchResponse.data[0].img_id, (res) => {
                    resolve(res);
                  });
                });

                this.userPicture[user] = profileImgResponse.data.imageUrl;
              } catch (error) {
                console.error("프로필 이미지 조회 오류:", error);
                this.userPicture[user] = null;
              }
            } else {
              this.userPicture[user] = null;
            }
          }
        } catch (error) {
          console.error("프로필 조회 오류:", error);
        }
      },
      scrollToBottom() {
        // chatContainer 요소가 렌더링되지 않은 경우에 대한 예외 처리
        if (this.chatContainer) {
          this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        }
      },
      
      async checkScrollPosition() {
        const chatContainer = this.$refs.chatContainer;
        if (chatContainer.scrollTop === 0 && !this.loadingPreviousMessages && this.shouldMaintainScroll) {
          this.loadingPreviousMessages = true;
          try {
            debugger;
            const oldestMessage = {
              oldestMessageTime: this.messages[0].ins_ymdhms,
              chatId:this.selectedChatId,
            };
            this.socket.emit('getPreviousMessages', oldestMessage);
          } catch (error) {
            console.error('이전 채팅 조회 오류:', error);
          } finally {
            this.loadingPreviousMessages = false;
          } 
        }
        
        const ins_ymdhms = new Date(this.messages[0].ins_ymdhms);
        const adjustDate = new Date(ins_ymdhms.getTime() - (9 * 60 * 60 * 1000)); //한국시간적용

        const today = new Date().toLocaleDateString();
        const messageDate = new Date(adjustDate).toLocaleDateString();
        // 토스트(메세지시간)
        if (!this.isShowingToast && messageDate !== today) {
          this.isShowingToast = true;
          this.showToast(`${messageDate}`);
          setTimeout(() => {
              this.isShowingToast = false;
            }, 2000); // 2초 후에 토스트 메시지 표시 여부를 리셋
          }
      },

      showToast(message) {
        this.$toast.open({
          message: message,
          duration: 2000, // 토스트 메시지가 보여지는 시간 (2초)
          position: 'top', // 토스트 메시지 위치
          type: 'info', // 토스트 메시지 타입 (info, success, error)
          style: {
            background: '#888', // 회색 배경 색상
            'font-size': '14px', // 작은 글꼴 크기
            color: '#fff', // 흰색 글자 색상
          },
        });
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
    watch: {
      messages(newMessages, oldMessages) {
        // 메시지 배열이 갱신될 때마다 스크롤을 제일 아래로 이동
        this.$nextTick(this.scrollToBottom);
      },
    },
  };
  </script>
  
<style scoped>

@media (min-width: 768px) {
    .chat-container{
    width:100%;
    min-width:1400px;
    max-height: 700px;
    display: flex;
    flex-direction: column;
    font-family: Arial, sans-serif;
    }
  }



.chat-header {
  background-color: #6200ff;
  color: #fff;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}

.chat-messages {
  flex: 1;
  padding: 10px;
  max-height: 800px;
  overflow-y: auto;
}

.message {
  display: flex;
  align-items: center; /* 수직 가운데 정렬 */
  padding: 8px;
  border-radius: 5px;
  background-color: #f0f0f0; 
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

.send-button {
  padding: 8px 16px;
  background-color: #6200ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.send-button:hover {
  background-color: #0056b3;
}

.profile-image{
  border-radius: 50%; /* 원형태로 보여주기 위해 반지름을 50%로 설정 */
    width: 100x;
    height: 50px;
    object-fit: cover; /* 이미지 비율 유지 */
    border: 2px solid #ccc;
    height: 100%; /* 부모 컨테이너의 높이에 맞게 설정 */
  margin-right: 10px;
}

.message-bubble {
  background-color: #f0f0f0;
  border-radius: 16px;
  padding: 10px;
  display: inline-block;
  max-width: 70%;
}

.my-message {
  background-color: lightskyblue;
  color: white;
  align-self: flex-end;
}
.message-content {
  font-size: 14px; /* 작은 글씨체 크기 */
  color: #888; /* 연한 색상 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  margin-left: 10px;
}

.message-name {
  margin-left: 10px;
  margin-right: 15px; /* 이름과 메시지 사이 간격 */
  font-weight: bold; /* 볼드체 */
  display: inline-block;
  vertical-align: middle;
}

.message-date {
  font-size: 12px; /* 날짜 글씨체 크기 */
  color: #bbb; /* 연한 색상 */
  margin-left: 10px;
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
.chat-title {
  font-size: 24px;
  color: white;
  margin: 0;
}
.message-image {
  max-width: 100%;
  max-height: 200px; /* 이미지의 최대 높이 설정 */
  object-fit: contain; /* 이미지를 가득 차게 표시 */
  border: 1px solid #ccc;
}
.hidden-input {
  display: none;
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

.modal_close,  .chat_invite{
  background-color: #6200ff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  float: right;
}

.modal button:hover {
  background-color: #0056b3;
}

.chat_input_invite{
  width: 65%;
}
.chat_invite {
  width: 30%;
  margin-left: 10px;
  margin-bottom: 10px;
}
.chat_exit {
  background-color: brown;
  padding: 10px 20px;
  border-radius: 5px;
  margin-bottom: 10px;
  border: none;
  transition: background-color 0.3s;
}
.enlarged-image {
  max-width: 100%; /* 이미지 최대 너비 설정 */
  max-height: 80vh; /* 이미지 최대 높이 설정 (화면 높이의 80%) */
  object-fit: contain; /* 이미지의 비율 유지하며 채우기 */
  margin: 0 auto; /* 가운데 정렬 */
  display: block; /* 블록 요소로 설정하여 가로 중앙 정렬을 위함 */
}
/* 모달 스타일 */

@media (max-width: 768px) {
    .chat-container{
    width:100%;
    max-height: 700px;
    display: flex;
    flex-direction: column;
    font-family: Arial, sans-serif;
    }
    .chat-messages {
      max-height: none;
      overflow-y: auto;
    }

    .chat-input {
      flex-direction: column;
      align-items: stretch;
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

  .my-message {
    background-color: #87CEEB;
    color: white;
    align-self: flex-end;
  }
  .message-content {
    font-size: 12px; /* 작은 글씨체 크기 */
    color: #888; /* 연한 색상 */
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-grow: 1;
    margin-left: 10px;
  }

  .message-name {
    font-weight: bold; /* 볼드체 */
    min-width: 50px;
    vertical-align: middle;
    font-size: 13px;
  }

  .message-date {
    font-size: 10px; /* 날짜 글씨체 크기 */
    color: #bbb; /* 연한 색상 */
    margin-left: 10px;
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
  margin-left: 0px;
  }

}
  </style>