// rl - relation
// hv - hannah+victor
// lp - lukas+peter
// sb - sabrina
// sr - sara
// vj - vivien+jenny

let people=["rl", "hv", "lp", "sb", "sr", "vj"];
let sph_list=[];

// function referrers to window scope
window.setAnim=setAnim;

// import three and modules
import * as THREE from "./three/build/three.module.js";
import { OrbitControls } from "./three/examples/jsm/controls/OrbitControls.js";
import { PCDLoader } from "./three/examples/jsm/loaders/PCDLoader.js";
import { GLTFLoader } from "./three/examples/jsm/loaders/GLTFLoader.js";
import { CSS2DRenderer, CSS2DObject } from './three/examples/jsm/renderers/CSS2DRenderer.js';
import * as BufferGeometryUtils from "./three/examples/jsm/utils/BufferGeometryUtils.js";

// three stuff
let camera, scene, renderer, labelRenderer, controls, font;
const raycaster = new THREE.Raycaster(); // finding out over which 3d-object the cursor is
const mouse = new THREE.Vector2(); // cursor screen position

// colors
const blue=new THREE.Color(0.0,0.04,1.0); // blue default
const green=new THREE.Color(0.447,1.0,0.051); // green hover
const yellow=new THREE.Color(1.0,0.96,0.0);

// materials
let matBlue = new THREE.MeshBasicMaterial( { color: blue } ); // blue default
let matGreen = new THREE.MeshBasicMaterial( { color: green } ); // green hover

// preloading images
let image_preloader=[];
window.image_preloader=image_preloader;

let loaded=[];

// spheres
let navsph=[];
const about_sphGeo = new THREE.SphereGeometry(2, 32, 32 ); // sphere radius and subdivs
const content_sphGeo = new THREE.SphereGeometry( 0.6, 16, 16 );
let hover=[0,0,0,0,0,0]; // hover over sphere bool 

// animation
let animClick=[[0,-47,12,-72],[0,-3,15,62],[0,48,-7,-2],[0, 4, 3, 4],[0,-75,1,0],[0,65,-27,20],[0,-137,42,-100]]; // animation targets for sphere focus
let animProg=0.0; // lerp factor for coords
let animTime=0.0; // anim timer
let animSrc=[-180,130,-115,0, -5, 0] // animation source with start view coords

// vj
let vj_pointcloud, vj_tree, vj_tree_tex=[], vj_treepoints=[], vj_treepoints_hover=-1;
// lp
let lp_pointcloud, lp_sph=[];
// sb
let sb_pointcloud, sb_sph=[];
// sr
let sr_pointcloud, sr_sph=[];
// hv
let hv_pointcloud, hv_sph=[];
// rl 
let rl_pointcloud_1,rl_pointcloud_2,rl_pointcloud_3, rl_sph=[];

sph_list=[rl_sph, hv_sph, lp_sph, sb_sph, sr_sph];

init(); // create scene

