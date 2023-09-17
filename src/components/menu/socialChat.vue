<template>
    <div>
      <button @click="toggleMenu">글 쓰기</button>
  
      <!-- 글 쓰기 메뉴 -->
      <div v-if="showMenu">
        <h2>글 작성</h2>
          <textarea v-model="postContent" placeholder="글을 입력하세요"></textarea>
          <button @click="submitPost" class="button-submit">게시</button>
      </div>

      <!-- 글 목록 -->
    <div class="post-list">
      <div v-for="(post, index) in posts" :key="index" class="post">
        <div class="post-content">내용{{ post.content }}</div>
        <div class="post-author">작성자: {{ post.author }}</div>
        <div class="post-date">작성일: {{ post.date }}</div>
      </div>
    </div>

    <!-- 무한 스크롤 로딩 표시 -->
    <div v-if="loading" class="loading-indicator">로딩 중...</div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        showMenu: false,
        postContent: "",
        posts: [], // 글 목록 데이터 배열
        loading: false, // 데이터 로딩 중 여부
        currentPage: 1, // 현재 페이지
      };
    },
    methods: {
      toggleMenu() {
        this.showMenu = !this.showMenu;
      },
      submitPost() {
        // 글을 게시하는 로직을 이곳에 추가하세요.
        // 백엔드와 통신하거나 상태를 업데이트하는 등의 작업이 포함됩니다.
        console.log("게시된 글:", this.postContent);
  
        // 글 내용 초기화
        this.postContent = "";
  
        // 실제 글 데이터를 업데이트하는 로직을 추가하세요.
        // this.posts.push({ content: this.postContent, author: "사용자", date: new Date() });
      },
      loadMorePosts() {
        // 더 많은 글을 로드하는 로직을 이곳에 추가하세요.
        // 페이지를 증가하고 새로운 글 데이터를 가져와 this.posts에 추가합니다.
        // 로딩 중 표시를 관리합니다.
      },
    },
    mounted() {
      // 컴포넌트가 마운트될 때 초기 글 목록을 로드하는 로직을 추가하세요.
      // this.loadMorePosts();
    },
  };
  </script>
  
  <style scoped>
  /* 글 쓰기 메뉴 스타일링을 여기에 추가하세요 */
  button {
    background-color: #007bff;
    color: #fff;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
  }
  
  textarea {
    width: 100%;
    height: 100px;
    padding: 10px;
    margin-top: 10px;
  }
  
  .button-submit {
    background-color: #28a745;
  }

  .post-list {
  margin-top: 20px;
}

.post {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
}

.loading-indicator {
  text-align: center;
  margin-top: 20px;
}
  </style>a