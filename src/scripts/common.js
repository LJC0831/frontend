/* eslint-disable */
import jwtDecode from 'jwt-decode';
//export const baseURL = "https://port-0-backend-nodejs-20zynm2mlk2nnlwj.sel4.cloudtype.app";
export const baseURL = "https://backendserver.shop:3000";

// 로그인체크
export function loginCheck() {
    const token = localStorage.getItem('token');
    if(token === null){
        alert('로그인 세션이 종료되었습니다. 재로그인해주세요.');
        return false;
    } else {
        return true;
    }
}

export function getToken() {
    const token = localStorage.getItem('token');
    if(token === null){
        alert('로그인 세션이 종료되었습니다. 재로그인해주세요.');
        return false;
    }
    const decodedToken = jwtDecode(token);
    return decodedToken.username;
}

// 데이터 체크
export function nullCheck(data) {
    if(data === null){
        return false;
    } else {
        return true;
    }
}

// toast 메세지 처리
export function showToast(vm, data) {
    vm.$toast.open({
        message: data,
        duration: 2000, // 토스트 메시지가 보여지는 시간 (2초)
        position: 'top', // 토스트 메시지 위치
        type: 'info', // 토스트 메시지 타입 (info, success, error)
        style: {
          background: '#888', // 회색 배경 색상
          'font-size': '14px', // 작은 글꼴 크기
          color: '#fff', // 흰색 글자 색상
        },
      });
}