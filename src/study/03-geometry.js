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

    _setupModel() {
        class CustomSinCurve extends THREE.Curve{ // 커브를 t매개변수 방정식으로 정의한 함수
            constructor(scale){
                super();
                this.scale = scale;
            }
            getPoint(t){ // 이 메소드로 0과 1 사이의 t값에 대한 커브 구성 좌표 계산 가능
                const tx = t*3 - 1.5;
                const ty = Math.sin(2*Math.PI*t);
                const tz = 0;
                return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
            }
        }

        const path = new CustomSinCurve(4);

        const geometry = new THREE.TubeGeometry(path, 40, 0.8, 8,false ); // 두번째부터 튜브의 진행 방향에 대한 분할 수, 튜브의 원통에 대한 반지름 크기, 원통에 대한 분할 수, 곡선을 닫힌 형태로 만들어주는 옵션

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

    // _setupModel() {
    //     const shape = new THREE.Shape();

    //     // shape.moveTo(1, 1); // 1,1로 이동하고
    //     // shape.lineTo(1,-1); // 위치로 선을 그림
    //     // shape.lineTo(-1,-1);
    //     // shape.lineTo(-1,1);
    //     // shape.closePath(); // 완료 후 닫음

    //     const x = -2.5, y = -5;
    //     shape.moveTo(x+2.5, y+2.5);
    //     shape.bezierCurveTo(x+2.5, y+2.5, x+2, y, x, y);
    //     shape.bezierCurveTo(x-3, y, x-3, y+3.5, x-3, y+3.5);
    //     shape.bezierCurveTo(x-3, y+5.5, x-1.5, y+7.7, x+2.5, y+9.5);
    //     shape.bezierCurveTo(x+6, y+7.7, x+8, y+4.5, x+8, y+3.5);
    //     shape.bezierCurveTo(x+8, y+3.5, x+8, y, x+5, y);
    //     shape.bezierCurveTo(x+3.5, y, x+2.5, y+2.5, x+2.5, y+2.5);



    //     const geometry = new THREE.BufferGeometry();
    //     const points = shape.getPoints();
    //     geometry.setFromPoints(points);

    //     const material = new THREE.LineBasicMaterial({color: 0xffff00});
    //     const line = new THREE.Line(geometry,material);

    //     this._scene.add(line);
    // }

    /**
     * TubeGeometry를 이해하기 위한 예제
     */
    // _setupModel() {
    //     class CustomSinCurve extends THREE.Curve{ // 커브를 t매개변수 방정식으로 정의한 함수
    //         constructor(scale){
    //             super();
    //             this.scale = scale;
    //         }
    //         getPoint(t){ // 이 메소드로 0과 1 사이의 t값에 대한 커브 구성 좌표 계산 가능
    //             const tx = t*3 - 1.5;
    //             const ty = Math.sin(2*Math.PI*t);
    //             const tz = 0;
    //             return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
    //         }
    //     }

    //     const path = new CustomSinCurve(4);

    //     const geometry = new THREE.BufferGeometry();
    //     const points = path.getPoints(30);
    //     geometry.setFromPoints(points);

    //     const material = new THREE.LineBasicMaterial({color: 0xffff00});
    //     const line = new THREE.Line(geometry, material);

    //     this._scene.add(line);
    // }


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
        // this._cube.rotation.x = time;
        // this._cube.rotation.y = time;
    }
}


window.onload = function(){
    new App();
}