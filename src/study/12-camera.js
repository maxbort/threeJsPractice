import * as THREE from 'three';
import { OrbitControls, RectAreaLightHelper, RectAreaLightUniformsLib } from 'three/examples/jsm/Addons.js';

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

    _setupControls(){
        new OrbitControls(this._camera, this._divContainer);
    }

    _setupCamera() {
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );

        // const aspect = window.innerWidth/window.innerHeight;
        // const camera = new THREE.OrthographicCamera(
        //     -1* aspect, 1 * aspect, // xLeft, xRight, aspect 값을 곱해주는 이유: 렌더링 결과가 표시되는 DOM 요소에 크기에 대한 종횡비를 적용시켜 자연스러운 결과를 얻기 위함
        //     1, -1, // yTop, yBottom
        //     0.1, 100 // zNear, zFar
        // );

        // camera.zoom = 0.25;
        camera.position.set(7,7,0);
        camera.lookAt(0,0,0);
        this._camera = camera;
    }

    _setupModel() {
        const groundGeometry = new THREE.PlaneGeometry(10, 10);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: "#2c3e50",
            roughness: 0.5,
            metalness: 0.1,
            side: THREE.DoubleSide
        });

        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = THREE.MathUtils.degToRad(-90);
        this._scene.add(ground);

        const bigSphereGeometry = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI);
        const bigSphereMaterial = new THREE.MeshStandardMaterial({
            color: "#ffffff",
            roughness: 0,
            metalness: 0.1
        });
        const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
        bigSphere.rotation.x = THREE.MathUtils.degToRad(-90);
        this._scene.add(bigSphere);

        const torusGeometry = new THREE.TorusGeometry(0.4, 0.1, 32, 32);
        const torusMaterial = new THREE.MeshStandardMaterial({
            color: "#9b59b6",
            roughness: 0,
            metalness: 0.1
        });

        for(let i = 0; i < 8; i++){
            const torusPivot = new THREE.Object3D();
            const torus = new THREE.Mesh(torusGeometry, torusMaterial);
            torusPivot.rotation.y= THREE.MathUtils.degToRad(45 * i);
            torus.position.set(3, 0.5 ,0);
            torusPivot.add(torus);
            this._scene.add(torusPivot);
        }

        const smallSphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const smallSphereMaterial = new THREE.MeshStandardMaterial({
            color:"#e74c3c",
            roughness: 0,
            metalness: 0.1
        });
        const smallSpherePivot = new THREE.Object3D();
        const smallSphere = new THREE.Mesh(smallSphereGeometry, smallSphereMaterial);
        smallSpherePivot.add(smallSphere);
        smallSpherePivot.name = "smallSpherePivot"; // 이름을 부여해두면 이 객체를 scene을 통해 언제든 조회 가능
        smallSphere.position.set(3,0.5,0);
        this._scene.add(smallSpherePivot);

        const targetPivot = new THREE.Object3D();
        const target = new THREE.Object3D();
        targetPivot.add(target);
        targetPivot.name = "targetPivot";
        target.position.set(3,0.5,0);
        this._scene.add(targetPivot);
    }

    resize(){ 

        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        
        const aspect = width/height;
        if(this._camera instanceof THREE.PerspectiveCamera){
            this._camera.aspect = aspect;
        } else {
            this._camera.left = -1 * aspect,
            this._camera.right = 1 * aspect
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

    _setupLight() {
        RectAreaLightUniformsLib.init();

        const light = new THREE.RectAreaLight(0xffffff, 20, 6, 1); //마지막 두개는 광원의 가로세로
        light.position.set(0,7,0);
        light.rotation.x = THREE.MathUtils.degToRad(-90);
        const helper = new RectAreaLightHelper(light);
        light.add(helper);


        this._scene.add(light);
        this._light = light;
      }

    update(time){
        time *= 0.001;
        const smallSpherePivot = this._scene.getObjectByName("smallSpherePivot");
        if(smallSpherePivot){
            smallSpherePivot.rotation.y = THREE.MathUtils.degToRad(time*50);

            const smallSphere = smallSpherePivot.children[0];
            smallSphere.getWorldPosition(this._camera.position);

            const targetPivot = this._scene.getObjectByName("targetPivot");
            if(targetPivot){
                targetPivot.rotation.y = THREE.MathUtils.degToRad(time*50 + 10);

                const target = targetPivot.children[0];
                const pt = new THREE.Vector3();

                target.getWorldPosition(pt);

                this._camera.lookAt(pt);
            }
            
        if(this._light.target){
            const smallSphere = smallSpherePivot.children[0]; 

            smallSphere.getWorldPosition(this._light.target.position); // 

            if(this._lightHelper) this._lightHelper.update();
        }


    
        }
    }

}


window.onload = function(){
    new App();
}