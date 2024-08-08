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
        camera.position.z = 3;
        this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const idensity = 1;
        const light = new THREE.DirectionalLight(color, idensity);
        light.position.set(-1,2,4);
        this._scene.add(light);
    }

    
/**
 * three.js 의 모든 재질은 material을 상속받는다.
 * 그렇기에 모든 재질은 Material의 속성 사용 가능
 */
//     _setupModel() {
//        const material = new THREE.MeshPhongMaterial({ // mesh가 렌더링되는 픽셀 단위로 광원의 영향을 계산하는 재질
//     //    const material = new THREE.MeshLambertMaterial({ // 
// //    const material = new THREE.MeshBasicMaterial({ // 지정된 mesh를 지정된 색상으로 렌더링

//         color:"red",
//         wireframe:false,

//         visible: true, // 보일지 안보일지
//         transparent: true, // 재질의 불투명도를 사용할지 안할지
//         opacity: 1, // 투명도 사용시 1이면 불투면 0이면 투명


//         // depth buffer: 깊이 버퍼, z버퍼 3차원 객체를 카메라를 통해 좌표로 변환시켜 화면 상에 렌더링 시 해당 3차원 객체를 구성하는 각 픽셀에 대한 z값 좌표값은 0~1로 정규화
//         // 이 정규화 된 z값이 저정된 버퍼가 z버퍼.
//         // 이 값이 작을 수록 카메라에서 가까운 3차원 객체의 픽셀이다.
//         // 주로 더 멀리 있는 3차원 객체가 가까운 객체를 덮어서 렌더링 되지 않도록 하기 위해 사용
//         depthTest: true, // 렌더링 되고 있는 mesh의 픽셀 위치의 z값을 깊이 버퍼 값을 이용해 검사 할지 여부
//         depthWrite: true, // 렌더링 되고 있는 mesh의 픽셀에 대한 z값을 깊이 버퍼에 기록할지에 대한 여부
//         side: THREE.DoubleSide, // mesh를 구성하고 있는 삼각형 면에 대해 앞 면만 렌더링 할 것인지 아니면 모두 렌더링할 것인지 지정
//                                 // 광원에 영향을 받는 재질일 경우 차이 느낌
//         // wireframe 밑의 속성들은 모두 Material의 속성


//         // LabertMaterial만의 속성 phong도 있음
//         emissive: 0x555500, // 다른 광원에 영향을 받지 않는 재질 자체에서 방출하는 색상 값, 기본은 검정으로 어떤 색도 방출 x

//         // MeshPhongMaterial의 속성
//         specular: 0xffff00, // 광원에 의해 반사되는 색상
//         shininess: 10,
//         flatShading: true, // mesh를 평평하게 렌더링할지 여부

//        });

//        const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
//        box.position.set(-1,0,0);
//        this._scene.add(box);

//        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), material);
//        sphere.position.set(1,0,0);
//        this._scene.add(sphere);


 
//      }

/**
 * 여기서부턴 PBR을 위한 Material 2가지 인데 가장 많이 사용됨
 */
    _setupModel(){
        // const material = new THREE.MeshStandardMaterial({
        //     color:0xff0000,
        //     emissive:0x00000,
        //     roughness:0, // 거칠기 0이면 매끈 1에 가까울수록 매트해짐
        //     metalness: 0.7, // 금속성, 0~1
        //     wireframe: false,
        //     flatShading: false
        // })

        const material = new THREE.MeshPhysicalMaterial({ // 위의 MeshStandardMaterial을 상속받고 잇는 보다 발전된 물리기반렌더링(PBR) 재질
                                                        // MeshStandardMaterial에 코팅 효과를 줄 수 있고, 단순 투명도 처리가 아닌 실제 유리같은 효과도 표현 가능
            color:0xff0000, 
            emissive:0x00000,
            roughness:1, // 거칠기 0이면 매끈 1에 가까울수록 매트해짐
            metalness: 0, // 금속성, 0~1
            clearcoat: 1, // 0~1 코팅 여부
            clearcoatRoughness: 0, // 0~1 코팅에 대한 거칠기
            wireframe: false,
            flatShading: false
        })

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