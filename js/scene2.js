const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// Camera (constrained)
const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.5, 50, new BABYLON.Vector3(0, 0, 0), scene);
camera.lowerRadiusLimit = 20;
camera.upperRadiusLimit = 100;
camera.attachControl(canvas, true);

// Light
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
light.intensity = 0.9;

// Skybox
const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 500 }, scene);
const skyboxMaterial = new BABYLON.StandardMaterial("skyBoxMat", scene);
skyboxMaterial.backFaceCulling = false;
skyboxMaterial.disableLighting = true;
skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("https://playground.babylonjs.com/textures/skybox", scene);
skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
skybox.material = skyboxMaterial;

// Terrain using height map
const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("ground", "https://assets.babylonjs.com/environments/villageheightmap.png", {
    width: 100,
    height: 100,
    subdivisions: 100,
    minHeight: 0,
    maxHeight: 10
}, scene);

const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
groundMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/villagegreen.png", scene);
groundMat.diffuseTexture.uScale = 4;
groundMat.diffuseTexture.vScale = 4;
ground.material = groundMat;


// Cloned trees
BABYLON.SceneLoader.ImportMesh("", "https://assets.babylonjs.com/meshes/", "tree.babylon", scene, function (meshes) {
    const original = meshes[0];
    for (let i = 0; i < 20; i++) {
        const clone = original.clone("tree" + i);
        clone.position.x = Math.random() * 80 - 20;
        clone.position.z = Math.random() * 80 - 10;
    }
});

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});
