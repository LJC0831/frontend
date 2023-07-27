<template>
    <div class="memo">
        <div class = "act">
            <input type="text" v-model="searchKeyword" @keyup.enter="search01()" placeholder="검색어를 입력하세요."/>
            <button class="btn btn-primary" @click="search01()">조회 </button>
            <button class="btn btn-success" @click="add()">+ 추가</button>
            <button class="btn btn-danger" @click="del()" v-if="showDelete">- 삭제</button>
        </div>      
        <label class="check-all">
                <input type="checkbox" v-model="selectAll" @change="handleSelectAll" />
                전체 선택
            </label>
        <ul>
            <li v-for="d in state.data" :key="d.id" @click="openEditModal(d.id)">
                <div class="subject-wrapper">
                    <input type="checkbox" v-model="d.checked" @click.stop />
                    <span class="memo-subject fw-bold">{{ d.subject }}</span>
                </div>
                    <span class="author">작성자 : {{ d.user_id }}  {{ d.formatted_date }}</span>
                
            </li>
        </ul>
         <!-- 모달 창 -->
        <div v-if="showAddModal" class="modal">
            <div class="modal-content">
            <h3>글 작성하기</h3>
            <div class="form-group">
                <label for="newSubject">제목:</label>
                <input v-model="newSubject" id="newSubject" placeholder="제목을 입력하세요." />
            </div>
            <!-- <div class="form-group">
                <label for="fileUpload">파일 업로드 :</label>&nbsp;
                <input type="file" @change="handleFileUpload" id="fileUpload" ref="fileUploadRef"/>
            </div> -->
            <div class="form-group">
                <label for="newContent">내용:</label>
                <textarea v-model="newContent" id="newContent" rows="5" placeholder="내용을 입력하세요."></textarea>
            </div>
            <div class="modal-buttons">
                <button @click="addMemo" :disabled="isNewMemoNotValid">작성하기</button>
                <button @click="cancelAdd">취소</button>
            </div>
            </div>
        </div>
        <div v-if="showModal" class="modal">
            <div class="modal-content">
            <h3>글 수정하기</h3>
            <div class="form-group">
                <label for="editedSubject">제목 :</label>
                <input v-model="editedSubject" id="editedSubject" placeholder="제목을 입력하세요."/>
            </div>
            <div class="form-group">
                <label for="editedContent">내용 :</label>
                <textarea v-model="editedContent" id="editedContent" rows="5" placeholder="내용을 입력하세요."></textarea>
            </div>
            <div class="modal-buttons">
                <button @click="deleteMemo(editingMemoId)" :disabled="isNotEditable">삭제하기</button>
                <button @click="editMemo(editingMemoId)" :disabled="isNotEditable">수정하기</button>
                <button @click="cancel">취소</button>
            </div>
        </div>
      </div>
      <!-- 모달 창 END -->
    </div>
</template> 

<script setup>
/* eslint-disable */
import { reactive, ref, watch } from 'vue';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
const file_no = ref('');
const selectAll = ref(false); // 전체 선택 체크박스 상태를 제어하는 변수
const showDelete = ref(false); // 삭제 버튼 가시성을 제어하는 변수
const showAddModal = ref(false); // 추가 팝업 표시 여부
const newSubject = ref(''); // 새 메모 제목
const newContent = ref(''); // 새 메모 내용
const isNotEditable = ref(false); // 수정 버튼 비활성화 여부를 제어하는 변수
const showModal = ref(false);
const editedSubject = ref(''); // Added for the subject input field
const editedContent = ref('');
const editingMemoId = ref(null); // 수정, 삭제 중인 메모의 id 저장
const fileUploadRef = ref(null); // 파일 업로드 요소를 위한 ref

const handleSelectAll = () => {
        // 전체 선택 체크박스가 클릭되었을 때 모든 메모 항목의 체크 상태를 변경
        state.data.forEach((d) => (d.checked = selectAll.value));
        };

const api = axios.create({
    baseURL: "https://port-0-backend-nodejs-20zynm2mlk2nnlwj.sel4.cloudtype.app",
});

