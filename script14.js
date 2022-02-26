  window.addEventListener("load", function(event) {

    
    let hdln=document.querySelectorAll("h2[class]:is([class=''])");
    for (let i=0;i<hdln.length;i++){
      hdln[i].style.textAlign="center";
    }

    document.getElementsByClassName("project__headline")[0].innerHTML="Ich hab' zu Hause alle Wände erst <span style='color:#100000; background:#100000'>Schwarz</span>, dann <span style='background: #82bb45; color: #82bb45;'>Grün</span> angestrichen. - <a href='https://www.youtube.com/watch?v=Bybm2nh02X4'>Du nich</a>";

    let thmb=document.getElementsByClassName("c-images__thumbnails");
    for(let i=0; i<thmb.length; i++){
      thmb[i].style.justifyContent="center";
    }

    let hr=document.getElementsByTagName("hr");
    for(let i=0; i<hr.length; i++){
      if(i==0){
        hr[i].style.marginTop="50px";  
      } else {
        hr[i].style.marginTop="100px";
      }
    }

    let txt=document.getElementsByClassName("s-text");
    for(let i=0;i<txt.length;i++){
      if(i==0){
        txt[i].style.textAlign="center";
      } else {
        txt[i].style.textAlign="justify";
      }
      txt[i].style.margin="0% 10% 0% 10%";
    }

    let pgh=document.getElementsByTagName("p");
    for(let i=0; i<pgh.length; i++){
      pgh[i].style.maxWidth="45em";
    }

    let imgC=document.getElementsByClassName("c-images");
    for(let i=0; i<imgC.length; i++){
      imgC[i].style.marginBottom="5%";
    }

    let img=document.getElementsByClassName("c-images__letterbox");
    for(let i=0; i<img.length; i++){
      img[i].style.background="transparent";
    }

    img[0].style.padding="5% 10% 5% 10%";
    img[1].style.padding="5% 10% 5% 10%";
    img[2].style.padding="5% 10% 5% 10%";
    img[3].style.padding="5% 10% 5% 10%";
    img[4].style.padding="5% 10% 5% 10%";
    img[5].style.padding="5% 10% 10% 10%";
    img[6].style.padding="5% 10% 5% 10%";
    img[7].style.padding="5% 35% 5% 35%";
    img[8].style.padding="5% 10% 5% 10%";
    img[9].style.padding="5% 10% 5% 10%";
    img[10].style.padding="5% 0% 0% 0%";

    document.getElementsByClassName("image__copyright")[0].style.display="none";
  });