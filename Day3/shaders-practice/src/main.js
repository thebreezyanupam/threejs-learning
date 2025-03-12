import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

// Update on resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Scene
const scene = new THREE.Scene();

// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 100, 100);  // High segments for pixel effect

// Material
const material = new THREE.RawShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  wireframe: true,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },
    uFrequency: { value: new THREE.Vector2(10, 5) },
    uColor: { value: new THREE.Color('orange') },
    uMouse: { value: new THREE.Vector2(0, 0) }
  }
});

// Raycaster and mouse position
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(0, 0);

// Mouse tracking
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;

  material.uniforms.uMouse.value.set(mouse.x, mouse.y);

  // Raycasting to check if mouse is hovering over the mesh
  raycaster.setFromCamera(mouse, camera);
  const intersect = raycaster.intersectObject(mesh);
});

// Mesh
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

// Animation loop
const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update material uniforms
  material.uniforms.uTime.value = elapsedTime;

  // Render scene
  renderer.render(scene, camera);
  controls.update();

  // Call animate again on the next frame
  window.requestAnimationFrame(animate);
};

animate();
