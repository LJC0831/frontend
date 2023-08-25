<template>
    <div class="hello-world">
      <img src="@/assets/logo.png" alt="로고 이미지" class="logo" />
      <h2>{{ message }}</h2>
      <p class="description">
        Vue.js 3 환경에서 만든 반응형 어플리케이션 입니다.<br/>
        제작자 : LJC <br/>
        깃허브 놀러오세요
      </p> 
      <a class="btn btn-primary cta-button" href="https://github.com/LJC0831" target="_blank"><i class="bi bi-github"></i> 이동</a>
      
    </div>
  </template>
  
  <script>
  /* eslint-disable */
  export default {
    data() {
      return {
        message: "안녕하세요!",
      };
    },
  };
  </script>
  
  <style scoped>

  /* 모바일 */
@media (max-width: 768px) {
  .hello-world{
   width:100%;
   padding: 20px;
  }
}

/* 데스크탑 */
@media (min-width: 768px) {
    .hello-world{
    margin-left: -300px;
    
    }
  }

  .hello-world {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-top: 100px;
    
  }

  .bi bi-github{
    font-size: 22px;
    line-height: 22px;
    color:#333;
}
  .logo {
  max-width: 150px;
  margin-bottom: 20px;
}
  
  h2 {
    font-size: 36px;
    color: #333;
    margin-bottom: 10px;
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
    text-decoration: none;
  }
  
  .cta-button:hover {
    background-color: #0056b3;
  }
  </style>