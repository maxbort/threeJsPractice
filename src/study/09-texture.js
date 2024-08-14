import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';

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
        this._scene.add(camera);
    }

    _setupLight() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // 모든 mesh의 전체 면에 대해서 균일하게 비추는 광원
        this._scene.add(ambientLight);

        const color = 0xffffff;
        const idensity = 5;
        const light = new THREE.DirectionalLight(color, idensity);
        light.position.set(-1,2,4);
        //this._scene.add(light);
        this._camera.add(light);
    }

    

    _setupModel(){
        const textureLoader = new THREE.TextureLoader();
        const map = textureLoader.load("../../src/assets/glass/Glass_Window_002_basecolor.jpg");
        const mapAo = textureLoader.load("../../src/assets/glass/Glass_Window_002_ambientOcclusion.jpg");
        const mapHeight = textureLoader.load("../../src/assets/glass/Glass_Window_002_height.png");
        const mapNormal = textureLoader.load("../../src/assets/glass/Glass_Window_002_normal.jpg");
        const mapRoughness = textureLoader.load("../../src/assets/glass/Glass_Window_002_roughness.jpg");
        const mapMetalic = textureLoader.load("../../src/assets/glass/Glass_Window_002_metallic.jpg");
        const mapAlpha = textureLoader.load("../../src/assets/glass/Glass_Window_002_opacity.jpg");


        const material = new THREE.MeshStandardMaterial({
            map: map,
            normalMap: mapNormal,
            displacementMap: mapHeight, // 실제 mesh의 geometry 좌표를 변형시켜 입체감 표현
            displacementScale: 0.2, // 변위 효과 조정
            displacementBias: -0.15, // ,

            aoMap: mapAo, // aoMap은 우선적으로 ambient light가 필요, 그리고 geometry 속성에 uv2 데이터를 지정해줘야 함, 세밀한 그림자 효과 조정
            aoMapIntensity: 40, // aoMap 강도 지정

            roughnessMap: mapRoughness, // 맵 이미지의 픽셀 값이 밝을 수록 거칠기가 강하게 됨
            roughness: 0.5, // roughness 강도 조절

            metalnessMap: mapMetalic, // 금속 재질 처럼 보이게
            metalness: 0.7, // 강도 조절

            alphaMap: mapAlpha, // 이 속성에 대한 이미지의 픽셀 값이 밝을수록 불투명, 픽셀값 완전 검정이면 투명하게
            transparent: true, // 투명도 활성화

            side: THREE.DoubleSide, // mesh의 뒷면도 렌더링

           // lightMap -> 이미지가 없어서 설명만 이 속성은 지정된 이미지의 색상으로 발광하는 느낌 표현 가능

        });

        
        const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 256,256,256), material); // displacement가 실제로 좌표를 변경시키기 때문에 이 박스의 표면에 대한 구성 좌표를 제공해줘야함. 따라서 각 표면을 256개로 segment화 시킴
        box.position.set(-1,0,0);
        box.geometry.attributes.uv2 = box.geometry.attributes.uv;
        this._scene.add(box);




        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), material); // 렌더링 효율을 위해 적절히 분할해야함 이렇게 많이 분할하는게 좋은건 아님
        sphere.position.set(1,0,0);
        sphere.geometry.attributes.uv2 = sphere.geometry.attributes.uv;
        this._scene.add(sphere);

        /**
         * 노말벡터
         */
        // const boxHelper = new VertexNormalsHelper(box,0.1, 0xffff00);
        // this._scene.add(boxHelper);

        // const sphereHelper = new VertexNormalsHelper(sphere,0.1, 0xffff00);
        // this._scene.add(sphereHelper);
        

    }

    resize(){ 
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const aspect = width/height;

        if(this._camera instanceof THREE.PerspectiveCamera){
            this._camera.aspect = aspect;
        } else {
            this._camera.left = -1 * aspect; // xLeft
            this._camera.right = 1 * aspect // xRight
        }



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