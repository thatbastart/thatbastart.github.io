// function referrers to window scope
window.setAnim=setAnim;
window.closePanel=closePanel;
window.openPanel=openPanel;

// import three and modules
import * as THREE from './three/build/three.module.js';

import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
import { PCDLoader } from './three/examples/jsm/loaders/PCDLoader.js';
import { CSS2DRenderer, CSS2DObject } from './three/examples/jsm/renderers/CSS2DRenderer.js';

let camera, scene, renderer, pointcloud, controls, sphere, labelRenderer;
let sph=[]; // sphere mesh objects
let matBlue, matGreen; // 1: blue default | 2: green hover
let animClick=[[0,54,74,253],[0,-75,-25,-225],[0,-14,153,-137],[0, -15, 15, -200],[0,-128,32,219],[0,-250,46.5,-391]]; // animation targets for sphere focus
let animProg=0.0; // lerp factor for coords
let animTime=0.0; // anim timer
let animSrc=[-294, 226, -229,-1, -35.5, -44.75] // animation source with start view coords
let hover=[0,0,0,0,0]; // hover over sphere bool 
let schCont=[]; // HTML contents of schedule panel
let spkCont=[]; // HTML contents of speaker panel
let bios=[]; // speaker biographies
let pres=[]; // presentation titles/abstracts
let brk; // current breakpoint
let clickSphere=0; // if a sphere was clicked

const raycaster = new THREE.Raycaster(); // finding out over which 3d-object the cursor is
const mouse = new THREE.Vector2(); // cursor screen position

let p=[ new THREE.Vector3(21, 23, 111), // About
        new THREE.Vector3(-50, -32, -40), // Schedule
        new THREE.Vector3(15, 23, -34), // Speakers
        new THREE.Vector3(-15, -12, -120), // Register
        new THREE.Vector3(-61, 7, 126), // Imprint
        new THREE.Vector3(-1,-35.5,-44.75) // start target
    ];