function init() {
    // RENDERER
    renderer = new THREE.WebGLRenderer( { antialias: true, logarithmicDepthBuffer: true} );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0xcacad0); // scene background color

    document.getElementById("main").appendChild( renderer.domElement ); // append renderer to document


    // CAMERA & SCENE
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.01, 4000 );
    camera.position.set( -140,142,-90 ); // starting position
    scene.add( camera );
    camera.rotation.order="YXZ"; //switch order for rotation follow


    // ORBIT CONTROLS
    controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping=true; // damping of user camera movement → less sensitivity
    controls.dampingFactor=0.5;
    controls.target.set(0, 5, 0); // starting navigation target
    controls.update();
    controls.addEventListener( "change", render ); // render when controls change
    


    vj_tree_tex[0] = new THREE.TextureLoader().load("vj/tree.webp");
    vj_tree_tex[1] = new THREE.TextureLoader().load("vj/tree_highlight.webp");


    // ------------- RELATION -------------
    // nav sphere
    navsph[0] = new THREE.Mesh( about_sphGeo, matBlue ); // add sphere objects to array
    scene.add(navsph[0]);
    navsph[0].position.set(-20,8,-40);

    // pointclouds
    const rl_loader_1 = new PCDLoader();
    rl_loader_1.load( "./rl/pointcloud_1.pcd", function (points) { // callback function when pcd is loaded
        points.geometry.center();
        points.material.size=1; // square size
        points.scale.set(14,14,14);
        points.updateMatrix();
        points.geometry.applyMatrix4(points.matrix);
        points.geometry.applyMatrix4(points.matrixWorld);
        points.scale.set(1,1,1);
        rl_pointcloud_1=points;
        rl_pointcloud_1.position.set(-20,8,-40);
        rl_pointcloud_1.rotation.set(THREE.Math.degToRad(-90),0,0);
        scene.add(rl_pointcloud_1);
        loaded.push(1);
        checkLoad();

        for(let i=0; i<rl_content.length; i++){
            rl_sph[i]=new THREE.Mesh( content_sphGeo, matBlue );
            rl_pointcloud_1.add(rl_sph[i]);
            rl_sph[i].position.set(rl_content[i].x,rl_content[i].y,rl_content[i].z);
        }
    } );

    const rl_loader_2 = new PCDLoader();
    rl_loader_2.load( "./rl/pointcloud_2.pcd", function (points) { // callback function when pcd is loaded
        points.geometry.center();
        points.material.size=1.25; // square size
        points.scale.set(4,4,4);
        points.updateMatrix();
        points.geometry.applyMatrix4(points.matrix);
        points.geometry.applyMatrix4(points.matrixWorld);
        points.scale.set(1,1,1);
        rl_pointcloud_2=points;
        rl_pointcloud_2.position.set(-25,-5,65);
        rl_pointcloud_2.rotation.set(THREE.Math.degToRad(-90),THREE.Math.degToRad(-5),0);
        scene.add(rl_pointcloud_2);
        loaded.push(1);
        checkLoad();
    } );

    const rl_loader_3 = new PCDLoader();
    rl_loader_3.load( "./rl/pointcloud_3.pcd", function (points) { // callback function when pcd is loaded
        points.geometry.center();
        points.material.size=1.25; // square size
        points.scale.set(2,2,2);
        points.updateMatrix();
        points.geometry.applyMatrix4(points.matrix);
        points.geometry.applyMatrix4(points.matrixWorld);
        points.scale.set(1,1,1);
        rl_pointcloud_3=points;
        rl_pointcloud_3.position.set(50,0,-10);
        scene.add(rl_pointcloud_3);
        loaded.push(1);
        checkLoad();
    } );




    // ------------- HANNAH + VICTOR -------------

    // nav sphere
    navsph[1] = new THREE.Mesh( about_sphGeo, matBlue ); // add sphere objects to array
    scene.add(navsph[1]);
    navsph[1].position.set(-28,3,40);

    const glloader = new GLTFLoader();
    glloader.load("hv/ayahuasca.glb", function ( gltf ) {
            let vine=gltf.scene.children[0]
            scene.add( vine );
            vine.position.set(-45,-6,40);
            let texture = new THREE.TextureLoader().load("hv/vine.webp");
            texture.wrapS=THREE.RepeatWrapping;
            texture.wrapT=THREE.RepeatWrapping;
            texture.repeat.set(0.5,0.5);
            let vineMaterial = new THREE.MeshBasicMaterial( { map: texture, transparent: true} );
            vine.material=vineMaterial;
            vine.scale.set(0.6,0.6,0.6);
            loaded.push(1);
            checkLoad();
        }
    );

    // pointcloud
    const hv_loader = new PCDLoader();
    hv_loader.load( "./hv/pointcloud.pcd", function (points) { // callback function when pcd is loaded
        points.geometry.center();
        points.material.size=2; // square size
        points.scale.set(3,3,3);
        points.updateMatrix();
        points.geometry.applyMatrix4(points.matrix);
        points.geometry.applyMatrix4(points.matrixWorld);
        points.scale.set(1,1,1);
        hv_pointcloud=points;
        hv_pointcloud.position.set(-20,-4,30);
        hv_pointcloud.rotation.set(0,THREE.Math.degToRad(-20),0);
        scene.add(hv_pointcloud);
        loaded.push(1);
        checkLoad();

        for(let i=0; i<hv_content.length; i++){
            hv_sph[i]=new THREE.Mesh( content_sphGeo, matBlue );
            hv_pointcloud.add(hv_sph[i]);
            hv_sph[i].position.set(hv_content[i].x,hv_content[i].y,hv_content[i].z);
        }
        
    } );






    // ------------- LUKAS + PETER -------------

    // nav sphere
    navsph[2] = new THREE.Mesh( about_sphGeo, matBlue ); // add sphere objects to array

    // pointcloud
    const lp_loader = new PCDLoader();
    lp_loader.load( "./lp/pointcloud.pcd", function (points) { // callback function when pcd is loaded
        points.geometry.center();
        points.material.size=1.2; // square size
        points.scale.set(4.5,4.5,4.5);
        points.updateMatrix();
        points.geometry.applyMatrix4(points.matrix);
        points.geometry.applyMatrix4(points.matrixWorld);
        points.scale.set(1,1,1);
        lp_pointcloud=points;
        lp_pointcloud.position.set(30,-3,30);
        scene.add(lp_pointcloud);
        scene.add(navsph[2]);
        navsph[2].position.set(30,-5,47);
        loaded.push(1);
        checkLoad();

        for(let i=0; i<lp_content.length; i++){
            lp_sph[i]=new THREE.Mesh( content_sphGeo, matBlue );
            lp_pointcloud.add(lp_sph[i]);
            lp_sph[i].position.set(lp_content[i].x,lp_content[i].y,lp_content[i].z);
        }
        
    } );

    // ------------- SABRINA -------------

    // nav sphere
    navsph[3] = new THREE.Mesh( about_sphGeo, matBlue ); // add sphere objects to array

    // pointcloud
    const sb_loader = new PCDLoader();
    sb_loader.load( "./sb/pointcloud.pcd", function (points) { // callback function when pcd is loaded
        points.geometry.center();
        points.material.size=1.2; // square size
        points.scale.set(0.7,0.7,0.7);
        points.position.set(0,-1,50);
        points.updateMatrix();
        points.geometry.applyMatrix4(points.matrix);
        points.geometry.applyMatrix4(points.matrixWorld);
        points.scale.set(1,1,1);
        sb_pointcloud=points;
        sb_pointcloud.position.set(0,0,20);
        scene.add(sb_pointcloud);
        scene.add(navsph[3]);
        navsph[3].position.set(0,0,20);
        loaded.push(1);
        checkLoad();

        for(let i=0; i<sb_content.length; i++){
            sb_sph[i]=new THREE.Mesh( content_sphGeo, matBlue );
            sb_pointcloud.add(sb_sph[i]);
            sb_sph[i].position.set(sb_content[i].x,sb_content[i].y,sb_content[i].z);
        }
        
    } );


    // ------------- SARA -------------

    // nav sphere
    navsph[4] = new THREE.Mesh( about_sphGeo, matBlue ); // add sphere objects to array

    // pointcloud
    const sr_loader = new PCDLoader();
    sr_loader.load( "./sr/pointcloud.pcd", function (points) { // callback function when pcd is loaded
        points.geometry.center();
        points.material.size=1.2; // square size
        points.scale.set(1.8,1.8,1.8);
        points.position.set(-10,5,45);
        points.rotation.order="YXZ"; //switch order for rotation follow
        points.rotation.set(0,THREE.Math.degToRad(-80),0);
        points.updateMatrix();
        points.geometry.applyMatrix4(points.matrix);
        points.geometry.applyMatrix4(points.matrixWorld);
        points.scale.set(1,1,1);
        points.position.set(0,8,0);
        sr_pointcloud=points;
        scene.add(sr_pointcloud);
        scene.add(navsph[4]);
        navsph[4].position.set(-45,-2,-25);
        loaded.push(1);
        checkLoad();

        for(let i=0; i<sr_content.length; i++){
            sr_sph[i]=new THREE.Mesh( content_sphGeo, matBlue );
            sr_pointcloud.add(sr_sph[i]);
            sr_sph[i].position.set(sr_content[i].x,sr_content[i].y,sr_content[i].z);
        }

    } );



    // ------------- VIVIEN + JENNY -------------

    // nav sphere
    navsph[5] = new THREE.Mesh( about_sphGeo, matBlue ); // add sphere objects to array

    // pointcloud
    const vj_loader = new PCDLoader();
    vj_loader.load( "./vj/pointcloud.pcd", function (points) { // callback function when pcd is loaded
        points.geometry.center();
        points.material.size=0.6; // square size
        points.scale.set(0.48,0.48,0.48);
        points.updateMatrix();
        points.geometry.applyMatrix4(points.matrix);
        points.geometry.applyMatrix4(points.matrixWorld);
        points.scale.set(1,1,1);
        vj_pointcloud=points;
        scene.add(vj_pointcloud);
        vj_pointcloud.add(vj_tree);
        vj_pointcloud.add(navsph[5]);
        navsph[5].position.set(15,-5,0)
        loaded.push(1);
        checkLoad();
    } );

    class vj_treepoint{
        constructor(title,x,y,size,pos,type,img,story,index){
            this.title=title;
            this.x=x;
            this.y=y;
            this.size=size;
            this.pos=pos;
            this.type=type;
            this.sph=undefined;
            this.txt=undefined;
            this.img=img;
            this.index=index;
            if(this.type==1){
                this.content=this.content(story);
            }
        }
    
        draw(){
            let sphGeo = new THREE.SphereGeometry( this.size, 16, 16 );
            if(this.type==0){
                this.sph=new THREE.Mesh( sphGeo, matBlue );
                vj_tree.add(this.sph);
                this.sph.position.set(this.x,this.y,0);
        
                let textGeo
                if(this.title.includes("\n") && this.pos!=1){
                    textGeo=this.txtAlign();
                } else {
                    textGeo = new THREE.TextGeometry(this.title, {font: font, size: 0.8, height: 0, curveSegments: 8} );
                }
                
                this.txt=new THREE.Mesh(textGeo,matBlue);
                this.txt.geometry.computeBoundingBox();
                let center = this.txt.geometry.boundingBox.getCenter(new THREE.Vector3());
                let bBox=this.txt.geometry.boundingBox;
                switch(this.pos){
                    case 0:
                        this.txt.position.set(-center.x,-bBox.min.y+1.2,0.15);
                        break;
                    case 1:
                        this.txt.position.set(1,-center.y,0.15);
                        break;
                    case 2:
                        this.txt.position.set(-center.x,-bBox.max.y-1.2,0.15);
                        break;
                    case 3:
                        this.txt.position.set(-bBox.max.x-1,-center.y,0.15);
                        break;
                }
                this.sph.add(this.txt);
            } else {
                let matYellow = new THREE.MeshBasicMaterial( { color: yellow } ); 
                this.sph=new THREE.Mesh( sphGeo, matYellow );
                vj_tree.add(this.sph);
                this.sph.position.set(this.x,this.y,0);
            }
            
        }
    
        txtAlign(){
            let lines=this.title.split("\n");
            let linesGeo=[];
            let linesMesh=[];
            let longestLine=0;
            for(let i=0;i<lines.length;i++){
                let geo=new THREE.TextGeometry(lines[i], {font: font, size: 0.8, height: 0, curveSegments: 8} );
                linesMesh[i]=new THREE.Mesh(geo);
                linesMesh[i].position.set(0,-(i+1)*1.6,0);
                linesMesh[i].updateMatrix();
                linesMesh[i].geometry.applyMatrix4(linesMesh[i].matrix);
                linesMesh[i].geometry.computeBoundingBox();
                
                if(i>0){
                    let bBox=linesMesh[i].geometry.boundingBox;
                    let bBoxPrev=linesMesh[i-1].geometry.boundingBox;
                    if(bBox.max.x - bBox.min.x > bBoxPrev.max.x - bBoxPrev.min.x){
                        longestLine=i;
                    }
                }
            }
    
            if(this.pos==0 || this.pos==2){
                for(let i=0;i<lines.length;i++){
                    let offset=linesMesh[longestLine].geometry.boundingBox.getCenter(new THREE.Vector3()).x - linesMesh[i].geometry.boundingBox.getCenter(new THREE.Vector3()).x;
                    linesMesh[i].position.set(offset,0,0);
                    linesMesh[i].updateMatrix();
                    linesMesh[i].geometry.applyMatrix4(linesMesh[i].matrix);
    
                    linesGeo[i]=linesMesh[i].geometry;
                }
            } else { //this.pos==3 → right align
                for(let i=0;i<lines.length;i++){
                    let offset=linesMesh[longestLine].geometry.boundingBox.max.x - linesMesh[i].geometry.boundingBox.max.x;
                    linesMesh[i].position.set(offset,0,0);
                    linesMesh[i].updateMatrix();
                    linesMesh[i].geometry.applyMatrix4(linesMesh[i].matrix);
    
                    linesGeo[i]=linesMesh[i].geometry;
                }
            }
    
            return BufferGeometryUtils.mergeBufferGeometries(linesGeo, false);
            
        }

        openPreview(){
            const container = document.createElement("div");
            container.className = "vj_preview";
            container.innerHTML="<div class='vj_preview_image' style=\"background-image:url('vj/preview/" + this.img + "');\"></div><div class='vj_preview_text'>" + this.title + "</div>";

            const preview = new CSS2DObject(container);
            preview.position.set(0,0,0);
            preview.offset.x="-100%";
            preview.offset.y="-100%";
            this.sph.add(preview);
        }

        closePreview(){
            this.sph.remove(this.sph.children[0]);
        }

        openStory(){
            document.getElementById("vj_panel").style.display="inline";
            document.getElementById("vj_headline").innerHTML=this.title;
            document.getElementById("vj_content").innerHTML=this.content;
        }

        content(story){
            let content="";
            for(let k=0;k<story.length;k++){
                switch(story[k].type){
                    case "subhead":
                        content+="<br><span class='subHeadline'>" + story[k].content + "</span><br><br></br>";
                        break;

                    case "text":
                        content+="<span class='text'>";
                        for(let p=0;p<story[k].content.length;p++){
                            content+=story[k].content[p]+"<br><br>";
                        }
                        content+="</span>";
                        break;

                    case "source":
                        content+="<span class='text'>";
                        for(let p=0;p<story[k].content.length;p++){
                            content+="<a href='" + story[k].content[p].link + "'>" + story[k].content[p].preview + "</a><br>";
                        }
                        content+="<br></span>";
                        break;

                    case "image":
                        content+="<br><img src='" + story[k].content + "' class='panelimg'>"
                        break;

                    case "caption":
                        content+="<span class='italic'>" + story[k].content + "</span><br><br><br>"
                        break;

                    case "youtube":
                        content+=story[k].content;
                        break;
                }
            }
            content+="<br>";
            content+="<span class='text'>See connected stories</span><br><br>";
            content+="<div class='vj_preview' style='width:48%;margin-right:4%;display:inline-block;'><div style='width:100%;height:100%;display:flex;'><div class='vj_preview_image' style=\"background-image:url('vj/preview/" + vj_treedata[this.index+1].thumb + "');\"></div><div class='vj_preview_text' style='font-size:15px;'>" + vj_treedata[this.index+1].title + "</div></div></div>"+
                    "<div class='vj_preview' style='width:48%;display:inline-block;'><div style='width:100%;height:100%;display:flex;'><div class='vj_preview_image' style=\"background-image:url('vj/preview/" + vj_treedata[this.index+2].thumb + "');\"></div><div class='vj_preview_text' style='font-size:15px;'>" + vj_treedata[this.index+2].title + "</div></div></div>";
            return content;
        }
    }


    // tree
    let vj_tree_geo = new THREE.PlaneGeometry(103.4, 141.5, 20, 20);
    let vj_tree_mat = new THREE.MeshBasicMaterial( { map: vj_tree_tex[0], transparent: true, side: THREE.DoubleSide } );
    vj_tree = new THREE.Mesh(vj_tree_geo, vj_tree_mat);
    vj_tree.scale.set(0.35,0.35,0.35);
    vj_tree.position.set(0,6,0);
    vj_tree.rotation.order="YXZ"; //switch order for rotation follow



    const vj_fontloader = new THREE.FontLoader();
    vj_fontloader.load( "fonts/HK Grotesk_Regular.json", function (f) {
        font=f;
        for(let i=0;i<vj_treedata.length;i++){
            let img, cont, pos;
            if(vj_treedata[i].type==1){
                img=vj_treedata[i].thumb;
                cont=vj_treedata[i].story;
                image_preloader.push(new Image());
                image_preloader[image_preloader.length-1].src="vj/preview/" + img;
            } else {
                pos=vj_treedata[i].align;
            }
            vj_treepoints[i]=new vj_treepoint(vj_treedata[i].title,vj_treedata[i].x,vj_treedata[i].y,vj_treedata[i].scale,pos,vj_treedata[i].type,img,cont,i);
            vj_treepoints[i].draw();
        }
    } );



    // CSS RENDERER
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize( window.innerWidth, window.innerHeight );
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none';
    document.getElementById("main").appendChild( labelRenderer.domElement );


    // WINDOW EVENT HANDLERS
    window.addEventListener( 'resize', onWindowResize );
    window.addEventListener( "mousemove", onMouseMove, false );
    window.addEventListener( "pointerdown", onPointerDown, false );
    
}


