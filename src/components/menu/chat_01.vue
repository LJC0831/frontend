<template>
    <div class="chat-container">
      <div class="chat-header">채팅방</div>
      <div class="chat-messages">
        <div v-for="(message, index) in messages" :key="index" class="message">
          {{ message }}
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
  
  export default {
    data() {
      return {
        messages: [],
        newMessage: '',
      };
    },
    created() {
      // Socket.IO 클라이언트를 초기화하고 서버에 연결합니다.
      //this.socket = io('http://localhost:3000', {
        this.socket = io('https://port-0-backend-nodejs-20zynm2mlk2nnlwj.sel4.cloudtype.app/', {
        withCredentials: true, // 쿠키와 인증 정보를 전송할 수 있도록 설정 (선택 사항)
      });
  
      // 서버로부터 메시지를 받으면 채팅 화면에 메시지를 표시합니다.
      this.socket.on('message', (message) => {
        this.messages.push(message);
      });
    },
    methods: {
      sendMessage() {
        if (this.newMessage.trim() === '') return;
        // 새 메시지를 서버로 보냅니다.
        this.socket.emit('message', this.newMessage);
        this.newMessage = '';
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
  max-height: 400px;
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
  </style>