const state = reactive({
    data : [],
    uploadedFile: null, // 업로드된 파일 데이터를 저장하기 위한 변수
});

// 공통
const doValid = ()=>{
            // 로컬 스토리지에서 JWT 토큰 가져오기
            const token = localStorage.getItem('token');
            if (token == null){
                alert('로그인해주세요.');
                location.reload();
                return;
            }
            return true;
        }
//추가
const add = ()=>{
            // 추가 팝업 표시
            if(!doValid()) return;//validate 체크
            showAddModal.value = true;
        }
const addMemo = () => {
    // 유효성 검사: 제목과 내용이 모두 비어있으면 추가하지 않음
    if(!doValid()) return;//validate 체크
    if (!newSubject.value.trim() || !newContent.value.trim()) {
        alert('제목과 내용을 모두 입력하세요.');
        return;
    }
    // 새 메모 추가 API 호출
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const username = decodedToken.username;
    api
        .post('/api/memos', { subject: newSubject.value, file_no: file_no.value, content: newContent.value, username })
        .then((res) => {
        state.data = res.data;
        // 추가 팝업 닫기
        showAddModal.value = false;
        // 입력 필드 초기화
        newSubject.value = '';
        newContent.value = '';
        alert('저장되었습니다.');
        });
};

const cancelAdd = () => {
            // 추가 팝업 닫기
            showAddModal.value = false;
            // 입력 필드 초기화
            newSubject.value = '';
            newContent.value = '';
        };
//삭제처리
const del = ()=>{
            const checkedIds = state.data.filter((d) => d.checked).map((d) => d.id);

            if (checkedIds.length === 0) {
                alert("삭제할 항목을 선택해주세요.");
                return;
            } else {
                // 추가 팝업 표시
                if(!doValid()) return;//validate 체크
                const token = localStorage.getItem('token');
                const decodedToken = jwtDecode(token);
                const username = decodedToken.username;
                if (username != "root") {
                    alert('전체 삭제는 관리자만 삭제 가능합니다');
                    return; // 토큰이 없을 경우 처리
                }
                api.get("/api/userInfo", { headers: { Authorization: `Bearer ${token}` } })
                api.delete(`/api/memos/${checkedIds.join(',')}`).then((res) => {
                        state.data = res.data;
                    });
                alert('삭제처리 되었습니다.');
                state.data.forEach((d) => (d.checked = false)); // 체크항목 초기화
                
                
            }  
        };
// 수정
const openEditModal = (id) => {
            const memo = state.data.find(d => d.id === id);
            
            // 로컬 스토리지에서 JWT 토큰 가져오기
            if(!doValid()) return;//validate 체크

            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userIdFromToken = decodedToken.username; // 사용자 아이디 추출
            if (memo.user_id !== userIdFromToken) {
                isNotEditable.value = true;
            } else {
                isNotEditable.value = false;
            }
            editedSubject.value = memo.subject; // Set the subject value
            editedContent.value = memo.content;
            editingMemoId.value = id; // 수정 중인 메모의 id 설정
            
            if (memo.file_id) {
                // 파일 번호가 존재하면 서버로부터 파일 데이터를 가져옵니다.
                api.get(`/api/file/${memo.file_id}`).then((response) => {
                state.uploadedFile = response.data.file_addr; // 파일 데이터를 state.uploadedFile에 저장합니다.
                });
            } else {
                state.uploadedFile = null; // 파일이 없으면 null로 초기화합니다.
            }  
            showModal.value = true;
        };
// 수정 확인 버튼을 클릭할 때 호출되는 함수
const editMemo = () => {
            const id = editingMemoId.value; // 수정 중인 메모의 id 가져오기
            const subject = editedSubject.value;
            const content = editedContent.value;
            api.put("/api/memos/" + id, { subject, content }).then((res) => {
                state.data = res.data;
                alert('수정 되었습니다.');
                showModal.value = false;
            });
        };
// 삭제
const deleteMemo = () => {
            if(!doValid()) return;//validate 체크
            const id = editingMemoId.value; // 수정 중인 메모의 id 가져오기
            api.delete("/api/memos/" + id).then((res) => {
                state.data = res.data;
                alert('삭제처리 되었습니다.');
                showModal.value = false;
            });
        };
