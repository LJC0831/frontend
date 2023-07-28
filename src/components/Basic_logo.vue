<template>
    <div class="hello-world">
      <img src="@/assets/logo.png" alt="로고 이미지" class="logo" />
      <h2>{{ message }}</h2>
      <p class="description">
        Vue.js 3 환경에서 만든 화면 예제입니다. 더 많은 기능과 스타일을 추가해보세요!
      </p>
      <button class="cta-button">시작하기</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        message: "안녕하세요!",
      };
    },
  };
  </script>
  
  <style scoped>
  .hello-world {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-top: 100px;
  }
  
  h2 {
    font-size: 36px;
    color: #333;
  }
  
  .description {
    font-size: 18px;
    color: #666;
    margin-bottom: 30px;
  }
  
  .cta-button {
    padding: 10px 20px;
    font-size: 18px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .cta-button:hover {
    background-color: #0056b3;
  }
  </style>