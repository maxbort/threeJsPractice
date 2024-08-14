import * as THREE from 'three';
import { OrbitControls, RectAreaLightHelper } from 'three/examples/jsm/Addons.js';

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
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100
        );
        camera.position.set(7,7,0);
        camera.lookAt(0,0,0);
        this._camera = camera;
    }

    _setupModel() {
        const groundGeometry = new THREE.PlaneGeometry(10, 10);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: "#2c3e50",
            roughness: 0.5,
            metalness: 0.5,
            side: THREE.DoubleSide
        });

        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = THREE.MathUtils.degToRad(-90);
        this._scene.add(ground);

        const bigSphereGeometry = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI);
        const bigSphereMaterial = new THREE.MeshStandardMaterial({
            color: "#ffffff",
            roughness: 0.1, 
            metalness: 0.2,
        });
        const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
        bigSphere.rotation.x = THREE.MathUtils.degToRad(-90);
        this._scene.add(bigSphere);

        const torusGeometry = new THREE.TorusGeometry(0.4, 0.1, 32, 32);
        const torusMaterial = new THREE.MeshStandardMaterial({
            color: "#9b59b6",
            roughness: 0.5,
            metalness: 0.9
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
            roughness: 0.2,
            metalness: 0.5
        });
        const smallSpherePivot = new THREE.Object3D();
        const smallSphere = new THREE.Mesh(smallSphereGeometry, smallSphereMaterial);
        smallSpherePivot.add(smallSphere);
        smallSpherePivot.name = "smallSpherePivot"; // 이름을 부여해두면 이 객체를 scene을 통해 언제든 조회 가능
        smallSphere.position.set(3,0.5,0);
        this._scene.add(smallSpherePivot);
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

    _setupLight() {
        // const light = new THREE.AmbientLight(0xff0000,30);
        
        // const light = new THREE.HemisphereLight("#b0d8f5", "#bb7a1c", 30); // 위에서 비치는 색상은 첫번째 인자, 아래에서 비치는 색상은 두번째 인자

        // const light = new THREE.DirectionalLight(0xffffff,20); // 태양과 같은 광원, 빛과 물체 간의 거리 상관없이 동일한 세기, 따라서 빛의 position과 target의 포지션 만이 의미가 잇음
        // light.position.set(0,5,0);
        // light.target.position.set(0,0,0);
        // this._scene.add(light.target);

        // const helper = new THREE.DirectionalLightHelper(light);
        // this._scene.add(helper);
        // this._lightHelper = helper;



        // const light = new THREE.PointLight(0xffffff,50); // 지정된 위치에서 사방으로 빛이 퍼져나감
        // light.position.set(0,5,0);

        // light.distance = 4; // 이 속성 값으로 지정된 거리까지만 광원의 영향을 받음, 0은 무한대의 값 모두 영향을 받ㅇ므
                
        // const helper = new THREE.PointLightHelper(light);
        // this._scene.add(helper);
  


        // const light = new THREE.SpotLight(0xffffff,40); // 빛이 광원에서 깔대기 모양으로 퍼져나감
        // light.position.set(0,5,0);
        // light.target.position.set(0,0,0);
        // light.angle = THREE.MathUtils.degToRad(30); // 깔대기의 각도
        // light.penumbra = 0; // 빛의 감쇄율
        // this._scene.add(light.target);
        
        // const helper = new THREE.SpotLightHelper(light);
        // this._scene.add(helper);
        // this._lightHelper = helper;



        const light = new THREE.RectAreaLight(0xffffff, 10, 6, 1); //마지막 두개는 광원의 가로세로
        light.position.set(0,5,0);
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

            // if(this._light.target){
            //     const smallSphere = smallSpherePivot.children[0]; 
            //     /**
            //      *  target 존재시 smallSpherePivot의 첫번째 자식을 얻어옴
            //      * 이 자식은 smallSphere, smallSphere의 world 좌표계의 위치를 구해서 광원의 target에 위치
            //      */
            //     smallSphere.getWorldPosition(this._light.target.position);


            //     if(this._lightHelper) this._lightHelper.update();
            // }

            //     /**
            //      *  광원이 타겟을 쫓아다니면서 추적
            //      */
            // if(this._light){
            //     const smallSphere = smallSpherePivot.children[0]; 

            //     smallSphere.getWorldPosition(this._light.position); // 

            //     if(this._lightHelper) this._lightHelper.update();
            // }

            
            // if(this._light){
            //     const smallSphere = smallSpherePivot.children[0]; 

            //     smallSphere.getWorldPosition(this._light.target.position); // 

            //     if(this._lightHelper) this._lightHelper.update();
            // }


    
        }
    }

}


window.onload = function(){
    new App();
}