import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container"); // 아이디가 webgl-container인 요소를 가져와서 필드로 정의
        this._divContainer = divContainer; // 외부에서 접근 가능하게 밑줄로 

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
        camera.position.z = 2;
        this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const idensity = 1;
        const light = new THREE.DirectionalLight(color, idensity);
        light.position.set(-1,2,4);
        this._scene.add(light);
    }

    _setupModel() {
        // const geometry = new THREE.BoxGeometry(1,1,1,2,2,2); // 지정 안하면 디폴트로 1씩 지정
        // const geometry = new THREE.CircleGeometry(0.9,32, Math.PI/2, Math.PI/2); // 세팅값은 반지름, 다각개수, 시작각도, 끝 각도 뒤에 두개는 안쓰면 그냥 원
        //const geometry = new THREE.ConeGeometry(); // 원뿔은 밑면의 반지름, 원뿔의 높이 기본값은 1, 밑면의 변 개수, 높이 방향에 대한 분할개수, 원뿔 밑면 존재 여부, 밑면의 시작각, 밑면의 연장각
        //const geometry = new THREE.CylinderGeometry(); // 밑면의 반지름, 윗면의 반지름, 원통의 높이, 둘레방향에 대한 분할 개수, 높이 방향에 대한 분할 개수, 밑,윗면 존재 여부, 시작각, 연장각
        // const geometry = new THREE.SphereGeometry(0.9, 32, 12, 0, Math.PI/2); // 구의 반지름, 수평 방향에 대한 분할 수, 수직 방향에 대한 분할 수, 수평 방향에 대한 구의 시작각, 연장각, 수직 방향에 대한 시작각, 연장각
        //const geometry = new THREE.RingGeometry(0.2,0.8,10,4 ); // 내부 반지름, 외부 반지름, 가장 자리 분할 수, 내부 분할 수, 시작각, 연장각
        //const geometry = new THREE.PlaneGeometry(); // 너비, 높이, 너비 분할 수, 높이 분할 수  
        // const geometry = new THREE.TorusGeometry(0.9,0.3,24, 8, Math.PI); // 토러스의 반지름, 토러스는 긴 원통으로 360도 한바퀴 이 때 이 원통의 반지름 값, 토러스의 방사 방향에 대한 분할 수, 토러스의 연장각 길이(시작각 x)
        const geometry = new THREE.TorusKnotGeometry(); // 거의 안쓸 예정



        const material = new THREE.MeshPhongMaterial({color: 0x515151});


        const cube = new THREE.Mesh(geometry, material);

        const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
        const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), lineMaterial);

        const group = new THREE.Group();
        group.add(cube);
        group.add(line);

        this._scene.add(group);
        this._cube = group;
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
        // this._cube.rotation.x = time;
        // this._cube.rotation.y = time;
    }
}


window.onload = function(){
    new App();
}