// WINDOW RESIZE
function onWindowResize() {
    
    // custom css variable with correct vh for webkit mobile
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh",vh+"px");

    // update three stuff
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    labelRenderer.setSize( window.innerWidth, window.innerHeight );
    render();

}

// CURSOR MOVE
function onMouseMove( event ) {
    // mouse position
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );

    for(let i=0; i<navsph.length; i++){ // test intersection of mouse against spheres
        if(raycaster.intersectObject(navsph[i]).length==1){ // mouse over sphere
            document.body.style.cursor="pointer";
            if(navsph[i].material==matBlue){ // change material
                navsph[i].material=matGreen;
                render();
            }
            break;
        } else if(hover[i]==0) { // mouse not over sphere and not hovering over nav point
            document.body.style.cursor="default";
            if(navsph[i].material==matGreen){ // change material
                navsph[i].material=matBlue;
                render();
            }
        }
    }

    for(let i=0; i<vj_treepoints.length; i++){
        if(vj_treepoints[i].type==0){
            let inverseMatrix = new THREE.Matrix4();
            let ray = new THREE.Ray();
            inverseMatrix.copy(vj_treepoints[i].txt.matrixWorld).invert();
            ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);
            if(raycaster.intersectObject(vj_treepoints[i].sph).length==1 || ray.intersectsBox(vj_treepoints[i].txt.geometry.boundingBox) == true){ // pointer down over sphere
                document.body.style.cursor="pointer";
                break;
            }
        } else {
            if(raycaster.intersectObject(vj_treepoints[i].sph).length==1){ // pointer down over sphere
                document.body.style.cursor="pointer";
                if(vj_treepoints[i].type==1 && vj_treepoints_hover!=i){
                        if(vj_treepoints_hover!=-1){
                            vj_treepoints[vj_treepoints_hover].closePreview();
                        }
                        vj_treepoints[i].openPreview();
                        vj_treepoints_hover=i;
                        labelRenderer.render( scene, camera );
                }
                break;
            } else {
                if(vj_treepoints_hover!=-1){
                    vj_treepoints[vj_treepoints_hover].closePreview();
                    vj_treepoints_hover=-1;
                    labelRenderer.render( scene, camera );
                }
            }
        }
        
    }
    //render();
}

