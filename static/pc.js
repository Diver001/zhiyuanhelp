;(function (){
  var u = navigator.userAgent,
    w = window.innerWidth;
  if (!u.match(/AppleWebKit.*Mobile.*/)) {
    var sw = w*576/1920;
    window.innerWidth = sw<375?375:sw;
    window.onload = function() {
      window.innerWidth = w;
    }
  }
})();
