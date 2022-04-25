// Copyright Yifei Chen - University of Tokyo Creative Informatics
// For Computer Graphics homework assignment 1

let container, stats, controls;
let camera, scene, renderer, light;
let totalSlice, t, step;
let line, line2, line3;
let draggableObjects = [];
let control1, control2, control3, control4;
init();
animate();

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

  const positions = line.geometry.attributes.position.array;
  let x, y, z, index;
  x = y = z = index = 0;
  // console.log(positions.length);
  for (let i = 0; i < totalSlice * 3; i += 3) {
    positions[i] = bezier_curve_compute(t, p0x, p1x, p2x, p3x);
    positions[i + 1] = bezier_curve_compute(t, p0y, p1y, p2y, p3y);
    positions[i + 2] = 0;
    t += step;
  }

  const positions2 = line2.geometry.attributes.position.array;
  positions2[0] = p0x;
  positions2[1] = p0y;
  positions2[3] = p1x;
  positions2[4] = p1y;

  const positions3 = line3.geometry.attributes.position.array;
  positions3[0] = p3x;
  positions3[1] = p3y;
  positions3[3] = p2x;
  positions3[4] = p2y;
}

function creatControl(color, size) {
  const geometry = new THREE.CircleGeometry(size, 32);
  const material = new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(geometry, material);
  return plane;
}

// implementation of cubie bezier curve
function bezier_curve_compute(t, p1, p2, p3, p4) {
  const t1 = 1 - t;
  const t1_3 = Math.pow(t1, 3);
  const t1_2 = Math.pow(t1, 2);
  const t3 = Math.pow(t, 3);
  const t2 = Math.pow(t, 2);
  return t1_3 * p1 + 3 * t1_2 * t * p2 + 3 * t1 * t2 * p3 + t3 * p4;
}

function init() {
  totalSlice = 100;
  step = 1 / totalSlice;
  t = 0;
  container = document.getElementById("maincanvas");
  document.body.appendChild(container);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.shadowMap.enabled = true;
  document.body.style.margin = 0;
  document.body.style.padding = 0;
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    500
  );
  controls = new THREE.OrbitControls(camera);
  controls.target.set(0, 45, 0);
  controls.enablePan = false;
  controls.enableRotate = false;
  controls.enableZoom = false;
  controls.update();
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);

  scene = new THREE.Scene();

  //create a blue LineBasicMaterial
  const material = new THREE.LineBasicMaterial({ color: 0x000000 });

  control1 = creatControl(0x333333, 1.5);
  control2 = creatControl(0xf7474b, 1.0);
  control3 = creatControl(0xf7474b, 1.0);
  control4 = creatControl(0x333333, 1.5);
  control1.position.set(-10, -15, 0);
  control2.position.set(5, -7, 0);
  control3.position.set(-5, 9, 0);
  control4.position.set(15, 19, 0);

  const points = [];

  p0x = control1.position.x;
  p1x = control2.position.x;
  p2x = control3.position.x;
  p3x = control4.position.x;
  p0y = control1.position.y;
  p1y = control2.position.y;
  p2y = control3.position.y;
  p3y = control4.position.y;

  for (let i = 0; i < totalSlice; i++) {
    x = bezier_curve_compute(t, p0x, p1x, p2x, p3x);
    y = bezier_curve_compute(t, p0y, p1y, p2y, p3y);
    points.push(new THREE.Vector3(x, y, 0));
    t += step;
  }

  const points2 = [];
  const material2 = new THREE.LineBasicMaterial({
    color: 0xf7474b,
    linewidth: 1,
  });
  points2.push(new THREE.Vector3(p0x, p0y, -.1));
  points2.push(new THREE.Vector3(p1x, p1y, -.1));

  const points3 = [];
  const material3 = new THREE.LineBasicMaterial({
    color: 0xf7474b,
    linewidth: 1,
  });
  points3.push(new THREE.Vector3(p3x, p3y, -.1));
  points3.push(new THREE.Vector3(p2x, p2y, -.1));

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  line = new THREE.Line(geometry, material);

  const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
  line2 = new THREE.Line(geometry2, material2);

  const geometry3 = new THREE.BufferGeometry().setFromPoints(points3);
  line3 = new THREE.Line(geometry3, material3);

  const size = 200;
  const divisions = 30;

  const gridHelper = new THREE.GridHelper(size, divisions);
  gridHelper.rotateOnAxis(new THREE.Vector3(1,0,0), 1.5708);
  gridHelper.position.z = -1;
  scene.add(gridHelper);
  scene.add(line);
  scene.add(line2);
  scene.add(line3);
  scene.add(control1);
  scene.add(control2);
  scene.add(control3);
  scene.add(control4);

  draggableObjects.push(control1);
  draggableObjects.push(control2);
  draggableObjects.push(control3);
  draggableObjects.push(control4);

  let dragControls = new THREE.DragControls(
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