// POINTER DOWN
function onPointerDown( event ) {
    // set animation source to current cam pos and orbit target
    if(animTime==0){ // if no animation is running
        animSrc[0]=camera.position.x;
        animSrc[1]=camera.position.y;
        animSrc[2]=camera.position.z;
        animSrc[3]=controls.target.x;
        animSrc[4]=controls.target.y;
        animSrc[5]=controls.target.z;
    }

    // mouse position
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    // raycaster intersect
    if(event.which==1){ // left click
        raycaster.setFromCamera( mouse, camera );

        for(let i=0; i<navsph.length; i++){
            if(raycaster.intersectObject(navsph[i]).length==1){
                setAnim(i);
                return;
            }
        }

        for(let c=0; c<sph_list.length;c++){
            for(let i=0; i<sph_list[c].length; i++){
                if(raycaster.intersectObject(sph_list[c][i]).length==1){
                    document.getElementById(people[c]+"_panel").style.display="inline";
                    document.getElementById(people[c]+"_panel").scrollBy(0,document.getElementById(people[c]+"_part_"+i).getBoundingClientRect().y);
                    return;
                }
            }
        }

        for(let i=0; i<vj_treepoints.length; i++){
            if(vj_treepoints[i].txt!=undefined){
                let inverseMatrix = new THREE.Matrix4();
                let ray = new THREE.Ray();
                inverseMatrix.copy(vj_treepoints[i].txt.matrixWorld).invert();
                ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);
                if(raycaster.intersectObject(vj_treepoints[i].sph).length==1 || ray.intersectsBox(vj_treepoints[i].txt.geometry.boundingBox) == true){ // pointer down over sphere
                    if(vj_tree.material.map==vj_tree_tex[0]){
                        vj_tree.material.map=vj_tree_tex[1];
                    } else {
                        vj_tree.material.map=vj_tree_tex[0];
                    }
                    render();
                    return;
                }
            } else {
                if(raycaster.intersectObject(vj_treepoints[i].sph).length==1){
                    if(vj_tree.material.map==vj_tree_tex[0]){
                        vj_tree.material.map=vj_tree_tex[1];
                    }
                    vj_treepoints[i].openStory();
                    render();
                    return;
                }
            }
        }
    }
}


