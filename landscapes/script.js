// hv - hannah+victor
// h - hermann
// lp - lukas+peter
// sb - sabrina
// sr - sara
// vj - vivien+jenny

// import three and modules
import * as THREE from "./three/build/three.module.js";

import { OrbitControls } from "./three/examples/jsm/controls/OrbitControls.js";
import { PCDLoader } from "./three/examples/jsm/loaders/PCDLoader.js";
import { GLTFLoader } from "./three/examples/jsm/loaders/GLTFLoader.js";
import { CSS2DRenderer, CSS2DObject } from './three/examples/jsm/renderers/CSS2DRenderer.js';
import * as BufferGeometryUtils from "./three/examples/jsm/utils/BufferGeometryUtils.js";

let camera, scene, renderer, labelRenderer, controls, font;
const raycaster = new THREE.Raycaster(); // finding out over which 3d-object the cursor is
const mouse = new THREE.Vector2(); // cursor screen position

const blue=new THREE.Color(0.0,0.04,1.0); // blue default
const green=new THREE.Color(0.447,1.0,0.051); // green hover
const brown=new THREE.Color(0.514,0.114,0.114);
const yellow=new THREE.Color(1.0,0.96,0.0);
let matBlue = new THREE.MeshBasicMaterial( { color: blue } ); // blue default
let matGreen = new THREE.MeshBasicMaterial( { color: green } ); // green hover


let navsph=[];
const sphereGeometry = new THREE.SphereGeometry( 4, 32, 32 ); // sphere radius and subdivs

