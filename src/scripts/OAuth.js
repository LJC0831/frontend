/* eslint-disable */
import loginMethods from '@/scripts/login.js';

export default {
  handleKakaoCallback(callback) {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      callback(code);
    }
  },
  getKakaoToken(code, getUserInfoCallback, loadingState) {
    loadingState.value = true;
    const data = {
      grant_type: 'authorization_code',
      client_id: process.env.VUE_APP_KAKAO_CLIENT_ID,
      redirect_uri: process.env.VUE_APP_KAKAO_REDIRECT_URL,
      code: code
    };

    fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(data)
    })
      .then(response => response.json())
      .then(tokenData => {
        if (tokenData.access_token) {
          getUserInfoCallback(tokenData.access_token);
        } else {
          alert('카카오 로그인 실패: 토큰을 받아올 수 없습니다.');
          loadingState.value = false;
        }
      })
      .catch(error => {
        alert('카카오 로그인 실패: ', error);
        loadingState.value = false;
      });
  },
  getKakaoUserInfo(accessToken, setToken, loadingState) {
    fetch('https://kapi.kakao.com/v2/user/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .then(userData => {
        const kakaoUserId = userData.properties.nickname + userData.id;
        const kakaoUserNM = userData.properties.nickname;
        const kakaoPicture = userData.properties.profile_image;
        const pwd = userData.id;
        const OAuthYn = 'Y';

        loginMethods.methods.login_oauth(kakaoUserId, kakaoUserNM, pwd, kakaoPicture, OAuthYn,
          (res) => {
            if (res.status === 200) {
              alert('로그인 성공');
              setToken(res.data.token);
              localStorage.setItem("token_picture", kakaoPicture);
              loadingState.value = false;
              const url = window.location.href;
              const baseUrl = url.split('/').slice(0, 3).join('/');
              window.location.href = baseUrl;
            }
          },
          (error) => {
            alert('회원가입에 실패했습니다.', error);
            loadingState.value = false;
          }
        );
      })
      .catch(error => {
        alert('카카오 사용자 정보를 가져오는데 실패했습니다: ', error);
        loadingState.value = false;
      });
  },
  //메일인증비교
  emailNumCheck(checkNumber, checkNumberInput){
    if(checkNumber === checkNumberInput){
      alert('인증되었습니다.');
      return true;
    } else {
      alert('인증번호가 일치하지 않습니다.');
      return false;
    }
  },

};