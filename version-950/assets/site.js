(function(){
var b=document.querySelector('[data-menu-button]'),m=document.querySelector('[data-mobile-nav]');
if(b&&m){b.addEventListener('click',function(){m.classList.toggle('open')})}
var slides=[].slice.call(document.querySelectorAll('[data-hero-slide]'));
var dots=[].slice.call(document.querySelectorAll('[data-hero-dot]'));
if(slides.length>1){var i=0;var show=function(n){slides[i].classList.remove('active');if(dots[i])dots[i].classList.remove('active');i=n;slides[i].classList.add('active');if(dots[i])dots[i].classList.add('active')};dots.forEach(function(d,n){d.addEventListener('click',function(){show(n)})});setInterval(function(){show((i+1)%slides.length)},5200)}
var panel=document.querySelector('[data-filter-panel]');
if(panel){var input=panel.querySelector('[data-filter-input]'),type=panel.querySelector('[data-filter-type]'),region=panel.querySelector('[data-filter-region]'),year=panel.querySelector('[data-filter-year]'),cards=[].slice.call(document.querySelectorAll('.movie-card')),empty=document.querySelector('[data-empty-tip]');var run=function(){var q=(input&&input.value||'').trim().toLowerCase(),tv=type&&type.value||'',rv=region&&region.value||'',yv=year&&year.value||'',shown=0;cards.forEach(function(c){var text=((c.dataset.title||'')+' '+(c.dataset.genre||'')+' '+(c.dataset.keywords||'')+' '+(c.dataset.region||'')+' '+(c.dataset.type||'')+' '+(c.dataset.year||'')).toLowerCase();var ok=(!q||text.indexOf(q)>-1)&&(!tv||(c.dataset.type||'').indexOf(tv)>-1)&&(!rv||(c.dataset.region||'').indexOf(rv)>-1)&&(!yv||(c.dataset.year||'').indexOf(yv)>-1);c.style.display=ok?'':'none';if(ok)shown++});if(empty)empty.hidden=shown!==0};[input,type,region,year].forEach(function(el){if(el)el.addEventListener(el.tagName==='INPUT'?'input':'change',run)})}
})();
function initPlayer(src){
var video=document.getElementById('movie-video');
var overlay=document.querySelector('[data-play-overlay]');
if(!video||!src)return;
var loaded=false;
function attach(){
if(loaded)return;
loaded=true;
if(video.canPlayType('application/vnd.apple.mpegurl')){video.src=src}else if(window.Hls&&window.Hls.isSupported()){var hls=new window.Hls({maxBufferLength:30});hls.loadSource(src);hls.attachMedia(video)}else{video.src=src}
}
function start(){attach();if(overlay)overlay.hidden=true;var p=video.play();if(p&&p.catch)p.catch(function(){})}
if(overlay)overlay.addEventListener('click',start);
video.addEventListener('click',function(){if(!loaded)start()});
}
