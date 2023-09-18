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

export default {
  data() {
    return {
    };
  },
  methods: {
    alarm() {
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
  background-image: url("@/assets/img_background.jpg");
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