const blue=new THREE.Color(0.0,0.04,1.0); // blue default
const green=new THREE.Color(0.447,1.0,0.051); // green hover

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
    

    // POINTCLOUD
    const loader = new PCDLoader();
    loader.load( './pointcloud.pcd', function ( points ) {
        // callback function when pcd is loaded
        document.getElementById("loadScrn").style.display="none"; // hide loading screen
        points.geometry.center();
        points.material.size=2.25; // square size
        scene.add( points );
        pointcloud=points;
        console.log(pointcloud);
        setAnim(5); // starting animation
    } );


    // SPHERES
    /*const sphereGeometry = new THREE.SphereGeometry( 4, 32, 32 ); // sphere radius and subdivs
    matBlue = new THREE.MeshBasicMaterial( { color: blue } ); // blue default
    matGreen = new THREE.MeshBasicMaterial( { color: green } ); // green hover
    
    for(let i=0; i<p.length-1; i++){ // add spheres at positions p
        sph[i] = new THREE.Mesh( sphereGeometry, matBlue ); // add sphere objects to array
        scene.add(sph[i]);
        sph[i].position.set(p[i].x,p[i].y,p[i].z);
    }


    // CSS PANEL - ABOUT
    const aboutWrap = document.createElement( 'div' );
    aboutWrap.className = 'panel panelAbout scroll';
    aboutWrap.id = 'aboutWrap';

    aboutWrap.innerHTML=""+
        "<div class='headline'>About</div><div class='cont'>" +
        "<span class='schClose' onclick='closePanel(0,0)'>x</span>" +
        "<span class='subHeadline'><center>Relational Landscapes Symposium</center></span><br>"+
        "<span class='text'>How can we make evident the interconnectedness of landscapes not only locally but also at a distance? How can we make visible and narrate the diversity of relationships with communities that seem distant but are connected by shared histories, matter, atmosphere, people, non-human beings, and technologies?<br><br>Relational Landscapes is the conceptual framework that gives shape to a design course at the University of Applied Sciences Potsdam to trace environmental interconnectedness between Berlin-Brandenburg and the Amazon and the Andes. Departing from the study of 19th-century scientific explorations into South America (such as the Langsdorff expedition to Brazil and the Alexander von Humboldt expeditions) and the earlier exchange of crops. The course intends to open up the myriad of hidden connections that relate South American and Central European landscapes. Historical colonial forms of geoengineering have continued to today's globally interconnected transformations that alter local climatic and atmospheric conditions and ecologies.<br><br>At this symposium, we want to take a broader look through the lense of diverse presentations that navigate relational landscapes by satellite, data, foot and sail boat.</span>"

    const objAbout = new CSS2DObject( aboutWrap );
    objAbout.position.set(0,0,0);
    objAbout.visible=false;
    sph[0].add( objAbout );


    // CSS PANEL - SCHEDULE
    const scheduleWrap = document.createElement( 'div' );
    scheduleWrap.className = 'panel panelSchedule scroll';
    scheduleWrap.id = 'scheduleWrap';

    scheduleWrap.innerHTML=""+
        "<div class='headline'>Schedule</div><div style='width:100%; height:87%;'>" +
        "<div class='schLine'></div>" +
        "<span class='schClose' onclick='closePanel(1,0)'>x</span>" +
        "<div class='schRow'><div class='schField schRight'>" +
                "<span class='schTime' style='cursor: default;'>05:00 pm</span><span class='hov' onclick='openPanel(0,0,0)'><span class='schTitle'>Introduction</span><span class='schSpeaker'>&#9679; Myriel Milićević</span></span>" +
            "</div><div class='schField schLeft'>" +
            "</div></div><div class='schRow'><div class='schField schRight'>" +
            "</div><div class='schField schLeft'>" +
                "<span class='hov' onclick='openPanel(1,1,0)'><span class='schTitle'>Moderator</span><span class='schSpeaker'>Andrés Burbano<br>and Alexandra Toland &#9679;</span></span>" +
            "</div></div><div class='schRow'><div class='schField schRight'>" +
                "<span class='hov' onclick='openPanel(0,2,0)'><span class='schTitle'>Seeing the Forest in the Trees: Cosmological Imperialism in<br>Global Forest Monitoring</span><span class='schSpeaker'>&#9679; Birgit Schneider<br>and Lynda C. Olman</span>" +
            "</div><div class='schField schLeft'>" +
            "</div></div><div class='schRow'><div class='schField schRight'>" +
            "</div><div class='schField schLeft'>" +
                "<span class='hov' onclick='openPanel(1,3,0)'><span class='schTitle'>Connect - Comprehend - Communicate.<br>Amazonia as a future laboratory</span><span class='schSpeaker'>Thiago da Costa Oliveira, <br>Giacomo Nanni<br>and Fidel Thomet &#9679;</span>" +
            "</div></div><div class='schRow'><div class='schField schRight'>" +
                "<span class='hov' onclick='openPanel(0,4,0)'><span class='schTitle'>Presence as Practice</span><span class='schSpeaker'>&#9679; Amy Franceschini</span>" +
            "</div><div class='schField schLeft'>" +
            "</div></div><div class='schRow'><div class='schField schRight'>" +
            "</div><div class='schField schLeft'>" +
                "<span class='schTitle' style='cursor: default;'>Conversation</span>" +
            "</div></div><div class='schRow'><div class='schField schRight'>" +
                "<span class='hov' onclick='openPanel(0,6,0)'><span class='schTitle'>Interview with Arturo Escobar<br>(pre-recorded)</span><span class='schSpeaker'>Arturo Escobar &#9679;</span> " +
            "</div><div class='schField schLeft'>" +
            "</div></div><div class='schRow'><div class='schField schRight'>" +
            "</div><div class='schField schLeft'>" +
                "<span><span class='schTime' style='cursor: default;'>07:30 pm</span><span class='schTitle' style='cursor: default;'>Closing</span></span>" +    
            "</div></div>" + 
        "</div>";

    const objSchedule = new CSS2DObject( scheduleWrap );
    objSchedule.position.set(0,0,0);
    objSchedule.visible=false;
    sph[1].add( objSchedule );

    // schedule content panel
    const schContWrap = document.createElement( 'div' );
    schContWrap.className = 'panel panelCont scroll';
    schContWrap.id = 'schContWrap';

    bios=[  ["Andrés Burbano","Andrés Burbano is a scholar and media artist, currently an Associate Professor in the Department of Design at Universidad de los Andes, in Bogota, Colombia. Burbano holds a PhD in Media Arts and Technology from the University of California, and is visiting professor at the Danube University in Krems, Austria. This semester he is a visiting scholar at the University of Applied Sciences Potsdam, Germany."],
            ["Arturo Escobar","Arturo Escobar (born 1952) is a Colombian-American anthropologist and the Kenan Distinguished Professor of Anthropology at the University of North Carolina at Chapel Hill, USA. His academic research interests include political ecology, anthropology of development, social movements, anti-globalization movements, post-development theory, and design. Professor Escobar was elected as a member of the American Academy of Arts & Sciences in 2021, where he joined 252 new members. The honor recognizes the outstanding achievements of individuals in academia and the arts."],
            ["Amy Franceschini","Amy Franceschini, the founder of Futurefarmers, a group of artists, designers, farmers, and architects with a common interest in creating frameworks of participation that recalibrate our cultural compass. Their work uses various media to enact situations that disassemble habitual apparatus: public policy, urban planning, educational curricula, and public transportation plans. Futurefarmers produce relational sculptures and tools for audiences to gain insight into deeper fields of inquiry—not only to imagine, but also to participate in and initiate change in the places where we live.<br><br><a href='http://www.futurefarmers.com'>futurefarmers.com</a>"],
            ["Myriel Milićević","Myriel Milićević is an interaction designer, artist and professor at the Department of Design at the University of Applied Sciences Potsdam. In her work she explores the hidden connections between people and their natural, social and technical environments. This research is mostly participatory in nature and manifests itself in practical utopian models, processes and narratives. They are often realised in collaboration with other artists, scientists and practitioners."],
            ["Giacomo Nanni","Giacomo Nanni is a research associate at the Urban Complexity Lab (UCLAB) at the University of Applied Sciences Potsdam. His main field of interest lies in information visualisations and web development. Before joining the UCLAB, he worked as a web and information designer focussing on digital collections and archives. Since 2017 he works with museums, universities and institutions."],
            ["Thiago da Costa Oliveira","Thiago da Costa Oliveira is an anthropologist, curator and documentarist currently working as a Humboldt Fellow at the Ethnological Museum and Botanical Garden, Botanical Museum in Berlin. Since 2011, he has been collaboratively working with indigenous people from the Amazon. His projects explore collections of objects, photographs, and sounds as boundary objects to research the art, territory, and technology of the Amazon forest and people."],
            ["Lynda C. Olman","Lynda C. Olman is a Professor of English at the University of Nevada, Reno. She studies the rhetoric of science—particularly the public reception of visual arguments and of the ethos or public role of the scientist. She is currently editing a volume on non-Western and decolonial rhetorics of science. Her most recent monograph, Scientists as Prophets: A Rhetorical Genealogy (Lynda Walsh, Oxford UP, 2013), traced a dominant strand in the ethos of late-modern science advisers back to its historical roots in religious rhetoric. She is a 2022 recipient of the Friedrich Wilhelm Bessel Research Award for an ongoing project with Prof. Dr. Birgit Schneider (Potsdam U) on the global monitoring of forests for climate management and climate justice, tentatively titled Seeing the Forest in the Trees."],
            ["Birgit Schneider","Birgit Schneider is a media and visual studies scholar with a strong interest in environmental humanities. She is professor for knowledge cultures and media environments at Potsdam University, Institute for Arts and Media, European media studies. Her research focus are technical and scientific images with a strong focus on questions of media aesthetics, techné, ecology, maps, diagrams and textility from 17th century till the present. Her current research focuses on the visual communication of climate since 1800 and a genealogy of climate change visualization inbetween science, aesthetics and politics. Her monograph on the subject was published in 2018, entitled Klimabilder. Eine Genealogie der Bildpolitiken von Klima und Klimawandel. Another book on the subject is the edited volume „Image Politics of Climate Change“ (Bielefeld 2014)."],
            ["Fidel Thomet","Fidel is a research associate at the Urban Complexity Lab (UCLAB). He holds an MA in Urban Futures from the University of Applied Sciences Potsdam and a BA in Interaction Design from Zurich University of the Arts. Before joining the UCLAB, Fidel worked for the City of Zurich’s statistical office, Aargauer Kunsthaus, Frankfurter Allgemeine Zeitung."],
            ["Alexandra Toland","Alexandra Toland is a visual artist and environmental planner with research interests in urban ecology, soil and culture, and the Anthropocene. She is Junior Professor for Arts and Research at the Bauhaus-Universität Weimar, where she directs the PhD Programme in Art and Design. She uses a mix of qualitative, discursive, visual and performative methods in her work and embraces feminist and STS approaches to transdisciplinary research."],
    ];

    pres=  [["Seeing the Forest in the Trees: Cosmological Imperialism in Global Forest Monitoring", "This presentation treats the promise and the problems with the global monitoring of forest cover for climate management. First, we briefly review the history of how forests became visualized from an overhead or synoptic perspective to demonstrate how this process was tied up first with the commodification of forests, then their capitalization, and finally their globalization. We point out some of the climate-justice problems that result from the synoptic, global visualization of forests. We finish by suggesting cosmography (visual storytelling) as one way to productively integrate global with local views of forest to support climate justice."],
            ["Connect – Comprehend – Communicate. Amazonia as a future laboratory", "In this talk we will present a pilot project aimed to reassign colonial collections in order to overcome disciplinary, institutional and spatial boundaries and to create digital and analog spaces of networking, mutual understanding and mediation between European and Amazonian communities. The project builds on previous research findings asserting that the things stored in ethnological museums, botanical gardens, libraries, and archives are more than silent witnesses of appropriation and reinterpretation. In each of them relationships between people, plants, ancestors, and territories materialize. Thus, these collections have the potential to connect different life-worlds and knowledge practices, returning to a life that transcends the walls of collecting institutions."],
            ["Presence as Practice", "Seed Journey is a seafaring voyage connected to a public art project in the former port of Bjørvika in Oslo, Norway. Seed Journey moves people, ideas and seeds through time and space. This voyage—its crew and cargo—are agents that link the commons as they relate to local networks and a more global complex of seed savers and stewards of the land, air and water. A rotating crew of artists, anthropologists, biologists, bakers, activists, sailors and farmers join the journey and share their findings at host institutions along the route from small harbors to large ports from barns to museums (contemporary art, natural history and maritime) to social centres."],
            ["Interview with Arturo Escobar (pre-recorded)", "The symposium organizers have inquired professor Arturo Escobar about critical topics that he discusses in his book \"Designs for the Pluriverse\" and his recent essay \"On the Ontological Metrofitting of Cities.\" The questions addressed issues such as civilizational paradigm changes, the paradigm of the modern city, and the role of artistic practices, such as design, to work in a meaningful social and ecological transition."]
        ];

    schCont=[
        // myriel
        "<div class='schCont'>" +
        "<span class='schClose' onclick='closePanel(1,1)'>x</span>" +
        "<span class='subHeadline'><center>" +bios[3][0] + "</center></span><br>"+
        "<span class='text'>" + bios[3][1] + "</span>",

        // andrés & alexandra
        "<div class='schCont'>" +
        "<span class='schClose' onclick='closePanel(1,1)'>x</span>" +
        "<span class='subHeadline'><center>" + bios[0][0] + " and<br>" + bios[9][0] + "</center></span>"+
        "<span class='text'>" + bios[0][1] + "<br><br>" + bios[9][1] + "</span>",

        // birgit & lynda
        "<div class='schCont'>" +
        "<span class='schClose' onclick='closePanel(1,1)'>x</span>" +
        "<span class='subHeadline'><center>" + pres[0][0] + "</center></span><br>"+
        "<span class='text'>" + pres[0][1] + "</span><br><br><br><br>"+
        "<span class='subHeadline'><center>" + bios[7][0] + " and<br>" + bios[6][0] + "</center></span><br>"+
        "<span class='text'>" + bios[7][1] + "<br><br>" + bios[6][1] + "</span><br><br><br><br>",

        // thiago, giacomo, fidel
        "<div class='schCont'>" +
        "<span class='schClose' onclick='closePanel(1,1)'>x</span>" +
        "<span class='subHeadline'><center>" + pres[1][0] + "</center></span><br>"+
        "<span class='text'>" + pres[1][1] + "</span><br><br><br><br>"+
        "<span class='subHeadline'><center>" + bios[5][0] + ",<br>" + bios[4][0] + " and<br>" + bios[8][0] + "</center></span><br>"+
        "<span class='text'>" + bios[5][1] + "<br><br>" + bios[4][1] + "<br><br>" + bios[8][1] + "</span><br><br><br><br>",

        // amy
        "<div class='schCont'>" +
        "<span class='schClose' onclick='closePanel(1,1)'>x</span>" +
        "<span class='subHeadline'><center>" + pres[2][0] + "</center></span><br>"+
        "<span class='text'>" + pres[2][1] + "</span><br><br><br><br>"+
        "<span class='subHeadline'><center>" + bios[2][0] + "</center></span><br>"+
        "<span class='text'>" + bios[2][1] + "</span><br><br><br><br>",

        //
        "",

        // arturo
        "<div class='schCont'>" +
        "<span class='schClose' onclick='closePanel(1,1)'>x</span>" +
        "<span class='subHeadline'><center>" + pres[3][0] + "</center></span><br>"+
        "<span class='text'>" + pres[3][1] + "</span><br><br><br><br>"+
        "<span class='subHeadline'><center>" + bios[1][0] + "</center></span><br>"+
        "<span class='text'>" + bios[1][1] + "</span>"
    
    ];

    const objSchCont = new CSS2DObject( schContWrap );
    objSchCont.position.set(0,0,0);
    objSchCont.visible=false;
    objSchCont.zIdx="3";
    sph[1].add( objSchCont );


    // CSS PANEL - SPEAKERS
    const speakerWrap = document.createElement( 'div' );
    speakerWrap.className = 'panel panelSpeaker scroll';
    speakerWrap.id = 'speakerWrap';

    speakerWrap.innerHTML=""+
        "<div class='headline'>Speakers</div><div class='cont'>" +
        "<span class='schClose' onclick='closePanel(2,0)'>x</span>" +
        "<span class='hov'><span style='cursor: pointer;' onclick='openPanel(1,1,1)'><span class='text'>Arturo Escobar</span><br>"+
        "<span class='impOrg'>University of North Carolina at Chapel Hill, USA</span></span></span><br><br>"+
        "<span class='hov'><span style='cursor: pointer;' onclick='openPanel(1,2,1)'><span class='text'>Amy Franceschini</span><br>"+
        "<span class='impOrg'>Futurefarmers, USA</span></span></span><br><br>"+
        "<span class='hov'><span style='cursor: pointer;' onclick='openPanel(1,3,1)'><span class='text'>Myriel Milićević</span><br>"+
        "<span class='impOrg'>University of Applied Sciences Potsdam, Germany</span></span></span><br><br>"+
        "<span class='hov'><span style='cursor: pointer;' onclick='openPanel(1,4,1)'><span class='text'>Giacomo Nanni</span><br>"+
        "<span class='impOrg'>Urban Complexity Lab, University of Applied Sciences Potsdam, Germany</span></span></span><br><br>"+
        "<span class='hov'><span style='cursor: pointer;' onclick='openPanel(1,5,1)'><span class='text'>Thiago da Costa Oliveira</span><br>"+
        "<span class='impOrg'>Ethnological Museum Berlin and Botanical Garden Berlin, Germany</span></span></span><br><br>"+
        "<span class='hov'><span style='cursor: pointer;' onclick='openPanel(1,6,1)'><span class='text'>Lynda C. Olman</span><br>"+
        "<span class='impOrg'>University of Nevada, Reno, USA</span></span></span><br><br>"+
        "<span class='hov'><span style='cursor: pointer;' onclick='openPanel(1,7,1)'><span class='text'>Birgit Schneider</span><br>"+
        "<span class='impOrg'>University of Potsdam, Germany</span></span></span><br><br>"+
        "<span class='hov'><span style='cursor: pointer;' onclick='openPanel(1,8,1)'><span class='text'>Fidel Thomet</span><br>"+
        "<span class='impOrg'>Urban Complexity Lab, University of Applied Sciences Potsdam, Germany</span></span></span><br><br><br><br>"+
        "<span class='subHeadline'><center>Moderators</center></span><br>"+
        "<span class='hov'><span style='cursor: pointer;' onclick='openPanel(1,0,1)'><span class='text'>Andrés Burbano</span><br>"+
        "<span class='impOrg'>Universidad de los Andes, Bogotá, Colombia</span></span></span><br><br>"+
        "<span class='hov'><span style='cursor: pointer;' onclick='openPanel(1,9,1)'><span class='text'>Alexandra Toland</span><br>"+
        "<span class='impOrg'>Bauhaus-University Weimar, Germany</span></span></span>"+
        "</div>"

    const objSpeaker = new CSS2DObject( speakerWrap );
    objSpeaker.position.set(0,0,0);
    objSpeaker.visible=false;
    sph[2].add( objSpeaker );

    // speakers content panel
    const spkContWrap = document.createElement( 'div' );
    spkContWrap.className = 'panel panelCont scroll';
    spkContWrap.id = 'spkContWrap';

    spkCont=[
        "<div class='schCont'>" +
        "<span class='schClose' onclick='closePanel(2,1)'>x</span>" +
        "<span class='subHeadline'><center>", "</center></span><br>"+
        "<span class='text'>", "</span>"
    ];

    const objSpkCont = new CSS2DObject( spkContWrap );
    objSpkCont.position.set(0,0,0);
    objSpkCont.visible=false;
    objSpkCont.offset.x="-150%";
    objSpkCont.zIdx="3";
    sph[2].add( objSpkCont );


    // CSS PANEL - REGISTER
    const registerWrap = document.createElement( 'div' );
    registerWrap.className = 'panel panelImprint scroll';
    registerWrap.id = 'registerWrap';
    registerWrap.innerHTML=""+
        "<div class='headline'>Register</div><div class='cont'>" +
        "<span class='schClose' onclick='closePanel(3,0)'>x</span>" +
        "<span class='text'>For registration please email us. We will send the Zoom link to you before the symposium.<br><br>Register here: "+
        "<a style='color: var(--yellow);' href='mailto:rlsymposium2021@gmail.com?subject=Symposium%20Registration&body=Hello.%0D%0AI%20would%20like%20to%20register%20for%20the%20Relational%20Landscapes%20Symposium%20on%20the%202nd%20December%202021%20at%205pm CET.%0D%0APlease%20send%20me%20the%20Zoom%20link%20as%20soon%20as%20available.%0D%0A%0D%0AThank%20you.'>rlsymposium2021@gmail.com</a>"+
        "</span><br><br><br><br>"+
        "<span class='subHeadline'><center>Etiquette</center></span><br>"+
        "<span class='text'>This symposium is committed to enabling a diverse, inclusive and respectful environment. We are dedicated to a harassment-free experience for everyone. We do not tolerate harassment of conference participants in any form, sexual language and imagery which are not appropriate for any symposium or lecture, including publication in social media. Symposium participants breaking these precepts may be removed from the meeting at the organizers' discretion.<br><br>For this purpose, by registering all participants agree with our etiquette.	</span><br><br><br><br>"+
        "</div>"
    const objRegister = new CSS2DObject( registerWrap );
    objRegister.position.set(0,0,0);
    objRegister.visible=false;
    sph[3].add( objRegister );


    // CSS PANEL - IMPRINT
    const imprintWrap = document.createElement( 'div' );
    imprintWrap.className = 'panel panelImprint scroll';
    imprintWrap.id = 'imprintWrap';

    imprintWrap.innerHTML=""+
        "<div class='headline'>Imprint</div><div class='cont'>" +
        "<span class='schClose' onclick='closePanel(4,0)'>x</span>" +
        "<span class='subHeadline'><center>Organizers</center></span><br>"+
        "<span class='text'>Andrés Burbano</span><br>"+
        "<span class='impOrg'>Universidad de los Andes, Bogotá, Colombia</span><br><br>"+
        "<span class='text'>Myriel Milićević</span><br>"+
        "<span class='impOrg'>University of Applied Sciences Potsdam, Germany</span><br><br>"+
        "<span class='text'>Thiago da Costa Oliveira</span><br>"+
        "<span class='impOrg'>Ethnological Museum Berlin and Botanical Garden Berlin, Germany</span><br><br><br><br>"+
        "<span class='subHeadline'><center>Web Design</center></span><br>"+
        "<span class='text'>Lukas Büttenbender<br>Tilmann Finner<br>Victor Molina<br>Peter Schwarz</span><br>"+
        "<span class='impOrg'>University of Applied Sciences Potsdam, Germany</span><br><br><br><br>"+
        "<span class='subHeadline'><center>Contact</center></span><br>"+
        "<div class='fhpLogo'></div>"+
        "<span class='text'><a href='https://design.fh-potsdam.de/'>Department of Design</a><br>University of Applied Sciences Potsdam<br>Kiepenheuerallee 5<br>14469 Potsdam</span><br><br><span class='impOrg'>The University of Applied Sciences Potsdam is a public corporation. It is represented by the President Prof. Dr. Eva Schmitt-Rodermund.</span><br><br>"+
        "<span class='text'>For questions, please email us: <a style='color: var(--yellow);' href='mailto:rlsymposium2021@gmail.com'>rlsymposium2021@gmail.com</a><br><br><a href='https://www.fh-potsdam.de/impressum'>Legal Notice</a><br><a href='https://www.fh-potsdam.de/datenschutzhinweis'>Data Protection</a><br><br></span>"+
        "</div>"
    

    const objImprint = new CSS2DObject( imprintWrap );
    objImprint.position.set(0,0,0);
    objImprint.visible=false;
    sph[4].add( objImprint );


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
    */
}


