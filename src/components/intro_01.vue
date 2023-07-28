<template>
  <main style="margin-top: 50px;">
    <div id="myCarousel" class="carousel slide">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="슬라이드 1"></button>
        <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="슬라이드 2"></button>
        <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="슬라이드 3"></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <svg class="bd-placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#777"/></svg>
          <!-- container1 내용 -->
          <div v-if="showContainer1" class="carousel-container carousel-caption text-start">
            <h1>예시 제목.</h1>
            <p>첫 번째 슬라이드를 대표하는 임시 콘텐츠입니다.</p>
            <p><a class="btn btn-lg btn-primary" href="#">오늘 가입하세요</a></p>
          </div>
        </div>
        <div class="carousel-item">
          <svg class="bd-placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#777"/></svg>
          <!-- container2 내용 -->
          <div v-if="showContainer2" class="carousel-container carousel-caption">
            <h1>또 다른 예시 제목.</h1>
            <p>캐러셀의 두 번째 슬라이드를 대표하는 임시 콘텐츠입니다.</p>
            <p><a class="btn btn-lg btn-primary" href="#">더 알아보기</a></p>
          </div>
        </div>
        <div class="carousel-item">
          <svg class="bd-placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#777"/></svg>
          <!-- container3 내용 -->
          <div v-if="showContainer3" class="carousel-container carousel-caption text-end">
            <h1>마지막으로, 이것도 하나 더.</h1>
            <p>이 캐러셀의 세 번째 슬라이드를 대표하는 임시 콘텐츠입니다.</p>
            <p><a class="btn btn-lg btn-primary" href="#">갤러리 둘러보기</a></p>
          </div>
        </div>
      </div>
      <!-- 추가: carousel-control-prev, carousel-control-next 버튼 -->
      <div class="carousel-buttons">
        <!-- 이전 버튼 (첫 번째 슬라이드로 이동) -->
        <button @click="showPrevContainer" class="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide-to="2">
          <span class="carousel-control-prev-icon"></span>
          <span class="visually-hidden">이전</span>
        </button>

        <!-- 다음 버튼 (두 번째 슬라이드로 이동) -->
        <button @click="showNextContainer" class="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide-to="1">
          <span class="carousel-control-next-icon"></span>
          <span class="visually-hidden">다음</span>
        </button>
      </div>
    </div>

<!-- Marketing messaging and featurettes
================================================== -->
<!-- Wrap the rest of the page in another container to center all the content. -->

<div class="container marketing">

  <!-- Three columns of text below the carousel -->
  <div class="row">
    <div class="col-lg-4">
      <svg class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 140x140" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#777"/><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>

      <h2 class="fw-normal">Heading</h2>
      <p>Some representative placeholder content for the three columns of text below the carousel. This is the first column.</p>
      <p><a class="btn btn-secondary" href="#">View details &raquo;</a></p>
    </div><!-- /.col-lg-4 -->
    <div class="col-lg-4">
      <svg class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 140x140" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#777"/><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>

      <h2 class="fw-normal">Heading</h2>
      <p>Another exciting bit of representative placeholder content. This time, we've moved on to the second column.</p>
      <p><a class="btn btn-secondary" href="#">View details &raquo;</a></p>
    </div><!-- /.col-lg-4 -->
    <div class="col-lg-4">
      <svg class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 140x140" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#777"/><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>

      <h2 class="fw-normal">Heading</h2>
      <p>And lastly this, the third column of representative placeholder content.</p>
      <p><a class="btn btn-secondary" href="#">View details &raquo;</a></p>
    </div><!-- /.col-lg-4 -->
  </div><!-- /.row -->


  <!-- START THE FEATURETTES -->

  <hr class="featurette-divider">

  <div class="row featurette">
    <div class="col-md-7">
      <h2 class="featurette-heading fw-normal lh-1">First featurette heading. <span class="text-muted">It’ll blow your mind.</span></h2>
      <p class="lead">Some great placeholder content for the first featurette here. Imagine some exciting prose here.</p>
    </div>
    <div class="col-md-5">
      <svg class="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#eee"/><text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text></svg>

    </div>
  </div>

  <hr class="featurette-divider">

  <div class="row featurette">
    <div class="col-md-7 order-md-2">
      <h2 class="featurette-heading fw-normal lh-1">Oh yeah, it’s that good. <span class="text-muted">See for yourself.</span></h2>
      <p class="lead">Another featurette? Of course. More placeholder content here to give you an idea of how this layout would work with some actual real-world content in place.</p>
    </div>
    <div class="col-md-5 order-md-1">
      <svg class="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#eee"/><text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text></svg>

    </div>
  </div>

  <hr class="featurette-divider">

  <div class="row featurette">
    <div class="col-md-7">
      <h2 class="featurette-heading fw-normal lh-1">And lastly, this one. <span class="text-muted">Checkmate.</span></h2>
      <p class="lead">And yes, this is the last block of representative placeholder content. Again, not really intended to be actually read, simply here to give you a better view of what this would look like with some actual content. Your content.</p>
    </div>
    <div class="col-md-5">
      <svg class="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#eee"/><text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text></svg>

    </div>
  </div>

  <hr class="featurette-divider">

  <!-- /END THE FEATURETTES -->

