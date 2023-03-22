<template>
    <div class="memo">
        <div class = "act">
            <button class="btn btn-primary" @click="add()">+ 추가</button>
        </div>
        <ul>
            <li v-for="(d, idx) in state.data" :key="idx" @click="edit(idx)">{{ d }}</li>
        </ul>

    </div>
</template>

<script>
import {reactive} from "vue";
import axios from "axios";
export default {
    
    setup() {
        const state = reactive({
            data : [],
        });

        const add = ()=>{
            const content = prompt("내용을 입력해주세요.");
            //state.data.push("추가된 메모 내용");
            axios.post("/api/memos", {content}).then((res)=>{
                state.data = res.data;
            })
        }

        const edit = (idx)=>{
            const content = prompt("내용을 입력해주세요",state.data[idx]);
            axios.put("/api/memos/" + idx, {content}).then((res)=>{
                state.data = res.data;
            })
        }
        axios.get("/api/memos").then((res) => {
            state.data = res.data;
        })
        return {state, add, edit};
    },
}
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


</style>