// vj
let vj_pointcloud, vj_tree, vj_tree_tex=[], vj_treepoints=[], vj_treepoints_hover=-1;
//sb
let sb_pointcloud;

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
    camera.position.set( -294, 226, -229 ); // starting position
    scene.add( camera );
    camera.rotation.order="YXZ"; //switch order for rotation follow


    // ORBIT CONTROLS
    controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping=true; // damping of user camera movement → less sensitivity
    controls.dampingFactor=0.5;
    controls.target.set(-1, -35.5, -44.75); // starting navigation target
    controls.update();
    controls.addEventListener( "change", render ); // render when controls change
    

    // ------------- SABRINA -------------

    // nav sphere
    navsph[1] = new THREE.Mesh( sphereGeometry, matBlue ); // add sphere objects to array

    // pointcloud
    const sb_loader = new PCDLoader();
    sb_loader.load( "./sb/pointcloud.pcd", function (points) { // callback function when pcd is loaded
        document.getElementById("loadScrn").style.display="none"; // hide loading screen
        points.geometry.center();
        points.material.size=1.0; // square size
        points.scale.set(0.7,0.7,0.7);
        points.position.set(0,0,45);
        points.updateMatrix();
        points.geometry.applyMatrix4(points.matrix);
        sb_pointcloud=points;
        scene.add(sb_pointcloud);
        sb_pointcloud.add(navsph[1]);
        navsph[1].position.set(0,0,0);
    } );



    // ------------- VIVIEN + JENNY -------------

    // nav sphere
    navsph[2] = new THREE.Mesh( sphereGeometry, matBlue ); // add sphere objects to array

    // pointcloud
    const vj_loader = new PCDLoader();
    vj_loader.load( "./vj/pointcloud.pcd", function (points) { // callback function when pcd is loaded
        document.getElementById("loadScrn").style.display="none"; // hide loading screen
        points.geometry.center();
        points.material.size=1.0; // square size
        points.scale.set(0.8,0.8,0.8);
        points.updateMatrix();
        points.geometry.applyMatrix4(points.matrix);
        vj_pointcloud=points;
        scene.add(vj_pointcloud);
        vj_pointcloud.add(vj_tree);
        vj_pointcloud.add(navsph[2]);
        navsph[2].position.set(15,-10,18)
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
            content+="<div class='vj_preview' style='width:48%;margin-right:4%;display:inline-block;'><div style='width:100%;height:100%;display:flex;'><div class='vj_preview_image' style=\"background-image:url('vj/preview/" + vj_treedata.obj[this.index+1].thumb + "');\"></div><div class='vj_preview_text' style='font-size:15px;'>" + vj_treedata.obj[this.index+1].title + "</div></div></div>"+
                    "<div class='vj_preview' style='width:48%;display:inline-block;'><div style='width:100%;height:100%;display:flex;'><div class='vj_preview_image' style=\"background-image:url('vj/preview/" + vj_treedata.obj[this.index+2].thumb + "');\"></div><div class='vj_preview_text' style='font-size:15px;'>" + vj_treedata.obj[this.index+2].title + "</div></div></div>";
            return content;
        }
    }


    // tree
    let vj_tree_geo = new THREE.PlaneGeometry(103.4, 141.5, 20, 20);
    vj_tree_tex[0] = new THREE.TextureLoader().load("vj/tree.png");
    vj_tree_tex[1] = new THREE.TextureLoader().load("vj/tree_highlight.png");
    let vj_tree_mat = new THREE.MeshBasicMaterial( { map: vj_tree_tex[0], transparent: true, side: THREE.DoubleSide } );
    vj_tree = new THREE.Mesh(vj_tree_geo, vj_tree_mat);
    vj_tree.position.set(0,25,0);
    vj_tree.rotation.order="YXZ"; //switch order for rotation follow



    const vj_fontloader = new THREE.FontLoader();

    vj_fontloader.load( "fonts/HK Grotesk_Regular.json", function (f) {
        font=f;
        for(let i=0;i<vj_treedata.obj.length;i++){
            let img, cont, pos;
            if(vj_treedata.obj[i].type==1){
                img=vj_treedata.obj[i].thumb;
                cont=vj_treedata.obj[i].story;
            } else {
                pos=vj_treedata.obj[i].align;
            }
            vj_treepoints[i]=new vj_treepoint(vj_treedata.obj[i].title,vj_treedata.obj[i].x,vj_treedata.obj[i].y,vj_treedata.obj[i].scale,pos,vj_treedata.obj[i].type,img,cont,i);
            vj_treepoints[i].draw();
        }
    } );




    // ------------- HANNAH + VICTOR -------------
    const glloader = new GLTFLoader();
    glloader.load("hv/ayahuasca.glb", function ( gltf ) {
            let vine=gltf.scene.children[0]
            scene.add( vine );
            vine.position.set(-100,-12,-100);
            let texture = new THREE.TextureLoader().load("hv/vine.png");
            texture.wrapS=THREE.RepeatWrapping;
            texture.wrapT=THREE.RepeatWrapping;
            texture.repeat.set(0.5,0.5);
            let vineMaterial = new THREE.MeshBasicMaterial( { map: texture, transparent: true} );
            vine.material=vineMaterial;
    
        }
    );


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
    for(let i=0; i<vj_treepoints.length; i++){
        if(vj_treepoints[i].type==0){
            let inverseMatrix = new THREE.Matrix4();
            let ray = new THREE.Ray();
            inverseMatrix.copy(vj_treepoints[i].txt.matrixWorld).invert();
            ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);
            if(raycaster.intersectObject(vj_treepoints[i].sph).length==1 || ray.intersectsBox(vj_treepoints[i].txt.geometry.boundingBox) == true){ // pointer down over sphere
                document.body.style.cursor="pointer";
                break;
            } else {
                document.body.style.cursor="default";
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
                }
                break;
            } else {
                document.body.style.cursor="default";
                if(vj_treepoints_hover!=-1){
                    vj_treepoints[vj_treepoints_hover].closePreview();
                    vj_treepoints_hover=-1;
                }
            }
        }
        
    }
    render();
}


// POINTER DOWN
function onPointerDown( event ) {
    // mouse position
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    // raycaster intersect
    if(event.which==1){
        raycaster.setFromCamera( mouse, camera );
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
                    break;
                }
            } else {
                if(raycaster.intersectObject(vj_treepoints[i].sph).length==1){
                    if(vj_tree.material.map==vj_tree_tex[0]){
                        vj_tree.material.map=vj_tree_tex[1];
                    }
                    vj_treepoints[i].openStory();
                    render();
                    break;
                }
            }
        }
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
}