// 딥링크 핸들러 설정
// 백그라운드 딥 링크 핸들러 등록
function handleopenurl(url){
  alert('handleopenurl');
  alert(url);
};

universalLinks.subscribe('handleopenurl', (eventData) => {
  // 딥 링크 URL에서 필요한 데이터 추출
  alert('handleopenurl 호출');
  const code = eventData.url.split('=')[1];
  
  // 추출한 데이터를 사용하여 작업 수행
  console.log('Received code from background deep link: ' + code);
});


function handleOpenURL(url) {
  // 딥링크 URL에서 code 값을 추출합니다.
  alert('handleOpenURL 호출');
  const urlParams = new URLSearchParams(url.split('?')[1]);
  const code = urlParams.get('code');

  if (code) {
    // 추출한 code 값을 사용하여 후처리 로직을 수행합니다.
    // 예: code 값을 서버로 전송하거나, 로컬 저장소에 저장 등
    console.log('Received code from deep link:', code);

    // 이후 로직을 수행하거나 화면을 업데이트할 수 있습니다.
  }
}