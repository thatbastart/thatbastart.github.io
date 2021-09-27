let counter=0;
let amt=0;
let h=[0,0]
window.onload = function() {
    for (let i=0; i<data.length;i++){
        document.getElementById("stadt_container").innerHTML=document.getElementById("stadt_container").innerHTML + "<div id=\"" + "stadt_" + i + "\"style=\"background-image: url(\'"+ data[i].thumb + "\');\" onClick=\"changeCity(" + i +",1)\"><span class=\"stadt_container_nmb\">" + data[i].nmb + "</span><br><span class=\"stadt_container_ort\">" + data[i].ort + "</span></div>"
        amt=i;
    }
    changeCity(0,0);
}

function changeCity(id,s){
    h.unshift(id);
    counter=0;
    document.getElementById("stadt_" + h[1]).style.boxShadow="inset 0px 0px 0px 0px #F5FF02";
    document.getElementById("stadt_" + h[1]).style.backgroundSize="130%";
    document.getElementById("stadt_" + h[1]).style.filter="saturate(60%)";
    document.getElementById("stadt_" + h[1]).style.color="#FFF";

    document.getElementById("stadt_" + id).style.boxShadow="inset 0px 0px 0px 8px #F5FF02";
    document.getElementById("stadt_" + id).style.backgroundSize="140%";
    document.getElementById("stadt_" + id).style.filter="saturate(125%)";
    document.getElementById("stadt_" + id).style.color="#F5FF02";

    document.getElementById("stadt_img").style.backgroundImage = "url('" + data[id].overview +"')";
    document.getElementById("stadt_img").onclick = function clickEvent(e) {
        let rect = document.getElementById("stadt_img").getBoundingClientRect();
        let x = e.clientX - rect.left;
        if (x<rect.width/2){
            stadtImg(-1,id);
        } else {
            stadtImg(1,id);
        }
      }
    document.getElementById("stadt_audio").src=data[id].audio;
    document.getElementById("stadt_titel").innerHTML=data[id].ort + " " + data[id].nmb;
    let spz=data[id].spz.split(", ");
    document.getElementById("stadt_spz_pics").innerHTML="";
    for (let i=0; i<spz.length;i++){
        document.getElementById("stadt_spz_pics").innerHTML=document.getElementById("stadt_spz_pics").innerHTML+ "<div><img id=\"spz_pics_" + i + "\" src=\"alleindiestadt/spz/" + spz[i] + ".png\" class=\"spz_img\" onClick=\"stadtImg2(" + i + "," + id + ")\"></img><span id=\"stadt_spz_" + i + "\" class=\"textcaps\" style=\"cursor: pointer;\" onClick=\"stadtImg2(" + i + "," + id + ")\">" + spz[i] + "</span></div>"
    }
    if(s==1){
        window.scrollBy({top: document.getElementById("stadt_titel").getBoundingClientRect().top, left: 0, behavior: 'smooth'});
    }
}


function stadtImg(c, id){
    counter=counter+c;
    let img=data[id].img.split(", ");
    img.unshift(data[id].overview);
    if (counter>=img.length){
        counter=0;
    } 
    if (counter<0){
        counter=img.length-1;
    }
    document.getElementById("stadt_img").style.backgroundImage = "url('" + img[counter] +"')";
    setActiveSpz(counter-1, id)
}

function stadtImg2(c, id){
    let img=data[id].img.split(", ");
    img.unshift(data[id].overview);
    counter=c+1;
    document.getElementById("stadt_img").style.backgroundImage = "url('" + img[c+1] +"')";
    setActiveSpz(c, id)
}

function setActiveSpz(c, id){
    let spz=data[id].spz.split(", ");
    if(c==-1){
        for(let i=0; i<spz.length;i++){
            document.getElementById("spz_pics_" + i).style.filter="saturate(100%)";
            document.getElementById("stadt_spz_" + i).style.borderBottom="0px";
        }
    } else {
        for(let i=0; i<spz.length;i++){
            document.getElementById("spz_pics_" + i).style.filter="saturate(0%)";
            document.getElementById("stadt_spz_" + i).style.borderBottom="0px";
        }
        document.getElementById("spz_pics_" + c).style.filter="saturate(100%)";
        document.getElementById("stadt_spz_" + c).style.borderBottom="6px solid #F5FF02";
    }
}