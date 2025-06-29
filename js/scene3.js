const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// Physics setup
window.CANNON = CANNON;
scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());

// Camera
const camera = new BABYLON.ArcRotateCamera("cam", Math.PI / 2, Math.PI / 2.5, 30, new BABYLON.Vector3(0, 2, 0), scene);
camera.attachControl(canvas, true);

// Light
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
light.intensity = 0.9;

// Ground
const groundSize = 40;
const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: groundSize, height: groundSize }, scene);
const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
groundMat.diffuseColor = new BABYLON.Color3(0.2, 0.6, 0.3);
ground.material = groundMat;
ground.physicsImpostor = new BABYLON.PhysicsImpostor(
    ground,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, restitution: 0.2, friction: 1 },
    scene
);

// Player (dark blue ball)
const player = BABYLON.MeshBuilder.CreateSphere("player", { diameter: 2 }, scene);
player.position.y = 2;
const playerMat = new BABYLON.StandardMaterial("playerMat", scene);
playerMat.diffuseColor = new BABYLON.Color3(0, 0, 0.6); // dark blue
player.material = playerMat;
player.physicsImpostor = new BABYLON.PhysicsImpostor(
    player,
    BABYLON.PhysicsImpostor.SphereImpostor,
    { mass: 1, restitution: 0.1, friction: 1 },
    scene
);

// Boxes
for (let i = 0; i < 5; i++) {
    const box = BABYLON.MeshBuilder.CreateBox("box" + i, { size: 1 }, scene);
    box.position = new BABYLON.Vector3(Math.random() * 30 - 15, 1, Math.random() * 30 - 15);
    box.physicsImpostor = new BABYLON.PhysicsImpostor(
        box,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: 0 },
        scene
    );
}

// Walls around the ground
const wallHeight = 5;
const wallThickness = 1;

// North
const wallN = BABYLON.MeshBuilder.CreateBox("wallN", {
    width: groundSize,
    height: wallHeight,
    depth: wallThickness
}, scene);
wallN.position.set(0, wallHeight / 2, -groundSize / 2);
wallN.isVisible = false;
wallN.physicsImpostor = new BABYLON.PhysicsImpostor(wallN, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);

// South
const wallS = wallN.clone("wallS");
wallS.position.z = groundSize / 2;

// West
const wallW = BABYLON.MeshBuilder.CreateBox("wallW", {
    width: wallThickness,
    height: wallHeight,
    depth: groundSize
}, scene);
wallW.position.set(-groundSize / 2, wallHeight / 2, 0);
wallW.isVisible = false;
wallW.physicsImpostor = new BABYLON.PhysicsImpostor(wallW, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);

// East
const wallE = wallW.clone("wallE");
wallE.position.x = groundSize / 2;

// Input tracking
const inputMap = {};
let canJump = true;

scene.actionManager = new BABYLON.ActionManager(scene);
scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, (evt) => {
        inputMap[evt.sourceEvent.key.toLowerCase()] = true;
    })
);
scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => {
        inputMap[evt.sourceEvent.key.toLowerCase()] = false;
    })
);

// Movement + jump
scene.onBeforeRenderObservable.add(() => {
    if (!player || !player.physicsImpostor) return;

    const impulse = new BABYLON.Vector3(0, 0, 0);
    const speed = 0.15;

    if (inputMap["w"] || inputMap["arrowup"]) impulse.z -= speed;
    if (inputMap["s"] || inputMap["arrowdown"]) impulse.z += speed;
    if (inputMap["a"] || inputMap["arrowleft"]) impulse.x -= speed;
    if (inputMap["d"] || inputMap["arrowright"]) impulse.x += speed;

    if (!impulse.equals(BABYLON.Vector3.Zero())) {
        player.physicsImpostor.applyImpulse(impulse, player.getAbsolutePosition());
    }

    // Jump
    if ((inputMap[" "] || inputMap["space"]) && canJump) {
        player.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 0.5, 0), player.getAbsolutePosition());
        canJump = false;
    }

    // Allow jumping again when near ground
    if (player.position.y <= 2.05) {
        canJump = true;
    }
});

engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