</div><!-- /.container -->
</main>
</template>
<script>
export default {
  data() {
    return {
      showContainer1: true,
      showContainer2: false,
      showContainer3: false,
    };
  },
  methods: {
    showNextContainer() {
      if (this.showContainer1) {
        this.showContainer1 = false;
        this.showContainer2 = true;
      } else if (this.showContainer2) {
        this.showContainer2 = false;
        this.showContainer3 = true;
      } else {
        this.showContainer3 = false;
        this.showContainer1 = true;
      }
    },
    showPrevContainer() {
      if (this.showContainer1) {
        this.showContainer1 = false;
        this.showContainer3 = true;
      } else if (this.showContainer2) {
        this.showContainer2 = false;
        this.showContainer1 = true;
      } else {
        this.showContainer3 = false;
        this.showContainer2 = true;
      }
    },
  },
};
</script>

<style scoped>
  .bd-placeholder-img {
    font-size: 1.125rem;
    text-anchor: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  .carousel-inner img {
  width: 100%;
  height: auto;
}
.carousel-caption {
  padding: 20px;
  border-radius: 10px;
}

.carousel-caption h1 {
  font-size: 2rem;
  
  margin-bottom: 10px;
}

.carousel-caption p {
  font-size: 1.2rem;
}

.featurette-image {
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.featurette-heading {
  color: #007bff;
}

/* col-lg-4 요소 정렬과 간격 조정 */
.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 50px;
}

.row .col-lg-4 {
  margin-bottom: 30px;
  text-align: center;
}

.row .col-lg-4 img {
  margin-bottom: 10px;
}

.row .col-lg-4 h2 {
  font-size: 1.8rem;
}

.row .col-lg-4 p {
  font-size: 1.1rem;
}

/* 인디케이터, 이전/다음 버튼, 네비게이션 숨기기 */
.carousel-indicators,
.nav-scroller {
  display: none;
}



  @media (min-width: 768px) {
    .bd-placeholder-img-lg {
      font-size: 3.5rem;
    }
  }

  .b-example-divider {
    height: 3rem;
    background-color: rgba(0, 0, 0, .1);
    border: solid rgba(0, 0, 0, .15);
    border-width: 1px 0;
    box-shadow: inset 0 .5em 1.5em rgba(0, 0, 0, .1), inset 0 .125em .5em rgba(0, 0, 0, .15);
  }

  .b-example-vr {
    flex-shrink: 0;
    width: 1.5rem;
    height: 100vh;
  }

  .bi {
    vertical-align: -.125em;
    fill: currentColor;
  }

  .nav-scroller {
    position: relative;
    z-index: 2;
    height: 2.75rem;
    overflow-y: hidden;
  }

  .nav-scroller .nav {
    display: flex;
    flex-wrap: nowrap;
    padding-bottom: 1rem;
    margin-top: -1px;
    overflow-x: auto;
    text-align: center;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }
</style>