<template>
  <div class="content">
    <ul>
      <li v-for="(user, index) in userList" :key="index" class="user-item">
        <img v-if="user.img_id !== null" :src="user.profile_url" alt="프로필 사진" class="profile-picture" />
        <img v-if="user.img_id === null" src="../../assets/profile-user.png" class="profile-picture" />
        <div class="user-info">
        <h5>{{ user.user_nm }}</h5>
          <p>{{ user.gender_type }}</p>
          <p>{{ truncateIntro(user.intro) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
/* eslint-disable */
import chatMethods from '../../scripts/chat.js';

export default {
  data() {
    return {
        userList: [],
        maxLength: 100, 
    };
  },
  created(){
    this.search01();
  },
  methods: {
    search01() {
        try { 
            chatMethods.methods.searchUserList((res) => {
                if(res.status === 200){
                    this.userList = res.data;
                }
            },
            (error) => { // 에러 콜백
                console.error("검색 오류:", error);
            });
      } catch (error) {
        console.error("검색 오류:", error);
      }
    },

    truncateIntro(intro) {
      const windowWidth = window.innerWidth;
      if (windowWidth < 768) {
        this.maxLength = 10; // 화면이 작을 때 길이를 줄임
      } else {
        this.maxLength = 100; // 화면이 크면 기본 길이로 설정
      }
      if (intro !== null){
        if (intro.length <= this.maxLength) {
        return intro;
        } else {
          return intro.slice(0, this.maxLength) + '...';
        }
      }
    },
  }
};
</script>

<style scoped>
.content{
  height: 100vh;
}
.user-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  background-color: rgb(255, 255, 255);
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}
.user-item:hover {
  transform: translateY(-3px);
}

.profile-picture {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.user-info {
    display: flex;
    flex-direction: column;
    margin: 10px;
    height: 60px;
}

h5 {
  font-size: 17px;
  margin: 0;
}

.gender {
  font-size: 16px;
  margin: 0;
  color: #777;
}

p {
  font-size: 16px;
  margin: 0;
  color: #666;
}
</style>