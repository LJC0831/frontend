<template>
    <div class="memo">
        <ul>
            <li v-for="(d, idx) in data" :key="idx">{{ d }}</li>
        </ul>

    </div>
</template>

<script>
export default {
    setup() {
        const data = [
            "메모 1 내용",
            "메모 2 내용",
            "메모 3 내용",
            "메모 4 내용"
        ]

        return {data};
    },
}
</script>pt

<style scroped>

.memo ul {
    list-style:none;
    padding:15px 0;
    margin:0;

   
}

.memo li {
    padding:5px 10px;
    margin:5;
}


</style>