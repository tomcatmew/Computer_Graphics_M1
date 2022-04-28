// Copyright Yifei Chen - University of Tokyo Creative Informatics
// For Computer Graphics homework assignment 1

let container, stats, controls;
let camera, scene, renderer, light;
let totalSlice, t, step;
let line, line2, line3;
let draggableObjects = [];
let control1, control2, control3, control4;
let current_sample;
let controlPoints = [];
let samplePoint = [];
const material_line = new THREE.LineBasicMaterial({ color: 0x000000 });
const params = {
  Samples: 30,
  tension: 0.5,
};

init();
animate();

function updatePositions() {
  if (typeof line != "undefined" && samplePoint.length != 0) {
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


    // console.log(samplePoint.length);
    for (let i = 0; i <= current_sample * 3; i += 3) {
      update_p = catmull_rom(t);
      update_x = update_p.x;
      update_y = update_p.y;
      if (i == current_sample * 3) {
        positions[i] = p3x;
        positions[i + 1] = p3y;
        positions[i + 2] = 0;
      } else {
        positions[i] = update_x;
        positions[i + 1] = update_y;
        positions[i + 2] = 0;
      }
      // const sample_positions = samplePoint[i].geometry.attributes.position.array;
      // sample_positions[i] = update_x;
      // sample_positions[i + 1] = update_y;
      const sample_idx = Math.floor(i / 3);
      if (i == current_sample * 3) {
        samplePoint[sample_idx].position.set(p3x, p3y, 0);
      } else {
        samplePoint[sample_idx].position.set(update_x, update_y, 0);
      }

      t += step;
    }
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

function creatSample(color, size) {
  const geometry = new THREE.CircleGeometry(size, 32);
  const material = new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(geometry, material);
  return plane;
}

function update_samples() {
  scene.remove(line);
  for (let i = 0; i <= current_sample; i++) {
    scene.remove(samplePoint[i]);
  }
  samplePoint = [];
  points = [];
  p0x = control1.position.x;
  p1x = control2.position.x;
  p2x = control3.position.x;
  p3x = control4.position.x;
  p0y = control1.position.y;
  p1y = control2.position.y;
  p2y = control3.position.y;
  p3y = control4.position.y;
  current_sample = params.Samples;
  step = 1 / current_sample;
  t = 0;

  for (let i = 0; i < current_sample; i++) {
    sample_p = catmull_rom(t);
    points.push(sample_p);
    sample = creatSample(0x4989bb, 0.5);
    sample.position.x = sample_p.x;
    sample.position.y = sample_p.y;
    samplePoint.push(sample);
    t += step;
    if (i == current_sample - 1) {
      let last_x = p3x;
      let last_y = p3y;
      points.push(new THREE.Vector3(last_x, last_y, 0));
      let last_sample = creatSample(0x4989bb, 0.5);
      last_sample.position.x = last_x;
      last_sample.position.y = last_y;
      samplePoint.push(last_sample);
    }
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  line = new THREE.Line(geometry, material_line);
  scene.add(line);
  for (let i = 0; i <= current_sample; i++) {
    scene.add(samplePoint[i]);
  }
  updatePositions();
}

// -------------implementation of Catmull-Rom Splines-------------------
function catmull_rom(t) {
  tt = t * t;
  ttt = tt * t;

  q1 = -ttt + 2 * tt - t;
  q2 = 3 * ttt - 5 * tt + 2;
  q3 = -3 * ttt + 4 * tt + t;
  q4 = ttt - tt;

  tx =
    0.5 *
    (control2.position.x * q1 +
      control1.position.x * q2 +
      control4.position.x * q3 +
      control3.position.x * q4);
  ty =
    0.5 *
    (control2.position.y * q1 +
      control1.position.y * q2 +
      control4.position.y * q3 +
      control3.position.y * q4);

  return new THREE.Vector3(tx, ty, 0);
}

function bezier_curve_compute(t, p1, p2, p3, p4) {
  const t1 = 1 - t;
  const t1_3 = Math.pow(t1, 3);
  const t1_2 = Math.pow(t1, 2);
  const t3 = Math.pow(t, 3);
  const t2 = Math.pow(t, 2);
  return t1_3 * p1 + 3 * t1_2 * t * p2 + 3 * t1 * t2 * p3 + t3 * p4;
}
// ------------------------ Implementation ----------------------------

function init() {
  current_sample = params.Samples;
  step = 1 / current_sample;
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

  const gui = new dat.GUI();
  gui.domElement.id = "gui";
  const cubeFolder = gui.addFolder("Sampled Line");
  cubeFolder.add(params, "Samples", 10, 60).step(1).onChange(update_samples);
  cubeFolder.open();

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
  control1.position.set(-10, -5, 0);
  control2.position.set(-20, 30, 0);
  control3.position.set(40, 20, 0);
  control4.position.set(20, -5, 0);

  const points = [];

  p0x = control1.position.x;
  p1x = control2.position.x;
  p2x = control3.position.x;
  p3x = control4.position.x;
  p0y = control1.position.y;
  p1y = control2.position.y;
  p2y = control3.position.y;
  p3y = control4.position.y;

  for (let i = 0; i < current_sample; i++) {
    sample_p = catmull_rom(t);
    points.push(sample_p);
    sample = creatSample(0x4989bb, 0.5);
    sample.position.x = sample_p.x;
    sample.position.y = sample_p.y;
    samplePoint.push(sample);
    t += step;
    if (i == current_sample - 1) {
      let last_x = p3x;
      let last_y = p3y;
      points.push(new THREE.Vector3(last_x, last_y, 0));
      let last_sample = creatSample(0x4989bb, 0.5);
      last_sample.position.x = last_x;
      last_sample.position.y = last_y;
      samplePoint.push(last_sample);
    }
  }

  const points2 = [];
  const material2 = new THREE.LineBasicMaterial({
    color: 0xf7474b,
    linewidth: 1,
  });
  points2.push(new THREE.Vector3(p0x, p0y, -0.1));
  points2.push(new THREE.Vector3(p1x, p1y, -0.1));

  const points3 = [];
  const material3 = new THREE.LineBasicMaterial({
    color: 0xf7474b,
    linewidth: 1,
  });
  points3.push(new THREE.Vector3(p3x, p3y, -0.1));
  points3.push(new THREE.Vector3(p2x, p2y, -0.1));

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  line = new THREE.Line(geometry, material);

  const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
  line2 = new THREE.Line(geometry2, material2);

  const geometry3 = new THREE.BufferGeometry().setFromPoints(points3);
  line3 = new THREE.Line(geometry3, material3);

  const size = 200;
  const divisions = 30;

  const gridHelper = new THREE.GridHelper(size, divisions);
  gridHelper.rotateOnAxis(new THREE.Vector3(1, 0, 0), 1.5708);
  gridHelper.position.z = -1;
  scene.add(gridHelper);
  scene.add(line);
  scene.add(line2);
  scene.add(line3);
  scene.add(control1);
  scene.add(control2);
  scene.add(control3);
  scene.add(control4);

  for (let i = 0; i <= current_sample; i++) {
    scene.add(samplePoint[i]);
  }
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
  // update_samples();
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
