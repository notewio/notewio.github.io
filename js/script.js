// ========== Utility ==========
function lerp (v0, v1, t) {
  return v0*(1-t) + v1*t
}
function easeOut (t) {
  // y = 1 - (1-x)^2
  t = 1 - t;
  t = t * t;
  return 1 - t;
}
function clip (x, min, max) {
  if      (x < min) { return min }
  else if (x > max) { return max }
  else              { return x   }
}
function loadObject (fileName, pos, rot) {
  mtlLoader.load('obj/' + fileName + '.mtl', materials => {

    const objLoader = new THREE.OBJLoader();
    materials.preload();
    objLoader.setMaterials(materials);
    objLoader.load('obj/' + fileName + '.obj', object => {

      object.position.set( ...pos );
      object.rotation.set( ...rot );
      scene.add(object);
      objects.push(object);
      animate();

    })

  })
}
function calcViewport() {
  let vFOV = THREE.MathUtils.degToRad(camera.fov);
  let height = 2 * Math.tan(vFOV / 2) * dist;
  let width = height * camera.aspect;
  return [width, height];
}




// ========== Constants ==========

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Scene
const scene = new THREE.Scene();
scene.background = null;

// Camera
const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1, 1000
);

// Viewport
const dist = 25;
var [width, height] = calcViewport();

camera.position.set(0, height/6, dist);

// Material Loader
const mtlLoader = new THREE.MTLLoader();

// DOM Elements
const cols = document.querySelectorAll("#links-container > div");
const header = document.getElementById('header');

// Page contents
const contents = [
`<h2>PROGRAMMING</h2>
<a onclick='slideDown()'>&lt;- back</a>
<p><i>making stuff is fun, and programming happens to be the most accessible tool</i></p>
<p><a href="https://github.com/notewio">github</a></p>
<div class="card-container">

<div class="card">
<h3><a href="https://github.com/ahsu1230/mathnavigatorSite"><span class="caption">intern @</span> MathNavigator</a></h3>
<p>
summer 2020, worked on the frontend<br>
a learning experience and my first time programming in a team
</p>
<span class="caption">react, nodejs</span>
</div>

<div class="card">
<h3><a href="https://github.com/notewio/shizhishurufa">十指输入法</a></h3>
<p>
type chinese with only ten keys
</p>
<span class="caption">autohotkey</span>
</div>

<div class="card">
<h3><a href="https://github.com/notewio/notewio.github.io">this website</a></h3>
<p>
now with 3d effects
</p>
<span class="caption">html/css/js, three.js</span>
</div>

</div>
`,

`<h2>MUSIC</h2>
<a onclick='slideDown()'>&lt;- back</a>
<p><i>adventures in music production</i></p>
<p><a href="http://ewio.bandcamp.com/">bandcamp</a></p>
<div class="card-container">

<div class="card">
<h3><a href="https://ewio.bandcamp.com/album/sickness-shenanigans">sickness shenanigans</a></h3>
<p></p>
<span class="caption">5/20</span>
</div>

<div class="card">
<h3><a href="https://ewio.bandcamp.com/album/six-feet-above">six feet above</a></h3>
<p></p>
<span class="caption">1/19</span>
</div>

</div>
`,

`<h2>OTHER</h2>
<a onclick='slideDown()'>&lt;- back</a>
<p><i>i do some other stuff as well</i></p>
<div class="card-container">

<div class="card">
<h3>video production youtube</h3>
<p>
i put videos on my <a href="https://www.youtube.com/channel/UCzXbITpf48SyZY91NtAfI9w">youtube</a>, sometimes they're half decent
</p>
</div>

<div class="card">
<h3>rubik's cube</h3>
<p>
i twist puzzles, sometimes at <a href="https://www.worldcubeassociation.org/persons/2018ZHEN45">competitions</a>
</p>
</div>

</div>
`
]




// ========== Globals ==========

// Objects in scene
let objects = [];

// States of camera
let cameraState = 0;
// 0: normal, 1: sliding up, 2: sliding back down

// Beginning of last animation
let lastTick = 0;

// Time since start, updated in main loop
let g_now = 0;




// ========== Set up scene ==========

// Objects
loadObject('lapt',  [-width / 3.5, -10, 0],   [0.7, Math.random()*2*Math.PI, 0]);
loadObject('kb',    [0, -10, 0],              [0.7, Math.random()*2*Math.PI, 0]);
loadObject('box',   [width / 3.5, -10, 0],    [0.7, Math.random()*2*Math.PI, 0]);

// Lights
const ambient = new THREE.AmbientLight(0x444444);
const directionalLight = new THREE.DirectionalLight(0xddeeff);
directionalLight.position.set(0, 0, 1).normalize();
scene.add(ambient);
scene.add(directionalLight);




// ========== Main loop ==========

const animate = (now) => {

  requestAnimationFrame(animate);
  g_now = now;

  for (let i = 0; i < objects.length; i++) {

    objects[i].rotation.y += 0.001;

    let ypos = Math.sin((now - 3100) * 0.001) * 0.25
    if (now < 3100) {
      objects[i].position.y = lerp(
        -10, ypos,
        easeOut(clip((now - i*500) / 2000, 0, 1))
      );
    } else {
      objects[i].position.y = ypos;
    }

  }

  let c = clip((now - lastTick) / 2000, 0, 1);
  if (c < 1) {
    switch (cameraState) {
      case 1:
        camera.rotation.x = lerp(0, -Math.PI / 4, easeOut(c));
        camera.position.y = lerp(height/6, 5, easeOut(c));
        break;
      case 2:
        camera.rotation.x = lerp(-Math.PI / 4, 0, easeOut(c));
        camera.position.y = lerp(5, height/6, easeOut(c));
        break;
    }
  }

  renderer.render(scene, camera);
}
animate();

// DOM Animation on events
function slideUp (index) {
  // Slides all elements up, reveals content
  lastTick = g_now;
  cameraState = 1;

  for (let i = 0; i < cols.length; i++) {
    cols[i].style.top = "-100vh";
  }

  header.style.transitionDuration = "1s";
  header.style.top = "0";

  document.getElementById('content').innerHTML = contents[index];
  document.getElementById('content').style.opacity = "1";
}
function slideDown () {
  // Reverse of slideUp
  lastTick = g_now;
  cameraState = 2;

  for (let i = 0; i < cols.length; i++) {
    cols[i].style.top = "0";
  }

  header.style.transitionDuration = "2s";
  header.style.top = "25vh";

  document.getElementById('content').style.opacity = "0";
}

// DOM Animation on load
for (let i = 0; i < cols.length; i++) {
  cols[i].style.opacity = 1;
}
header.style.top = '25vh';

// Resized body
function bodyResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  [width, height] = calcViewport();

  for (let i = 0; i < objects.length; i++) {
    objects[i].position.x = (-width/3.5) + i * (width/3.5);
  }

  camera.position.y = height / 6;
}
