window.onload=function(){
    document.getElementsByClassName("main")[0].style.backgroundPositionX=String(Math.random()*100)+"%";
    document.getElementsByClassName("main")[0].style.backgroundPositionY=String(Math.random()*100)+"%";
    document.getElementsByClassName("main")[0].style.backgroundSize=String(150+Math.random()*150)+"%";

    document.getElementsByClassName("oval")[0].style.top=String(Math.random()*55)+"vh";
    document.getElementsByClassName("oval")[0].style.left=String(Math.random()*70)+"vw";

    document.getElementsByClassName("stone")[0].style.top=String(Math.random()*60)+"vh";
    document.getElementsByClassName("stone")[0].style.left=String(Math.random()*70)+"vw";

    document.getElementsByClassName("dots")[0].style.top=String(Math.random()*55)+"vh";
    document.getElementsByClassName("dots")[0].style.left=String(Math.random()*70)+"vw";

    document.getElementsByClassName("paint_green")[0].style.top=String(Math.random()*65)+"vh";
    document.getElementsByClassName("paint_green")[0].style.left=String(Math.random()*75)+"vw";
};