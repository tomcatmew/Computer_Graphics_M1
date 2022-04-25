var container, stats, controls;
var camera, scene, renderer, light;
var draggableObjects = [];
var boxGeometry = new THREE.BoxBufferGeometry(100, 100, 100);
var white = new THREE.MeshLambertMaterial({ color: 0x888888 });
init();
animate();
function init() {
  // container = document.createElement("div");
  container = document.getElementById("maincanvas");
  document.body.appendChild(container);
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.set(50, 100, 150);
  controls = new THREE.OrbitControls(camera);
  controls.target.set(0, 45, 0);
  controls.update();
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff); //0xa0a0a0
  scene.fog = new THREE.Fog(0xffffff, 200, 400); //0xa0a0a0
  light = new THREE.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 200, 0);
  scene.add(light);
  light = new THREE.DirectionalLight(0xbbbbbb);
  light.position.set(0, 200, 100);
  light.castShadow = true;
  light.shadow.camera.top = 180;
  light.shadow.camera.bottom = -100;
  light.shadow.camera.left = -120;
  light.shadow.camera.right = 120;
  scene.add(light);
  //scene.add(new THREE.CameraHelper(light.shadow.camera));
  // ground
  var mesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2000, 2000),
    new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);
  var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add(grid);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.style.margin = 0;
  document.body.style.padding = 0;
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  container.appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize, false);
  
  //Math.random() *
  var target = new THREE.Mesh(
    boxGeometry,
    new THREE.MeshLambertMaterial({ color: 0x3399dd })
  );
  target.position.set(0, 100, 0);
  target.scale.set(0.075, 0.075, 0.075);
  target.transparent = true;
  target.opacity = 0.5;
  target.castShadow = true;
  target.receiveShadow = true;
  scene.add(target);
  draggableObjects.push(target);

  var dragControls = new THREE.DragControls(
    draggableObjects,
    camera,
    renderer.domElement
  );
  dragControls.addEventListener("dragstart", function () {
    controls.enabled = false;
  });
  dragControls.addEventListener("dragend", function () {
    controls.enabled = true;
  });
}

function addJoint(base, position, axis, limits, size, graphicsOffset) {
  var joint = new THREE.Group();
  base.add(joint);
  joint.position.set(position[0], position[1], position[2]);
  joint.axis = new THREE.Vector3(axis[0], axis[1], axis[2]);
  joint.minLimit = limits[0] * 0.0174533;
  joint.maxLimit = limits[1] * 0.0174533;
  IKJoints.push(joint);
  var box = new THREE.Mesh(boxGeometry, white);
  joint.add(box);
  box.scale.set(size[0], size[1], size[2]);
  box.position.set(graphicsOffset[0], graphicsOffset[1], graphicsOffset[2]);
  box.castShadow = true;
  //box.receiveShadow = true;
  return joint;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}


function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

var hamburger = document.querySelector(".hamburger");
hamburger.addEventListener("click", function(){
  document.querySelector("body").classList.toggle("active");
})