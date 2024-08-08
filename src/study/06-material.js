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
        camera.position.z = 8;
        this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const idensity = 1;
        const light = new THREE.DirectionalLight(color, idensity);
        light.position.set(-1,2,4);
        this._scene.add(light);
    }

    // _setupModel() {
    //    const vertices = [];
    //    for(let i = 0; i<10000; i++){

    //     const x = THREE.MathUtils.randFloatSpread(5);
    //     const y = THREE.MathUtils.randFloatSpread(5);
    //     const z = THREE.MathUtils.randFloatSpread(5);
    //     // const x = THREE.math.randFloatSpread(5);
    //     // const y = THREE.math.randFloatSpread(5);
    //     // const z = THREE..randFloatSpread(5);

    //     vertices.push(x, y, z);
    //    }

    //    const geometry = new THREE.BufferGeometry();
    //    geometry.setAttribute(
    //     "position",
    //     new THREE.Float32BufferAttribute(vertices, 3)
    //    );

    //    const sprite = new THREE.TextureLoader().load(
    //     "/assets/transparentCircle.png"
    //    );

    //    const material = new THREE.PointsMaterial({
    //     map: sprite, // 이미지 적용
    //    // alphaTest: -1,
    //     color: "white",
    //     size: 1,
    //     sizeAttenuation: true
    //    });
    //    const points = new THREE.Points(geometry, material);
    //    console.log(points);
    //    this._scene.add(points);

    // }

    _setupModel() {
        const vertices = [
            -1,1,0,
            1,1,0,
            -1,-1,0,
            1,-1,0,
        ];

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

        // const material = new THREE.LineBasicMaterial({
        //     color: 0xff0000
        // });

        const material = new THREE.LineDashedMaterial({ // 이건 선의 길이를 참조해서 재질이 적용됨. 따라서 선의 길이 계산해줘야됨
            color:0xffff00,
            dashSize:0.2, // 이 사이즈만큼 그려지고
            gapSize:0.1, // 이 사이즈만큼 안그려짐
            scale:1
        });

        const line = new THREE.LineLoop(geometry, material);
        line.computeLineDistances();
        this._scene.add(line);
 
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