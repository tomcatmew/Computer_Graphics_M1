var container, stats, controls;
var camera, scene, renderer, light;
var draggableObjects = [];
var splineHelperObjects = [];
var boxGeometry = new THREE.BoxBufferGeometry(100, 100, 100);
var white = new THREE.MeshLambertMaterial({ color: 0x888888 });
let totalSlice, t, step;
let line, line2, line3;
let control1, control2, control3, control4;
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

function updatePositions() {
  t = 0;
  p0x = control1.position.x;
  p1x = control2.position.x;
  p2x = control3.position.x;
  p3x = control4.position.x;
  p0y = control1.position.y;
  p1y = control2.position.y;
  p2y = control3.position.y;
  p3y = control4.position.y;
  p0z = control1.position.z;
  p1z = control2.position.z;
  p2z = control3.position.z;
  p3z = control4.position.z;

  const positions = line.geometry.attributes.position.array;
  let x, y, z, index;
  x = y = z = index = 0;
  // console.log(positions.length);
  for (let i = 0; i < totalSlice * 3; i += 3) {
    positions[i] = bezier_curve_compute(t, p0x, p1x, p2x, p3x);
    positions[i + 1] = bezier_curve_compute(t, p0y, p1y, p2y, p3y);
    positions[i + 2] = bezier_curve_compute(t, p0z, p1z, p2z, p3z);
    t += step;
  }

  const positions2 = line2.geometry.attributes.position.array;
  positions2[0] = p0x;
  positions2[1] = p0y;
  positions2[2] = p0z;
  positions2[3] = p1x;
  positions2[4] = p1y;
  positions2[5] = p1z;

  const positions3 = line3.geometry.attributes.position.array;
  positions3[0] = p3x;
  positions3[1] = p3y;
  positions3[2] = p3z;
  positions3[3] = p2x;
  positions3[4] = p2y;
  positions3[5] = p2z;
}

function init() {
  totalSlice = 100;
  step = 1 / totalSlice;
  t = 0;
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
  control1 = new THREE.Mesh(
    boxGeometry,
    new THREE.MeshLambertMaterial({ color: 0x3399dd })
  );
  control2 = new THREE.Mesh(
    boxGeometry,
    new THREE.MeshLambertMaterial({ color: 0xf7474b })
  );
  control3 = new THREE.Mesh(
    boxGeometry,
    new THREE.MeshLambertMaterial({ color: 0xf7474b })
  );
  control4 = new THREE.Mesh(
    boxGeometry,
    new THREE.MeshLambertMaterial({ color: 0x3399dd })
  );
  control1.position.set(-15, 70, 0);
  control1.scale.set(0.065, 0.065, 0.065);
  control1.transparent = true;
  control1.opacity = 0.5;
  control1.castShadow = true;
  control1.receiveShadow = true;

  control2.position.set(5, 80, 0);
  control2.scale.set(0.045, 0.045, 0.045);
  control2.transparent = true;
  control2.opacity = 0.5;
  control2.castShadow = true;
  control2.receiveShadow = true;

  control3.position.set(0, 50, 0);
  control3.scale.set(0.045, 0.045, 0.045);
  control3.transparent = true;
  control3.opacity = 0.5;
  control3.castShadow = true;
  control3.receiveShadow = true;

  control4.position.set(40, 70, 0);
  control4.scale.set(0.065, 0.065, 0.065);
  control4.transparent = true;
  control4.opacity = 0.5;
  control4.castShadow = true;
  control4.receiveShadow = true;

  p0x = control1.position.x;
  p1x = control2.position.x;
  p2x = control3.position.x;
  p3x = control4.position.x;
  p0y = control1.position.y;
  p1y = control2.position.y;
  p2y = control3.position.y;
  p3y = control4.position.y;
  p0z = control1.position.z;
  p1z = control2.position.z;
  p2z = control3.position.z;
  p3z = control4.position.z;

  const points = [];
  const material = new THREE.LineBasicMaterial({ color: 0x000000 });
  for (let i = 0; i < totalSlice; i++) {
    x = bezier_curve_compute(t, p0x, p1x, p2x, p3x);
    y = bezier_curve_compute(t, p0y, p1y, p2y, p3y);
    z = bezier_curve_compute(t, p0z, p1z, p2z, p3z);
    points.push(new THREE.Vector3(x, y, z));
    t += step;
  }

  const points2 = [];
  const material2 = new THREE.LineBasicMaterial({
    color: 0xf7474b,
    linewidth: 1,
  });
  points2.push(new THREE.Vector3(p0x, p0y, p0z));
  points2.push(new THREE.Vector3(p1x, p1y, p1z));

  const points3 = [];
  const material3 = new THREE.LineBasicMaterial({
    color: 0xf7474b,
    linewidth: 1,
  });
  points3.push(new THREE.Vector3(p3x, p3y, p3z));
  points3.push(new THREE.Vector3(p2x, p2y, p2z));

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  line = new THREE.Line(geometry, material);

  const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
  line2 = new THREE.Line(geometry2, material2);

  const geometry3 = new THREE.BufferGeometry().setFromPoints(points3);
  line3 = new THREE.Line(geometry3, material3);

  scene.add(line);
  scene.add(line2);
  scene.add(line3);
  scene.add(control1);
  scene.add(control2);
  scene.add(control3);
  scene.add(control4);
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
  updatePositions();
  line.geometry.attributes.position.needsUpdate = true;
  line2.geometry.attributes.position.needsUpdate = true;
  line3.geometry.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
}

var hamburger = document.querySelector(".hamburger");
hamburger.addEventListener("click", function () {
  document.querySelector("body").classList.toggle("active");
});
