<template>
  <div class="chat-container">
    <div class="chat-header">채팅방</div>
    <div class="chat-messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <img v-if="!message.profilePicture" src="@/assets/profile-user.png" alt="내 정보" class="profile-image" />
        <img v-if="message.profilePicture" class="profile-image" :src="message.profilePicture" alt="프로필 사진" />
        <span class="message-content">{{ message.editedName }} : {{ message.message }}</span>
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
        newMessage : '',
        editedName : "", 
        file_no : null,
        profilePicture: null,
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
      });

      // 서버로부터 최근 메시지를 받을 때 호출되는 콜백 함수
      this.socket.on('messageHistory', (messages) => {
        // 받은 채팅 메시지들을 화면에 표시하는 로직
        this.messages = messages;
      });

      //프로필정보조회
      this.profileSearch();
      // 서버에 최근 메시지를 요청합니다.
      this.socket.emit('getLatestMessages');
    },
    methods: {
      // 메세지 보내기
      sendMessage() {
        const token = localStorage.getItem('token');
        if (this.newMessage.trim() === '') return;
        // 새 메시지를 서버로 보냅니다.
        if(token == null) {
          alert('로그인 세션이 종료되었습니다. 재로그인해주세요.');
          // 페이지 새로고침
          return;
        }
        const decodedToken = jwtDecode(token);
        const userid = decodedToken.username; // 사용자 아이디 추출
        const messageObject = {
          editedName: this.editedName,
          user_id: userid,
          message: this.newMessage,
          profilePicture: this.profilePicture
        };
        this.socket.emit('message', messageObject);
        this.newMessage = '';
      },

      // 내정보 조회
      profileSearch(){
       const token = localStorage.getItem('token');
        if(token == null) {
          alert('로그인 세션이 종료되었습니다. 재로그인해주세요.');
          return;
        }
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
        
      },
    },
  };
  </script>
  
  <style scoped>

@media (max-width: 768px) {
  .chat-container{
    width:100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-family: Arial, sans-serif;
  }
}

@media (min-width: 768px) {
    .chat-container{
    min-width: 1500px;
    min-height: 800px;
    height: 100%;
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
  margin-bottom: 5px;
  padding: 8px;
  border-radius: 5px;
  background-color: #f0f0f0;
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
}
  </style>