<template>
  <div class="main">
    <!-- Header Section -->
    <div class="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-light header-section">
      <div class="col-md-5 p-lg-5 mx-auto my-5 header-content">
        <div class="header-text">
        <h1 class="display-4 fw-normal">Free chat application</h1>
        <p class="lead fw-normal" >누구나 무료로 사용이 가능한 채팅 어플리케이션 입니다.</p>
        <p @click="alarm()" class="btn btn-outline-secondary">Coming soon</p>
      </div>
      </div>
      <div class="product-device shadow-sm d-none d-md-block"></div>
      <div class="product-device product-device-2 shadow-sm d-none d-md-block"></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as commons from './../scripts/common.js';
import axios from 'axios';

export default {
  data() {
    return {
    };
  },
  methods: {
    alarm() {
      const accessToken = localStorage.getItem('kakao_code');
      if (!accessToken) {
        console.error('액세스 토큰이 없습니다.');
        return;
      }
      const kakaoMessage = {
        object_type: 'text',  // 'text' 형식으로 메시지 전송
        text: '안녕하세요! 카카오톡 메시지 전송 테스트입니다.',
        link: {
          web_url: 'https://friendtalk.netlify.app',
          mobile_web_url: 'https://friendtalk.netlify.app',
        },
      };

      axios({
          method: 'post',
          url: 'https://kapi.kakao.com/v2/api/talk/memo/default/send',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: {
            template_object: kakaoMessage,
          },
        })
          .then((response) => {
            console.log('메시지 전송 성공:', response.data);
          })
          .catch((error) => {
            console.error('메시지 전송 실패:', error);
          });
      commons.showToast(this, '기능준비중입니다 ...');
    },
  }
};
</script>

<style scoped>

.header-text {
  display: block; /* 블록 요소로 만듭니다. */
  margin-top: 110px; /* 원하는 간격을 지정합니다. */
}

/* 부트스트랩 클래스 및 커스텀 스타일 작성 */
/* 상단 섹션 스타일 */
.position-relative {
  overflow: hidden;
  min-height:650px;
  /* 이미지 파일 경로를 수정해주세요 */
  background-image: url("@/assets/chat_main.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.display-4 {
  font-size: 2.5rem;
  font-weight: 300;
}
.fw-normal {
  font-weight: 400;
}

.btn {
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 400;
}

</style>