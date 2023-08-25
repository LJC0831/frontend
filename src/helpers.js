import jwtDecode from 'jwt-decode';
// helpers.js 파일 생성
// 토큰 저장 함수
/* eslint-disable */
export function saveTokenToLocalStorage(token) {
    localStorage.setItem('token', token);
  }
  
  // 토큰 삭제 함수
  export function removeTokenFromLocalStorage() {
    localStorage.removeItem('token');
  }
  
  // 토큰 유효기간 확인 함수
  export function checkTokenExpiration() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        debugger;
        const decodedToken = jwtDecode(token);
        const expirationTime = decodedToken.exp * 1000; // 토큰 만료 시간 (밀리초 단위)
        const currentTime = new Date().getTime(); // 현재 시간 (밀리초 단위)
  
        // 토큰 만료 시간이 현재 시간보다 작다면 토큰을 삭제
        if (expirationTime < currentTime) {
          removeTokenFromLocalStorage();
        }
      } catch (error) {
        // 토큰 디코딩에 실패하면 토큰 삭제
        removeTokenFromLocalStorage();
      }
    }
  }