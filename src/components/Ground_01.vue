<template>
  <div class="ground">
    <Header/>
    <div class="main-container">
      <Sidebar />
      <Memo/>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Header from "./Header_01.vue";
import Footer from "./Footer_01.vue";
import Memo from "./Memo_01.vue";
import Sidebar from "./SideBar_01"; // 사이드바 컴포넌트를 import 합니다.
export default {
  components:{Header, Footer, Sidebar, Memo}
}
</script>

<style>
.ground {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-container {
  display: flex; /* 사이드바와 메모 컴포넌트를 가로로 배치 */
}
</style>


