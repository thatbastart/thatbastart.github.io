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

let camera, scene, renderer, controls, font;
const raycaster = new THREE.Raycaster(); // finding out over which 3d-object the cursor is
const mouse = new THREE.Vector2(); // cursor screen position

const blue=new THREE.Color(0.0,0.04,1.0); // blue default
const green=new THREE.Color(0.447,1.0,0.051); // green hover

// vj
let vj_pointcloud, vj_tree, vj_tree_tex=[], vj_treepoints=[];

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
        points.scale.set(0.8,0.8,0.8)
        vj_pointcloud=points;
        scene.add(vj_pointcloud);
        vj_pointcloud.add(vj_tree);
    } );

    
    // tree
    let vj_tree_geo = new THREE.PlaneGeometry(103.4, 141.5, 1, 1);
    vj_tree_tex[0] = new THREE.TextureLoader().load("vj/tree.png");
    vj_tree_tex[1] = new THREE.TextureLoader().load("vj/tree_highlight.png");
    let vj_tree_mat = new THREE.MeshBasicMaterial( { map: vj_tree_tex[0], transparent: true } );
    vj_tree = new THREE.Mesh(vj_tree_geo, vj_tree_mat);
    vj_tree.position.set(0,30,0);
    


    class vj_treepoint{
        constructor(title,x,y,size,pos){
            this.title=title;
            this.x=x;
            this.y=y;
            this.size=size;
            this.pos=pos;
            this.sph=undefined;
            this.txt=undefined;
        }

        draw(){
            let sphGeo = new THREE.SphereGeometry( this.size, 16, 16 );
            let matBlue = new THREE.MeshBasicMaterial( { color: blue } ); 
            this.sph=new THREE.Mesh( sphGeo, matBlue );
            vj_tree.add(this.sph);
            this.sph.position.set(this.x,this.y,0);

            let textGeo = new THREE.TextGeometry(this.title, {
                font: font,
                size: 0.8,
                height: 0,
                curveSegments: 8
            } );
            this.txt=new THREE.Mesh(textGeo,matBlue);
            this.txt.geometry.computeBoundingBox();
            let center = this.txt.geometry.boundingBox.getCenter(new THREE.Vector3());
            
            switch(this.pos){
                case 0:
                    this.txt.position.set(-center.x,1.2,0.15);
                    break;
                case 1:
                    this.txt.position.set(1,-0.3,0.15);
                    break;
                case 2:
                    this.txt.position.set(-center.x,-1.8,0.15);
                    break;
                case 3:
                    let bBox=this.txt.geometry.boundingBox;
                    this.txt.position.set(-bBox.max.x-1,-0.3,0.15);
                    break;
            }
            this.sph.add(this.txt);
        }
    }

    const vj_fontloader = new THREE.FontLoader();

    vj_fontloader.load( "fonts/HK Grotesk_Regular.json", function (f) {
        font=f;
        for(let i=0;i<vj_treedata.length;i++){
            vj_treepoints[i]=new vj_treepoint(vj_treedata[i][0],vj_treedata[i][2],vj_treedata[i][3],vj_treedata[i][1],vj_treedata[i][4]);
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
    for(let i=0; i<vj_treepoints.length; i++){
        if(raycaster.intersectObject(vj_treepoints[i].sph).length==1){ // pointer down over sphere
            if(vj_tree.material.map==vj_tree_tex[0]){
                vj_tree.material.map=vj_tree_tex[1];
            } else {
                vj_tree.material.map=vj_tree_tex[0];
            }
            render();
        }
    }
}


// THREE RENDER
function render() {
    let quat=new THREE.Euler().setFromQuaternion( camera.getWorldQuaternion(), "XYZ" );
    console.log(THREE.Math.radToDeg(quat.y));
    //vj_tree.rotation.order="ZYX";
    //camera.rotation.order="YXZ";
    vj_tree.rotation.set(0,camera.rotation.y,0);
    renderer.render(scene, camera);
    
}


// WINDOW LOAD
window.onload=function(){
    onWindowResize(); // trigger resize event to set breakpoints
}