const cancel = () => {
    showModal.value = false;
};
// 조회
const searchKeyword = ref(""); // 검색어를 위한 반응형 변수
        const search01 = ()=>{
            state.data = [];
            api.get("/api/memos", { params: { q: searchKeyword.value } }).then((res) => {
            state.data = res.data;
        })
        }
// 조회default
api.get("/api/memos").then((res) => {
    state.data = res.data;
})
// 파일업로드      
const handleFileUpload = () => {
            const file = fileUploadRef.value.files[0]; // 선택된 파일 가져오기

            // 선택된 파일을 FormData 객체에 추가
            const formData = new FormData();
            formData.append("file", file);
            formData.append("fileName", encodeURIComponent(file.name)); // 파일명을 인코딩하여 formData에 추가
            // 파일 업로드 요청
            api.post('/api/upload', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // 토큰을 요청 헤더에 추가
                },
                params: {
                    memoId: editingMemoId.value, // 현재 수정 중인 메모의 ID를 서버에 전달
                },
            }).then((response) => {
                    file_no.value = response.data.fileId;
                    alert('업로드 하였습니다.');
                // 파일 업로드 성공 시 처리할 로직을 여기에 작성합니다.
                // 예: 성공 메시지 출력, 업로드 결과를 다른 동작에 활용 등
                })
                .catch((error) => {
                    alert('업로드 실패입니다.');
                // 파일 업로드 실패 시 처리할 로직을 여기에 작성합니다.
                // 예: 오류 메시지 출력 등
                });
        };
// 삭제버튼 활성화
watch(() => state.data.map((d) => d.checked),(checkedList) => {
            showDelete.value = checkedList.some((checked) => checked);
        });   

</script>

<style scroped>
.memo {
    flex: 1;
    padding: 20px;
    min-width:768px;
    max-height: 760px;
    overflow-y: auto; /* 스크롤이 생기도록 설정 */
}
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
    color: #6c757d; /* 작성자 정보 글자 색상 설정 */
    margin-top: 5px; /* 작성자 정보와 컨텐츠 사이 간격 조정 */
    white-space: nowrap;
}

.check-all {
  margin-right: auto; /* 전체 선택 체크박스를 가장 왼쪽으로 이동 */
}

/* 화면 크기가 768px 이하인 경우 버튼들을 세로로 정렬 */
@media (max-width: 768px) {
  .act {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 400px;
  }
  /* 버튼들을 각각 한 줄씩 표시 */
  .act button {
    display: block;
  }
  .author {
    font-size: 10px; /* 작성자 정보 글자 크기 조정 */
  }

  .form-group {
  margin-bottom: 10px; /* Reduce the margin to save space */
  }
  #editedContent,
  #newContent {
    width: 100%;
    resize: vertical; /* Allow vertical resizing of the textarea */
  }
  #editedSubject,
    #newSubject {
    width: 100%;
    }
  .memo-subject {
  font-size: 12px; /* 제목 글자 크기 조정 */
  font-weight: bold;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
  background-color: ivory;
  transition: background-color 0.3s ease;
}
.memo li {
margin: 5px 0;
width:450px;
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

/* 모달 스타일 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  max-width: 800px; /* 최대 너비 설정 */
  width: 100%; /* 너비 100% 설정 */
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.modal-buttons button {
  margin-left: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.modal h3 {
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
}

.modal-buttons button:hover {
  background-color: #f5f5f5;
}

/* Adjust the form-group style */
.form-group {
  margin-bottom: 15px;
}

/* Make the content textarea wider */
#editedContent, #newContent {
  width: 100%;
}

#editedSubject, #newSubject {
    width: 100%;
}

.memo-subject {
  padding: 10px;
  font-weight: bold;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
  background-color: ivory;
  transition: background-color 0.3s ease;
}

.subject-wrapper {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 1000px; /* 최대 너비 설정 */
}

.memo-subject:hover {
  background-color: #f8f9fa; /* Light gray on hover */
}

</style>