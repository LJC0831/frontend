<template>
    <div class="memo">
        <div class = "act">
            <input type="text" v-model="searchKeyword" @keyup.enter="search01()" placeholder="검색어를 입력하세요."/>
            <button class="btn btn-primary" @click="search01()">조회 </button>
            <button class="btn btn-success" @click="add()">+ 추가</button>
            <button class="btn btn-danger" @click="del()">- 삭제</button>
        </div>
        <ul>
            <li v-for="d in state.data" :key="d.id" @click="edit(d.id)">
                <input type="checkbox" v-model="d.checked" @click.stop />
                {{ d.content }}
                <span class="author">작성자 : {{ d.user_id }}</span>
            </li>
        </ul>
    </div>
</template> 

<script>
/* eslint-disable */
import { reactive, ref, toRefs } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';
export default {
    setup() {
        const api = axios.create({
        baseURL: "https://port-0-backend-nodejs-20zynm2mlk2nnlwj.sel4.cloudtype.app",
        });
        
        const state = reactive({
            data : [],
        });

        const add = ()=>{
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인 후에 메모를 추가할 수 있습니다.');
                return;
            }
            const content = prompt("내용을 입력해주세요.");

            if(content != null){
                api.post("/api/memos", {content}).then((res)=>{
                state.data = res.data;
                })
            }
        }

        const del = ()=>{
            const checkedIds = state.data.filter((d) => d.checked).map((d) => d.id);

            if (checkedIds.length === 0) {
                alert("삭제할 항목을 선택해주세요.");
                return;
            } else {
                const password = prompt("내용을 삭제하려면 비밀번호를 입력하세요. 힌트) 생일 4자 ");
                if (password === "0831") {
                    api.delete(`/api/memos/${checkedIds.join(',')}`).then((res) => {
                         state.data = res.data;
                     });
                    state.data.forEach((d) => (d.checked = false)); // 체크항목 초기화
                } else {
                    alert("비밀번호가 틀립니다.");
                }
                
            }  
        };

        const edit = (id)=>{
            const content = prompt("내용을 입력해주세요", state.data.find(d=>d.id === id).content);
            if(content != null){
                api.put("/api/memos/" + id, {content}).then((res)=>{
                state.data = res.data;
                })
            }

            
        }
        const searchKeyword = ref(""); // 검색어를 위한 반응형 변수
        const search01 = ()=>{
            state.data = [];
            api.get("/api/memos", { params: { q: searchKeyword.value } }).then((res) => {
            state.data = res.data;
        })
        }
        api.get("/api/memos").then((res) => {
            state.data = res.data;
        })
        return {state, searchKeyword, add, edit, search01, del};
    },

};
</script>

<style scroped>

.memo ul {
    border-top:1px solid #eee;
    list-style:none;
    padding:15px 0;
    margin:0;

   
}

.memo li {
    padding:15px;
    margin:5px;
    border:1px solid #eee;
    
}

.act {
    padding :10px 5px 5px 5px;
    text-align: right;
}

.author {
    float: right; /* 우측 정렬을 위해 float 사용 */
    font-size: 12px; /* 작성자 정보의 글자 크기 조정 */
    color: #888; /* 작성자 정보 글자 색상 설정 */
    margin-top: 5px; /* 작성자 정보와 컨텐츠 사이 간격 조정 */
}

/* 화면 크기가 768px 이하인 경우 버튼들을 세로로 정렬 */
@media (max-width: 768px) {
  .act {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  /* 버튼들을 각각 한 줄씩 표시 */
  .act button {
    display: block;
  }
}

/* 화면 크기가 769px 이상인 경우 버튼들을 가로로 정렬 */
@media (min-width: 769px) {
  .act {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}

</style>