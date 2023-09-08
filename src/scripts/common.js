/* eslint-disable */
import jwtDecode from 'jwt-decode';
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