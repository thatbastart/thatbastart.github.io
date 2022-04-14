let hover=-1;
let hovered=0;
function setup() {
    noiseDetail(1, 0.2);
    frameRate(30);
}

function draw() {
    hovered=0;
    for(let i=0;i<bands.length;i++){
        if(bands[i].attributes.hover.value=="0"){
            let x=map(noise(anim[i][0]),0,0.6,0,window.innerWidth);
            let y=map(noise(anim[i][1]),0,0.6,0,window.innerHeight);

            bands[i].style.top=y+"px";
            bands[i].style.left=x+"px";
            anim[i][0] += (0.003+anim[i][3]+Math.random()/200)*anim[i][2];
            anim[i][1] += (0.003+anim[i][3]+Math.random()/200)*anim[i][2];
            if(anim[i][3]>0){
                anim[i][3]-=0.0002;
            }
        } else {
            anim[i][3]=0.05;
            hovered=1;
            if(hover!=i){
                if(anim[i][2]==1){
                    anim[i][2]=-1;
                } else {
                    anim[i][2]=1;
                }
            }
            hover=i;
            
        }
    }
    if(hovered==0){
        hover=-1;
    }
}