// WINDOW RESIZE
function onWindowResize() {
    // set current breakpoint
    // >1600px: 3 columns
    // >1100px: 2 columns
    // <1100px: 1 column
    let w=window.innerWidth;
    if(w>1600){
        brk=0;
    } else if(w<=1600 && w >1100){
        brk=1;
    } else if(w<=1100){
        brk=2;
    }

    // set panel position via transforms according to breakpoint layout 
    for(let i=0;i<p.length-1;i++){
        switch(brk){
            case 0: sph[i].children[0].offset.x="-50%"; break;
            case 1: sph[i].children[0].offset.x="0%"; break;
            case 2: sph[i].children[0].offset.x="-50%"; break;
        }
    }

    // set subpanel (schedule, speakers) positions
    switch(brk){
        case 0: 
            sph[1].children[1].offset.x=(sph[1].children[1].side=="0")?"-150%":"50%"; 
            sph[2].children[1].offset.x="-150%"; 
            break;
        case 1: sph[1].children[1].offset.x="-100%"; sph[2].children[1].offset.x="-100%"; break;
        case 2: sph[1].children[1].offset.x="-50%"; sph[2].children[1].offset.x="-50%"; break;
    }

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

    // raycaster intersect
    raycaster.setFromCamera( mouse, camera );
    for(let i=0; i<p.length-1; i++){ // test intersection of mouse against spheres
        if(raycaster.intersectObject(sph[i]).length==1){ // mouse over sphere
            document.body.style.cursor="pointer";
            if(sph[i].material==matBlue){ // change material
                sph[i].material=matGreen;
                render();
            }
            break;
        } else if(hover[i]==0) { // mouse not over sphere and not hovering over nav point
            document.body.style.cursor="default";
            if(sph[i].material==matGreen){ // change material
                sph[i].material=matBlue;
                render();
            }
        }
    }
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
    raycaster.setFromCamera( mouse, camera );
    for(let i=0; i<p.length-1; i++){
        if(raycaster.intersectObject(sph[i]).length==1){ // pointer down over sphere
            // start anim if cam not already at target pos
            if(Math.round(camera.position.x)==animClick[i][1] && Math.round(camera.position.y)==animClick[i][2] && Math.round(camera.position.z)==animClick[i][3]){
                // if target pos open panel without anim
                sph[i].children[0].visible=true;
                labelRenderer.render( scene, camera );
            } else {
                setAnim(i);
            }
            clickSphere=1; // clicked on sphere
            break;
        } else {
            clickSphere=0; // didn't click on sphere
        }
    }
}