function openAbout(i){
    document.getElementById(people[i]+"_panel").style.display="inline";
    document.getElementById(people[i]+"_panel").scrollBy(0,-document.getElementById(people[i]+"_panel").scrollTop);
}

function closeAll(){
    document.getElementById("about_panel").style.display="none";
    document.getElementById("hv_panel").style.display="none";
    document.getElementById("lp_panel").style.display="none";
    document.getElementById("sb_panel").style.display="none";
    document.getElementById("sr_panel").style.display="none";
    document.getElementById("vj_panel").style.display="none";
}


function checkLoad(){
    if(loaded.length==7){
        document.getElementById("loadScrn").style.display="none"; // hide loading screen
        setAnim(6);
    }
}

// THREE RENDER
function render() {
    vj_tree.rotation.set(0,camera.rotation.y,0);
    renderer.render(scene, camera);
    labelRenderer.render( scene, camera );
}


// WINDOW LOAD
window.onload=function(){
    onWindowResize(); // trigger resize event to set breakpoints

    let content=[rl_content, hv_content, lp_content, sb_content, sr_content];

    for(let c=0;c<=content.length;c++){
        document.getElementById(people[c]+"_headline").innerHTML=about[c].title;
        document.getElementById(people[c]+"_authors").innerHTML=about[c].authors;
        document.getElementById(people[c]+"_image").src=about[c].image;
        document.getElementById(people[c]+"_about_content").innerHTML=about[c].content;

        if(c<content.length){
            let html="";
            for(let i=0;i<content[c].length;i++){
                html+="<hr>";
                html+="<div id='"+people[c]+"_part_" + i + "' class='headline'>"+content[c][i].title+"</div>";
                html+=content[c][i].content;
            }
            document.getElementById(people[c]+"_content").innerHTML=html;
        }
    }



    // handle bottom right navigation colors
    let nav=document.getElementsByClassName("nav");
    let navC=document.getElementsByClassName("navCircle");
    // text
    for(let i=0; i<nav.length;i++) {
        nav[i].onmouseover=function(){setNavColor(i,1)};
        nav[i].onmouseout=function(){setNavColor(i,0)};
        nav[i].onmouseup=function(){setNavColor(i,0)};
    }
    // circles
    for(let i=0; i<navC.length;i++) {
        navC[i].onmouseover=function(){setNavColor(i,1)};
        navC[i].onmouseout=function(){setNavColor(i,0)};
        navC[i].onmouseup=function(){setNavColor(i,0)};
    }

    // setting the navigation color
    function setNavColor(id, c){
        if(c==0){ // default blue
            nav[id].style.color="#000bff";
            navC[id].style.backgroundColor="#000bff";
            navsph[id].material=matBlue; // change material of 3d spheres
            hover[id]=0;
        } else { // hover green
            nav[id].style.color="#72ff0d";
            navC[id].style.backgroundColor="#72ff0d";
            navsph[id].material=matGreen;
            hover[id]=1;
        }
        render();
    }
}


