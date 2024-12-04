/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three"
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// Lens distortion shader
const LensDistortionShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'distortion': { value: 1.0 },
        'aspect': { value: window.innerWidth / window.innerHeight }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float distortion;
        uniform float aspect;
        varying vec2 vUv;

        void main() {
            vec2 uv = vUv;
            uv -= 0.5;
            uv.x *= aspect;

            // Radial distortion formula
            float len = length(uv);
            uv *= 1.0 + distortion * len * len;

            uv.x /= aspect;
            uv += 0.5;

            gl_FragColor = texture2D(tDiffuse, uv);
        }
    `
};

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

let camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 10

const scene: THREE.Scene = new THREE.Scene()

const animations: any[] = []

//directional light
const dLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 15)
dLight.position.set(3, 2, 1)
scene.add(dLight)

//ambient light
const aLight: THREE.AmbientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(aLight)

function chess(matrix: number[]) {
    const materialDark = new THREE.MeshLambertMaterial({
        color: 0x333333
    })
    const materialLight = new THREE.MeshLambertMaterial({
        color: 0xffffff
    })
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    let counter = 0 
    for (let i = 0; i < matrix[1]; i++) {
        for (let j = 0; j < matrix[0]; j++) {
            const cube = new THREE.Mesh(geometry, counter++ % 2 ? materialDark : materialLight)
            cube.position.x = j - (matrix[0] / 2)
            cube.position.y = i - (matrix[1] / 2)
            scene.add(cube)
        }
    }
}
chess([101, 101])

// animations.push((deltaTime: number)=>{
    
// })

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const lensDistortionPass = new ShaderPass(LensDistortionShader);
lensDistortionPass.uniforms['distortion'].value = 0; // Adjust distortion strength
composer.addPass(lensDistortionPass);

function changeFOV(fov: number) {
//     camera.fov = fov
//     camera.updateProjectionMatrix();
    lensDistortionPass.uniforms['distortion'].value = fov / 100
}

function init(parentElement: HTMLDivElement | null) {
    if (parentElement){
        camera = new THREE.PerspectiveCamera(50, parentElement.offsetWidth / parentElement.offsetHeight, 0.1, 1000)
        camera.position.z = 10
        parentElement.appendChild(renderer.domElement)
    }
    let lastFrameTime: number = 0
    function animate(time: number) {
        const deltaTime: number = (time - lastFrameTime) / 1000
        lastFrameTime = time
        animations.forEach((item: (dt: number)=>void) => {
            item(deltaTime)
        })
        renderer.render(scene, camera)
        composer.render();
    }
    renderer.setAnimationLoop(animate)
}

export {
    renderer,
    init,
    changeFOV
}