// INITIATE ANIMATION
function setAnim(c){
    // only if cam not already there and anim not running
    if(animTime==0 && Math.round(camera.position.x)!=animClick[c][1] && Math.round(camera.position.y)!=animClick[c][2] && Math.round(camera.position.z)!=animClick[c][3]){
        // hide all panels
        for(let i=0;i<p.length-1;i++){
            sph[i].children[0].visible=false;
        }
        sph[1].children[1].visible=false;
        sph[2].children[1].visible=false;
        // set anim flag true
        animClick[c][0]=1;
        animate();
    } else if(animTime==0){
        // show panel
        sph[c].children[0].visible=true;
        labelRenderer.render( scene, camera );
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
            tar.lerpVectors(new THREE.Vector3(animSrc[3],animSrc[4],animSrc[5]),new THREE.Vector3(p[i].x, p[i].y, p[i].z), animProg);
            controls.target.set(tar.x, tar.y, tar.z);
            camera.position.set(pos.x,pos.y,pos.z);
            if(animTime>=1.0){ // reset timers etc after anim finished
                animTime=0.0;
                animClick[i][0]=0;
                for(let k=0;k<p.length-1;k++){ // open the panel for the clicked sphere - not so nice either
                    if(i==k){ 
                        sph[k].children[0].visible=true;
                    }
                }
                labelRenderer.render( scene, camera );
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


// THREE RENDER
function render() {
    renderer.render(scene, camera);
    labelRenderer.render( scene, camera );
}


// OPEN CONTENT PANEL - schedule or speakers
function openPanel(s, id, c){
    if(s==0){ // left side
        sph[1].children[1].side="0";
        switch(brk){ // set transforms
            case 0: sph[1].children[1].offset.x="-150%"; break;
            case 1: sph[1].children[1].offset.x="-100%"; break;
            case 2: sph[1].children[1].offset.x="-50%"; break;
        }
    } else { // right side
        sph[1].children[1].side="1";
        switch(brk){
            case 0: sph[1].children[1].offset.x="50%"; break;
            case 1: sph[1].children[1].offset.x="-100%"; break;
            case 2: sph[1].children[1].offset.x="-50%"; break;
        }
    }

    if(c==0){ // schedule
        document.getElementById("schContWrap").innerHTML=schCont[id];
        sph[1].children[1].visible=true;
    } else { // speakers
        document.getElementById("spkContWrap").innerHTML=spkCont[0]+bios[id][0]+spkCont[1]+bios[id][1]+spkCont[2];
        sph[2].children[1].visible=true;
    }
    labelRenderer.render( scene, camera );
}


// CLOSE PANEL
function closePanel(id,ch){
    sph[id].children[ch].visible=false; // hide panel by id
    // hide all content panels if open
    if(sph[1].children[1].visible==true){
        sph[1].children[1].visible=false;
    }
    if(sph[2].children[1].visible==true){
        sph[2].children[1].visible=false;
    }
    labelRenderer.render( scene, camera );
}


// WINDOW LOAD
window.onload=function(){
    onWindowResize(); // trigger resize event to set breakpoints
    
    // mouse click on canvas to close the panels - mouse drag (orbit nav) leaves panels open
    const delta = 6; // max movement between mouse up and down
    let startX;
    let startY;
    let cv=document.getElementsByTagName("canvas")[0];
    cv.addEventListener('mousedown', function (event) {
        startX = event.pageX;
        startY = event.pageY;
    });
    cv.addEventListener('mouseup', function (event) {
        const diffX = Math.abs(event.pageX - startX);
        const diffY = Math.abs(event.pageY - startY);

        if (diffX < delta && diffY < delta && clickSphere==0) { // click but not on sphere: close all panels
            for(let i=0;i<p.length-1;i++){
                sph[i].children[0].visible=false;
            }
            sph[1].children[1].visible=false;
            sph[2].children[1].visible=false;
            render();
        }
    });

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
            sph[id].material=matBlue; // change material of 3d spheres
            hover[id]=0;
        } else { // hover green
            nav[id].style.color="#72ff0d";
            navC[id].style.backgroundColor="#72ff0d";
            sph[id].material=matGreen;
            hover[id]=1;
        }
        render();
    }
}