// INITIATE ANIMATION
function setAnim(c){
    // only if cam not already there and anim not running
    if(animTime==0 && Math.round(camera.position.x)!=animClick[c][1] && Math.round(camera.position.y)!=animClick[c][2] && Math.round(camera.position.z)!=animClick[c][3]){
        // hide all panels
        closeAll();
        // set anim flag true
        animClick[c][0]=1;
        animate();
    } else if(animTime==0){
        // show panel
        openAbout(c);
        /*sph[c].children[0].visible=true;
        labelRenderer.render( scene, camera );*/
    }
}


// THREE ANIMATE
function animate() {
    for(let i=0; i<animClick.length;i++){
        if(animClick[i][0]==1){ // check anim flag
            requestAnimationFrame(animate);
            camAnim();
            controls.update(); // updating controls triggers render
        }
    }
}


// CAMERA ANIMATION FRAME
function camAnim(){
    let pos = new THREE.Vector3; // camera position
    let tar = new THREE.Vector3; // orbit target
    for(let i=0; i<animClick.length;i++){ // check which sphere was clicked - not very efficient atm
        if(animClick[i][0]==1){ // check anim flag
            // interpolation between source and target; factor animProg with EaseOut
            pos.lerpVectors(new THREE.Vector3(animSrc[0],animSrc[1],animSrc[2]),new THREE.Vector3(animClick[i][1],animClick[i][2],animClick[i][3]), animProg);               
            if(i>navsph.length-1){
                tar.lerpVectors(new THREE.Vector3(animSrc[3],animSrc[4],animSrc[5]),new THREE.Vector3(0,-2,0), animProg); // starting animation target
            } else {
                tar.lerpVectors(new THREE.Vector3(animSrc[3],animSrc[4],animSrc[5]),new THREE.Vector3(navsph[i].position.x, navsph[i].position.y, navsph[i].position.z), animProg);
            }
            
            controls.target.set(tar.x, tar.y, tar.z);
            camera.position.set(pos.x,pos.y,pos.z);
            if(animTime>=1.0){ // reset timers etc after anim finished
                animTime=0.0;
                animClick[i][0]=0;
                for(let k=0;k<navsph.length;k++){ // open the panel for the clicked sphere - not so nice either
                    if(i==k){ 
                        openAbout(k);
                    }
                }
            } else {
                animTime+=0.015; // increase timer
                animProg=easeOutCubic(animTime, 0.0, 1.0, 1.0); // increase interpolation factor
            }
        }
    }
}


// CUBIC EASE
function easeOutCubic (t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
}