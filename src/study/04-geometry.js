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
        camera.position.z =15;
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
     * ExtrudeGeometry: 평면 shape에 깊이 값을 부여해주고 mesh의 윗 면과 밑 면을 비스듬하게 처리해주는 지오메트리.
     */
    _setupModel() {
        // const fontLoader = new THREE.fontLoader();
        // async function loadFont(that){
        //     const url = "../examples/fonts/helvetiker_regular.typeface.json";
        //     const font = await new Promise((resolve, reject) => {
        //         fontLoader.load(url, resolve, undefined, reject);
        //     });
        // }
        // loadFont(this);

        const geometry = new THREE.TextGeometry()

        // const x = -2.5, y = -5;
        // const shape = new THREE.Shape();
        
        // shape.moveTo(x+2.5, y+2.5);
        // shape.bezierCurveTo(x+2.5, y+2.5, x+2, y, x, y);
        // shape.bezierCurveTo(x-3, y, x-3, y+3.5, x-3, y+3.5);
        // shape.bezierCurveTo(x-3, y+5.5, x-1.5, y+7.7, x+2.5, y+9.5);
        // shape.bezierCurveTo(x+6, y+7.7, x+8, y+4.5, x+8, y+3.5);
        // shape.bezierCurveTo(x+8, y+3.5, x+8, y, x+5, y);
        // shape.bezierCurveTo(x+3.5, y, x+2.5, y+2.5, x+2.5, y+2.5);

        // const settings = {
        //     steps:1,
        //     depth:4,
        //     bevelEnabled: true,
        //     bevelThickness: 1,
        //     bevSize: 0.5,
        //     bevelSegments: 3,
        // }

        // const geometry = new THREE.ExtrudeGeometry(shape,settings);

        const material = new THREE.MeshPhongMaterial({color:0x515151});

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