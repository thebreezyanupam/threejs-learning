import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('#000000');

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const flagTexture = textureLoader.load('/textures/nepal.png')
const texture2 = textureLoader.load('/textures/ac.png')  // Another texture for example

// Create an object to hold the texture in the GUI
const textures = {
  currentTexture: flagTexture,
  texture1: flagTexture,
  texture2: texture2,
};

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1.2, 1.2, 64, 64)

const count = geometry.attributes.position.count
const randoms = new Float32Array(count)

for (let i = 0; i< count; i++){
    randoms[i] = Math.random()
}

geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

// Material
const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side:THREE.DoubleSide,
    uniforms:{
        uFrequency: { value: new THREE.Vector2(5,2) },
        uTime:{ value:0 } ,
        uColor: { value: new THREE.Color('orange') },
        uTexture: { value: textures.currentTexture }
    }
});

gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(10).step(0.01).name('frequencyX')
gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(10).step(0.01).name('frequencyY')

// Add a GUI control to change the texture
gui.add(textures, 'currentTexture', {
  'Flag Texture': textures.texture1,
  'Another Texture': textures.texture2
}).name('Texture').onChange((selectedTexture) => {
    material.uniforms.uTexture.value = selectedTexture;
    material.needsUpdate = true;  // Update material after texture change
});

// Mesh
const mesh = new THREE.Mesh(geometry, material)
mesh.scale.y = 2/3
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.25, - 0.25, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update material
    material.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
