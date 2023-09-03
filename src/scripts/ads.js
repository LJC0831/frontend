export function loadAds() {
    var ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.style.display = 'none';
    ins.setAttribute('data-ad-unit', 'DAN-x1gEiEgKALNYtWGx');
    ins.setAttribute('data-ad-width', '160');
    ins.setAttribute('data-ad-height', '600');
    document.querySelector('.ad-container').appendChild(ins);
  
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
    script.async = true;
    document.querySelector('.ad-container').appendChild(script);
  }

  // 모바일 가로 160x
export function loadAds2() {
    var ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.style.display = 'none';
    ins.setAttribute('data-ad-unit', 'DAN-s6kYvz9MLymu8faC');
    ins.setAttribute('data-ad-width', '320');
    ins.setAttribute('data-ad-height', '100');
    document.querySelector('.ad-container').appendChild(ins);
  
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
    script.async = true;
    document.querySelector('.ad-container').appendChild(script);
  }