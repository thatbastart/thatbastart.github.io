// hv - hannah+victor
// h - hermann
// lp - lukas+peter
// sb - sabrina
// sr - sara
// vj - vivien+jenny

// import three and modules
import * as THREE from './three/build/three.module.js';

import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
import { PCDLoader } from './three/examples/jsm/loaders/PCDLoader.js';
import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';

let camera, scene, renderer, controls;
const raycaster = new THREE.Raycaster(); // finding out over which 3d-object the cursor is
const mouse = new THREE.Vector2(); // cursor screen position

const blue=new THREE.Color(0.0,0.04,1.0); // blue default
const green=new THREE.Color(0.447,1.0,0.051); // green hover

// vj
let vj_pointcloud;
let sph=[]; // sphere mesh objects
let matBlue;
let plane;
let tex_tree=[];

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


    // ORBIT CONTROLS
    controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping=true; // damping of user camera movement → less sensitivity
    controls.dampingFactor=0.5;
    controls.target.set(-1, -35.5, -44.75); // starting navigation target
    controls.update();
    controls.addEventListener( 'change', render ); // render when controls change
    

    // ------------- VIVIEN + JENNY -------------

    // pointcloud
    const vj_loader = new PCDLoader();
    vj_loader.load( './vj/pointcloud.pcd', function (points) {
        // callback function when pcd is loaded
        document.getElementById("loadScrn").style.display="none"; // hide loading screen
        points.geometry.center();
        points.material.size=1.0; // square size
        vj_pointcloud=points;
        scene.add(vj_pointcloud);
    } );


    class vj_treepoint{
        constructor(title,x,y,size,pos){
            this.title=title;
            this.x=x;
            this.y=y;
            this.size=size;
            this.pos=pos;
            this.sph=undefined;
        }

        draw(){

        }
    }

    let vj_treepoints=[];
    for(let i=0;i<vj_treedata.length;i++){
        vj_treepoints[i]=new vj_treepoint(vj_treedata[i][0],vj_treedata[i][2],vj_treedata[i][3],vj_treedata[i][1],vj_treedata[i][4]);
    }


    // tree
    let planeGeometry = new THREE.PlaneGeometry(103.4, 141.5, 1, 1);
    tex_tree[0] = new THREE.TextureLoader().load("vj/tree.png");
    tex_tree[1] = new THREE.TextureLoader().load("vj/tree_highlight.png");
    let planeMaterial = new THREE.MeshBasicMaterial( { map: tex_tree[0], transparent: true } );
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0,30,0);
    scene.add(plane);

    const sphereGeometry1 = new THREE.SphereGeometry( 0.6, 16, 16 ); 
    const sphereGeometry2 = new THREE.SphereGeometry( 0.8, 16, 16 ); 
    matBlue = new THREE.MeshBasicMaterial( { color: blue } ); 

    for(let i=0;i<vj_treepoints.length;i++){
        if(vj_treepoints[i].size==2){
            sph[i]=new THREE.Mesh( sphereGeometry2, matBlue );
        } else {
            sph[i]=new THREE.Mesh( sphereGeometry1, matBlue );
        }
        
        plane.add(sph[i]);
        sph[i].position.set(vj_treepoints[i].x,vj_treepoints[i].y,0);
    }



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
    render();

}


// CURSOR MOVE
function onMouseMove( event ) {
    // mouse position
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    render();
}


// POINTER DOWN
function onPointerDown( event ) {
    // mouse position
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    // raycaster intersect
    raycaster.setFromCamera( mouse, camera );
    for(let i=0; i<sph.length-1; i++){
        if(raycaster.intersectObject(sph[i]).length==1){ // pointer down over sphere
            if(plane.material.map==tex_tree[0]){
                plane.material.map=tex_tree[1];
            } else {
                plane.material.map=tex_tree[0];
            }
            render();
        }
    }
}


// THREE RENDER
function render() {
    plane.lookAt(camera.position.x,30,camera.position.z);
    renderer.render(scene, camera);
}


// WINDOW LOAD
window.onload=function(){
    onWindowResize(); // trigger resize event to set breakpoints
}