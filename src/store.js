// store.js 파일 수정
/* eslint-disable */
import { createStore } from 'vuex';
import jwtDecode from 'jwt-decode'; // jwt 디코딩 라이브러리
import { saveTokenToLocalStorage, removeTokenFromLocalStorage, checkTokenExpiration } from './helpers';

const store = createStore({
  state: {
    token: null
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      saveTokenToLocalStorage(token); // 토큰 저장
    },
    clearToken(state) {
      state.token = null;
      removeTokenFromLocalStorage(); // 토큰 삭제
    }
  },
  actions: {
    setToken({ commit }, token) {
      commit('setToken', token);
    },
    clearToken({ commit }) {
      commit('clearToken');
    }
  },
  getters: {
    getToken: state => state.token
  }
});

// 토큰 유효기간 확인 타이머 설정
setInterval(() => {
  checkTokenExpiration();
}, 3600000); // 60분마다 실행 (1000밀리초 * 60초 = 1분)

export default store;