<template>
  <div class="chat-container">
    <div class="chat-header">채팅방</div>
    <div v-if="loading" class="loading-overlay">
        <img src="../../assets/loading.gif" alt="loading" class="loading-image">
      </div>
    <div class="chat-messages" ref="chatContainer" @scroll="checkScrollPosition">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <img v-if="!message.profilePicture" src="@/assets/profile-user.png" alt="내 정보" class="profile-image" />
        <img v-if="message.profilePicture" class="profile-image" :src="message.profilePicture" alt="프로필 사진" />
        <span class="message-name">{{ message.editedName }} </span>
        <div class="message-bubble" :class="{ 'my-message': message.message }">
          <span class="message-text">{{ message.message }}</span>
        </div>
        <span class="message-date">{{ formatDate(message.ins_ymdhms) }}</span>
      </div>
    </div>
    <div class="chat-input">
      <input type="text" v-model="newMessage" @keyup.enter="sendMessage" placeholder="메시지를 입력하세요..." />
      <button @click="sendMessage" class="send-button">전송</button>
    </div>
  </div>
</template>
  
  <script>
  /* eslint-disable */
  import io from 'socket.io-client';
  import jwtDecode from 'jwt-decode';
  import loginMethods from '../../scripts/login.js';

  export default {
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
      };
    },
    created() {
      // Socket.IO 클라이언트를 초기화하고 서버에 연결합니다.
      //this.socket = io('http://localhost:3000', {
      this.socket = io('https://port-0-backend-nodejs-20zynm2mlk2nnlwj.sel4.cloudtype.app', {
        withCredentials: true, // 쿠키와 인증 정보를 전송할 수 있도록 설정 (선택 사항)
      });
      // 서버로부터 메시지를 받으면 채팅 화면에 메시지를 표시합니다.
      this.socket.on('message', (message) => {
        this.messages.push(message);
        this.$nextTick(() => {
          this.scrollToBottom();
        });
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
          this.scrollToBottom();
          //this.loading = false;
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
              //this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
              this.chatContainer.scrollTop = 10;
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
      this.profileSearch();
      // 서버에 최근 메시지를 요청합니다.
      this.socket.emit('getLatestMessages');
    },
    methods: {
      //날짜 포맷
      formatDate(dateTime) {
        // 주어진 dateTime을 Date 객체로 변환
          const originalDate = new Date(dateTime);

        // 3시간을 밀리초 단위로 변환하여 더하고 새로운 Date 객체 생성
        const adjustedDate = new Date(originalDate.getTime() - (9 * 60 * 60 * 1000));

        // 변환된 날짜를 원하는 포맷으로 포맷팅
        const options = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Asia/Seoul' // 대한민국 타임존
        };
        const formattedDate = adjustedDate.toLocaleString('ko-KR', options);

        return formattedDate;
      },
      // 메세지 보내기
      sendMessage() {
        const token = localStorage.getItem('token');
        if (this.newMessage.trim() === '') return;
        // 새 메시지를 서버로 보냅니다.
        if(token == null) {
          alert('로그인 세션이 종료되었습니다. 재로그인해주세요.');
          window.location.reload();
          // 페이지 새로고침
          return;
        }
        // 도배체크
        const now = new Date();
        this.lastMessageTimestamps.push(now);

        // 10초 이전의 타임스탬프 제거
        const tenSecondsAgo = new Date(now - 10000);
        this.lastMessageTimestamps = this.lastMessageTimestamps.filter(timestamp => timestamp > tenSecondsAgo);

        if (this.lastMessageTimestamps.length >= 8) {
          // 사용자가 최근 10초 내에 8개 이상의 메시지를 보냄
          alert('메시지를 10초 내에 8개 이상 보낼 수 없습니다.');
          return;
        }

        const decodedToken = jwtDecode(token);
        const userid = decodedToken.username; // 사용자 아이디 추출
        const messageObject = {
          editedName: this.editedName,
          user_id: userid,
          message: this.newMessage,
          profilePicture: this.profilePicture,
          ins_ymdhms: now - 10800000  // 서버에서 받은 시간 정보
        };
        this.socket.emit('message', messageObject);
        this.newMessage = '';
        this.$nextTick(() => {
          setTimeout(() => {
              this.scrollToBottom();
            }, 50);
        });
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
            const oldestMessageTime = this.messages[0].ins_ymdhms;
            this.socket.emit('getPreviousMessages', oldestMessageTime);
          } catch (error) {
            console.error('이전 채팅 조회 오류:', error);
          } finally {
            this.loadingPreviousMessages = false;
          } 
        }
      },

      // 내정보 조회
      profileSearch(){
       const token = localStorage.getItem('token');
        if(token != null) {
          const decodedToken = jwtDecode(token);
          const userid = decodedToken.username; // 사용자 아이디 추출
          loginMethods.methods.profileSearch(userid, (res) => {
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
    min-width:1300px;
    max-height: 800px;
    display: flex;
    flex-direction: column;
    font-family: Arial, sans-serif;
    }
  }



.chat-header {
  background-color: #007bff;
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
  /*background-color: #f0f0f0; */
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
  margin-left: 10px;
  padding: 8px 16px;
  background-color: #007bff;
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
  width: 40px;
}

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
      width: 60x;
      height: 50px;
      object-fit: cover; /* 이미지 비율 유지 */
      border: 2px solid #ccc;
  }

  .message-bubble {
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
    margin-left: 5px;
    margin-right: 8px; /* 이름과 메시지 사이 간격 */
    font-weight: bold; /* 볼드체 */
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
    width: 40px;
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