window.onload=function(){
    if(document.getElementsByClassName("main").length!=0){
        document.getElementsByClassName("main")[0].style.backgroundPositionX=String(Math.random()*100)+"%";
        document.getElementsByClassName("main")[0].style.backgroundPositionY=String(Math.random()*100)+"%";
        document.getElementsByClassName("main")[0].style.backgroundSize=String(150+Math.random()*150)+"%";

        let r=Math.round(4*Math.random());
        switch(r){
            case 0: case 1:
                document.getElementById("forms").style.backgroundImage="url('images/elements_1a.png')";
                break;
            case 2:
                document.getElementById("forms").style.backgroundImage="url('images/elements_1b.png')";
                break;
            case 3:
                document.getElementById("forms").style.backgroundImage="url('images/elements_1c.png')";
                break;
            case 4:
                document.getElementById("forms").style.backgroundImage="url('images/elements_1d.png')";
                break;
        }
        

        let bands=document.getElementsByClassName("bandImg");
        let bandnames=document.getElementsByClassName("bandname");
        for(let i=0;i<bands.length;i++){
            let top=Math.random()*55;
            let left=Math.random()*70;
            let width=10+Math.random()*15;
            bands[i].style.top=String(top)+"vh";
            bands[i].style.left=String(left)+"vw";
            bands[i].style.width=String(width)+"vw";
            bandnames[i].style.top=String(top)+"vh"
            bandnames[i].style.left=String(left)+"vw"
        }
    }
};

function toggleNav(){
    if(document.getElementById('navExp').style.display=='inline'){
        document.getElementById('navExp').style.display='none';
    } else {
        document.getElementById('navExp').style.display='inline';
    }
}
