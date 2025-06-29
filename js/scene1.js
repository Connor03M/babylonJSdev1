const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const scene = new BABYLON.Scene(engine);

//camera
const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 4, 5, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);

//lighting
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.9;

//objects
const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
ground.position.y = -0.6;

//Animation
scene.registerBeforeRender(() => {
  sphere.rotation.y += 0.01;
});

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});