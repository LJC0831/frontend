/* eslint-disable */
import loginMethods from '@/scripts/login.js';

export default {
  // Handles Kakao callback and retrieves the authorization code
  handleKakaoCallback(callback) {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      callback(code);
    }
  },

  // Fetches Kakao access token using the authorization code
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
          localStorage.setItem('kakao_code', tokenData.access_token);
          this.checkKakaoScopes(tokenData.access_token, getUserInfoCallback, loadingState);
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

  // Checks if required scopes are granted, requests additional consent if necessary
  checkKakaoScopes(accessToken, getUserInfoCallback, loadingState) {
    fetch('https://kapi.kakao.com/v2/user/scopes', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => response.json())
      .then(scopeData => {
        const requiredScope = 'talk_message';
        const hasScope = scopeData.scopes.some(scope => scope.id === requiredScope && scope.agreed);

        if (!hasScope) {
          this.requestKakaoScopes(() => {
            getUserInfoCallback(accessToken); // Call after granting consent
          });
        } else {
          getUserInfoCallback(accessToken); // Proceed if already granted
        }
      })
      .catch(error => {
        alert('사용자 권한을 확인하는데 실패했습니다.', error);
        loadingState.value = false;
      });
  },

  // Requests additional consent for missing scopes
  requestKakaoScopes(callback) {
    window.Kakao.Auth.authorize({
      redirectUri: process.env.VUE_APP_KAKAO_REDIRECT_URL,
      scope: 'talk_message', // Additional scope needed
      success: response => {
        console.log('추가 권한 동의 완료:', response);
        callback();
      },
      fail: error => {
        console.error('추가 권한 동의 실패:', error);
        alert('권한 동의에 실패했습니다. 다시 시도해주세요.');
      }
    });
  },

  // Fetches user information from Kakao API
  getKakaoUserInfo(accessToken, setToken, loadingState) {
    fetch('https://kapi.kakao.com/v2/user/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .then(userData => {
        const kakaoUserId = userData.properties.nickname + userData.id;
        const kakaoUserNM = userData.properties.nickname;
        const kakaoPicture = userData.properties.profile_image;
        const pwd = userData.id;
        const OAuthYn = 'Y';

        loginMethods.methods.Oauthlogin(kakaoUserId, kakaoUserNM, pwd, kakaoPicture, OAuthYn,
          res => {
            if (res.status === 200) {
              alert('로그인 성공');
              setToken(res.data.token);
              loadingState.value = false;
              const url = window.location.href;
              const baseUrl = url.split('/').slice(0, 3).join('/');
              window.location.href = baseUrl;
            }
          },
          error => {
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

  // Compares email verification numbers
  emailNumCheck(checkNumber, checkNumberInput) {
    if (checkNumber === checkNumberInput) {
      alert('인증되었습니다.');
      return true;
    } else {
      alert('인증번호가 일치하지 않습니다.');
      return false;
    }
  }
};