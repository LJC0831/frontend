<template>
  <div class="main">
    <!-- Header Section -->
    <div class="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-light header-section">
      <div class="col-md-5 p-lg-5 mx-auto my-5 header-content">
        <div class="header-text">
        <h1 class="display-4 fw-normal">Free chat application</h1>
        <p class="lead fw-normal" >누구나 무료로 사용이 가능한 채팅 어플리케이션 입니다.</p>
        <a class="btn btn-outline-secondary" href="#">Coming soon</a>
      </div>
      </div>
      <div class="product-device shadow-sm d-none d-md-block"></div>
      <div class="product-device product-device-2 shadow-sm d-none d-md-block"></div>
    </div>

    <!-- Feature Section -->
    <div class="d-md-flex flex-md-equal w-100 my-md-3 ps-md-3">
      <div class="text-bg-dark me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden">
        <div class="my-3 py-3">
          <h2 class="display-5">Another headline</h2>
          <p class="lead">And an even wittier subheading.</p>
        </div>
        <div class="bg-light shadow-sm mx-auto" style="width: 80%; height: 300px; border-radius: 21px 21px 0 0;"></div>
      </div>
      <div class="bg-light me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden">
        <div class="my-3 p-3">
          <h2 class="display-5">Another headline</h2>
          <p class="lead">And an even wittier subheading.</p>
        </div>
        <div class="bg-dark shadow-sm mx-auto" style="width: 80%; height: 300px; border-radius: 21px 21px 0 0;"></div>
      </div>
    </div>

    <!-- Feature Section 2 -->
    <div class="d-md-flex flex-md-equal w-100 my-md-3 ps-md-3">
      <div class="bg-light me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden">
        <div class="my-3 p-3">
          <h2 class="display-5">Another headline</h2>
          <p class="lead">And an even wittier subheading.</p>
        </div>
        <div class="bg-dark shadow-sm mx-auto" style="width: 80%; height: 300px; border-radius: 21px 21px 0 0;"></div>
      </div>
      <div class="text-bg-primary me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden">
        <div class="my-3 py-3">
          <h2 class="display-5">Another headline</h2>
          <p class="lead">And an even wittier subheading.</p>
        </div>
        <div class="bg-light shadow-sm mx-auto" style="width: 80%; height: 300px; border-radius: 21px 21px 0 0;"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 모바일 */
@media (max-width: 768px) {
  .header-section{
   width:100%;
  }
}

@media (min-width: 768px) {
  .header-section{
   width:100%;
  }
}

.header-text {
  display: block; /* 블록 요소로 만듭니다. */
  margin-top: 110px; /* 원하는 간격을 지정합니다. */
}

/* 부트스트랩 클래스 및 커스텀 스타일 작성 */
/* 상단 섹션 스타일 */
.position-relative {
  overflow: hidden;
  /* 이미지 파일 경로를 수정해주세요 */
  background-image: url("@/assets/main_img.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.p-lg-5 {
  padding: 3rem !important;
}
.display-4 {
  font-size: 2.5rem;
  font-weight: 300;
}
.fw-normal {
  font-weight: 400;
}
.lead {
  font-size: 1.25rem;
  font-weight: 300;
}
.btn {
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 400;
}
.btn-outline-secondary {
  color: #6c757d;
  border-color: #6c757d;
}
.btn-outline-secondary:hover {
  background-color: #6c757d;
  color: #fff;
}

/* 중간 섹션 스타일 */
.flex-md-equal {
  display: flex;
}
.text-bg-dark {
  background-color: #343a40;
  color: #fff;
}
.bg-light {
  background-color: #f8f9fa !important;
}
.text-center {
  text-align: center !important;
}
.overflow-hidden {
  overflow: hidden;
}
.display-5 {
  font-size: 2rem;
  font-weight: 300;
}

/* 추가적인 스타일 작성... */
</style>