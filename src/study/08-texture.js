import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container"); // 아이디가 webgl-container인 요소를 가져와서 필드로 정의
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio); 
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();
        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }

    _setupControls() {
        new OrbitControls(this._camera, this._divContainer);
    }

    _setupCamera() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100
        );
        camera.position.z = 7;
        this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const idensity = 1;
        const light = new THREE.DirectionalLight(color, idensity);
        light.position.set(-1,2,4);
        this._scene.add(light);
    }

    

    _setupModel(){
        const textureLoader = new THREE.TextureLoader();
        const map = textureLoader.load(
            "../../src/assets/uv_grid_opengl.jpg",
            texture => {
                texture.repeat.x = 1;
                texture.repeat.y = 1;

                texture.wrapS = THREE.ClampToEdgeWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;

                texture.offset.x = 0;
                texture.offset.y = 0;

                texture.rotation = THREE.MathUtils.degToRad(0);
                texture.center.x = 0.5;
                texture.center.y = 0.5;

                texture.magFilter = THREE.NearestFilter;
                texture.minFilter = THREE.NearestMipMapLinearFilter;
            }
        );
        const material = new THREE.MeshStandardMaterial({
            map: map
        });

        const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
        box.position.set(-1,0,0);
        this._scene.add(box);

        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), material);
        sphere.position.set(1,0,0);
        this._scene.add(sphere);

    }

    resize(){ 
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        
        this._camera.aspect = width/height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }
    render(time){
        this._renderer.render(this._scene, this._camera); // renderer가 scene을 camera의 시점으로 렌더링 하라는 코드
        3
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }

    update(){
        // time *= 0.001
       
    }
}


window.onload = function(){
    new App();
}