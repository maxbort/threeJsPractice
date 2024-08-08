import * as THREE from 'three';

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

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
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
        camera.position.z = 20;
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
        const solarSystem = new THREE.Object3D();
        this._scene.add(solarSystem);

        const radius = 1;
        const widthSegments = 12;
        const heightSegments = 12;
        const SphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    
        const sunMaterial = new THREE.MeshPhongMaterial({
            emissive: 0xffff00, flatShading: true
        });

        const sunMesh = new THREE.Mesh(SphereGeometry, sunMaterial);
        sunMesh.scale.set(3, 3, 3); // 
        solarSystem.add(sunMesh);

        const earthOrbit = new THREE.Object3D();
        solarSystem.add(earthOrbit);

        const earthMaterial = new THREE.MeshPhongMaterial({
            color:0x2233ff, emissive:0x112244, flatShading:true
        });
        

        const earthMesh = new THREE.Mesh(SphereGeometry, earthMaterial);
        earthOrbit.position.x = 10;
        earthOrbit.add(earthMesh);


        const moonOrbit = new THREE.Object3D();
        moonOrbit.position.x = 2; 
        earthOrbit.add(moonOrbit); // 여기서 moonOrbit은 earthOrbit의 자식이다. 따라서 moonOrbit은 earthObit을 중심으로 x축으로 2 떨어진 곳에 위치하게 됨

        const moonMaterial = new THREE.MeshPhongMaterial({
            color:0x888888, emissive:0x222222, flatShading:true
        });

        const moonMesh = new THREE.Mesh(SphereGeometry, moonMaterial);
        moonMesh.scale.set(0.5,0.5,0.5);
        moonOrbit.add(moonMesh);

        this._solarSystem = solarSystem; // 이 _setupModel 메서드에서 정의한 solarSystem을 다른 메서드에서 참조할 수 있도록
        this._earthOrbit = earthOrbit;
        this._moonOrbit = moonOrbit;
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
        this._solarSystem.rotation.y  = time; // 달은 지구의 자식, 지구는 태양의 자식이기에 태양이 돌면 지구,달도 같이 돔
        // this._cube.rotation.y = time;
        this._earthOrbit.rotation.y = time;
        this._moonOrbit.rotation.y = time*5;
    }
}


window.onload = function(){
    new App();
}