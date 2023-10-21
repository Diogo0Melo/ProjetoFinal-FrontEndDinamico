const h = document.getElementById('hora')
const m = document.querySelector('#minute')
const s = document.getElementById('second')

const reloguinho = setInterval(function timer(){
    const k = new Date();
    const hr = k.getHours()
    const min = k.getMinutes()
    const sec = k.getSeconds()

    if(hr < 10){
        h.innerHTML=`0${hr}`}
        else{h.textContent= hr } 
    if(min < 10){
        m.innerHTML=`0${min}`}
        else{m.textContent= min } 
    if(sec < 10){
        s.innerHTML=`0${sec}`}
        else{s.textContent= sec } 
})