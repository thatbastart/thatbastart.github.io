function setup() {
    noiseDetail(2, 0.2);
    frameRate(30);
}
function draw() {

    for(let i=0;i<bands.length;i++){
        console.log(bands[i].attributes.hover.value);
        if(bands[i].attributes.hover.value=="0"){
            let x=map(noise(anim[i][0]),0.1,0.7,0,window.innerWidth);
            let y=map(noise(anim[i][1]),0.1,0.7,0,window.innerHeight);

            bands[i].style.top=y+"px";
            bands[i].style.left=x+"px";

            anim[i][0] += 0.005+Math.random()/200;
            anim[i][1] += 0.005+Math.random()/200;
        }
    }
}