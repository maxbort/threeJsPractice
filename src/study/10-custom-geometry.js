import * as THREE from 'three';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';
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
        this._setupContols();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }

    _setupContols(){
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
        camera.position.z = 2;
        this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const idensity = 10;
        const light = new THREE.DirectionalLight(color, idensity);
        light.position.set(-1,2,4);
        this._scene.add(light);
    }

    _setupModel() {
       const rawPositions = [
        -1,-1,0,
        1,-1,0,
        -1,1,0,
        1,1,0
       ];

       const rawNormals = [
        0,0,1,
        0,0,1,
        0,0,1,
        0,0,1
       ];

       const rawColors = [
        1,0,0,
        0,1,0,
        0,0,1,
        1,1,0
       ];

         
       const positions = new Float32Array(rawPositions);
       const normals = new Float32Array(rawNormals);
       const colors = new Float32Array(rawColors);

       const geometry = new THREE.BufferGeometry();

       geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3)); // BufferAttribute()에서 첫번째 인자는 앞에서 랩ㅍ핑해 둔 정점 데이터 지정, 두번째 인자 3의 의미는 x,y,z의 좌표값을 갖는다는 의미
       geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3)); 
       geometry.setAttribute("colors", new THREE.BufferAttribute(colors, 3)); 
        // vertexIdex는 구성하는 삼각형 지정, 삼각형을 구성하는 정점의 배치 순서가 반시계 방향이어야 한다. 반시계 방향인 면이 바로 앞면이기 때문
       geometry.setIndex([ // 인덱스는 시작값이 0
        0, 1, 2,
        2, 1, 3
       ]);

       const material = new THREE.MeshPhongMaterial({color: 0xffffff, vertexColors: true});

        //geometry.computeVertexNormals(); // 자동으로 법선벡터들 지정


       const box = new THREE.Mesh(geometry, material); 
       this._scene.add(box); // 법선 벡터 지정 안하고 띄우면 화면에 아무것도 나오지 않음
                            // 법선 벡터는 광원이 mesh의 표면에 비추는 입사각과 반사각을 계산해 재질과 함게 표면의 색상을 결정하는데 사용되기 때문
       const helper = new VertexNormalsHelper(box, 0.1, 0xffff00);
       this._scene.add(helper);

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

    update(time){
        time *= 0.001

    }
}


window.onload = function(){
    new App();
}