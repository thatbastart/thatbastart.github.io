  window.addEventListener("load", function(event) {

    
    let hdln=document.querySelectorAll("h2[class]:is([class=''])");
    for (let i=0;i<hdln.length;i++){
      hdln[i].style.textAlign="center";
    }

    document.getElementsByClassName("project__headline")[0].innerHTML="Ich hab' zu Hause alle Wände erst <span style='color:black; background:black'>Schwarz</span>, dann <span style='background: green; color: green;''>Grün</span> angestrichen. - <a href='https://www.youtube.com/watch?v=Bybm2nh02X4'>Du nich</a>";

    [...document.styleSheets[0].cssRules].find(x=> x.selectorText==".c-images__letterbox").style.backgroundColor= "red";

    let img=document.getElementsByClassName("c-images__letterbox");
    for(let i=0; i<img.length; i++){
      img[i].style.background="transparent";
    }

    let thmb=document.getElementsByClassName("c-images__thumbnails");
    for(let i=0; i<thmb.length; i++){
      thmb[i].style.justifyContent="center";
    }

    let hr=document.getElementsByTagName("hr");
    for(let i=0; i<hr.length; i++){
      hr[i].style.marginTop="100px";
    }

    img[0].style.padding="5% 10% 5% 10%";
    img[1].style.padding="5% 10% 5% 10%";
    img[2].style.padding="5% 10% 5% 10%";
    img[3].style.padding="5% 10% 5% 10%";
    img[4].style.padding="5% 0% 5% 0%";
    img[5].style.padding="5% 20% 10% 20%";
    img[6].style.padding="5% 10% 5% 10%";
    img[7].style.padding="5% 35% 5% 35%";
    img[8].style.padding="5% 10% 5% 10%";
    img[9].style.padding="5% 10% 5% 10%";
    img[10].style.padding="5% 0% 0% 0%";

    document.getElementsByClassName("image__copyright")[0].style.display="none";
  });