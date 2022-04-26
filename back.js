var container, stats, controls;
var camera, scene, renderer, light;
var draggableObjects = [];
var splineHelperObjects = [];
var boxGeometry = new THREE.BoxBufferGeometry(100, 100, 100);
var white = new THREE.MeshLambertMaterial({ color: 0x888888 });
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
init();
animate();

function bezier_curve_compute(t, p1, p2, p3, p4) {
  const t1 = 1 - t;
  const t1_3 = Math.pow(t1, 3);
  const t1_2 = Math.pow(t1, 2);
  const t3 = Math.pow(t, 3);
  const t2 = Math.pow(t, 2);
  return t1_3 * p1 + 3 * t1_2 * t * p2 + 3 * t1 * t2 * p3 + t3 * p4;
}

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
  var control1 = new THREE.Mesh(
    boxGeometry,
    new THREE.MeshLambertMaterial({ color: 0x3399dd })
  );
  var control2 = new THREE.Mesh(
    boxGeometry,
    new THREE.MeshLambertMaterial({ color: 0x3399dd })
  );
  var control3 = new THREE.Mesh(
    boxGeometry,
    new THREE.MeshLambertMaterial({ color: 0x3399dd })
  );
  var control4 = new THREE.Mesh(
    boxGeometry,
    new THREE.MeshLambertMaterial({ color: 0x3399dd })
  );
  control1.position.set(-10, 100, 0);
  control1.scale.set(0.075, 0.075, 0.075);
  control1.transparent = true;
  control1.opacity = 0.5;
  control1.castShadow = true;
  control1.receiveShadow = true;

  control2.position.set(10, 100, 0);
  control2.scale.set(0.075, 0.075, 0.075);
  control2.transparent = true;
  control2.opacity = 0.5;
  control2.castShadow = true;
  control2.receiveShadow = true;

  control3.position.set(0, 50, 0);
  control3.scale.set(0.075, 0.075, 0.075);
  control3.transparent = true;
  control3.opacity = 0.5;
  control3.castShadow = true;
  control3.receiveShadow = true;

  control4.position.set(0, 150, 0);
  control4.scale.set(0.075, 0.075, 0.075);
  control4.transparent = true;
  control4.opacity = 0.5;
  control4.castShadow = true;
  control4.receiveShadow = true;
  scene.add(control1);
  scene.add(control2);
  scene.add(control3);
  scene.add(control4);
  draggableObjects.push(control1);
  draggableObjects.push(control2);
  draggableObjects.push(control3);
  draggableObjects.push(control4);

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
hamburger.addEventListener("click", function () {
  document.querySelector("body").classList.toggle("active");
});
