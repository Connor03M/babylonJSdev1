const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);
scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());

const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.5, 30, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

let musicAudio = document.createElement("audio");
musicAudio.src = "js/assets/music.mp3";
musicAudio.loop = true;
musicAudio.volume = 0.5;
musicAudio.preload = "auto";
musicAudio.style.display = "none";
document.body.appendChild(musicAudio);

let musicEnabled = false;

const musicToggleBtn = document.createElement("button");
musicToggleBtn.innerText = "Enable Music";
musicToggleBtn.style.position = "absolute";
musicToggleBtn.style.top = "140px";
musicToggleBtn.style.right = "10px";
musicToggleBtn.style.zIndex = "10";
musicToggleBtn.style.padding = "8px 16px";
musicToggleBtn.style.fontSize = "14px";
musicToggleBtn.style.backgroundColor = "#ffcc00";
musicToggleBtn.style.border = "none";
musicToggleBtn.style.borderRadius = "6px";
musicToggleBtn.style.cursor = "pointer";
musicToggleBtn.style.fontWeight = "bold";
document.body.appendChild(musicToggleBtn);

musicToggleBtn.addEventListener("click", () => {
  musicEnabled = !musicEnabled;
  musicToggleBtn.innerText = musicEnabled ? "Disable Music" : "Enable Music";

  if (musicEnabled) {
    musicAudio.play().then(() => {
      console.log("Music started.");
    }).catch((err) => {
      console.error("Music play failed.", err);
    });
  } else {
    musicAudio.pause();
    console.log("Music paused.");
  }
});

function showMessage(text) {
  const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  const message = new BABYLON.GUI.TextBlock();
  message.text = text;
  message.color = "white";
  message.fontSize = 48;
  message.top = "40%";
  advancedTexture.addControl(message);
  setTimeout(() => advancedTexture.removeControl(message), 5000);
}

function hideButtons() {
  const menu = document.getElementById("mode-select");
  if (menu) menu.style.display = "none";
}

function clearScene() {
  scene.meshes.slice().forEach(m => m.dispose());
  scene.onBeforeRenderObservable.clear();
}

function createText(text) {
  const gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  const msg = new BABYLON.GUI.TextBlock();
  msg.text = text;
  msg.color = "white";
  msg.fontSize = 36;
  gui.addControl(msg);
  return gui;
}

function startPlatformer() {
  hideButtons();
  clearScene();

  const camera = new BABYLON.UniversalCamera("cam", new BABYLON.Vector3(0, 10, -20), scene);
  camera.attachControl(canvas, true);
  camera.speed = 0;
  scene.activeCamera = camera;

  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
  light.intensity = 0.8;

  const platformCount = 5;
  const platformGap = 10;
  const platformHeight = 2;
  let lastPlatform = null;

  for (let i = 0; i < platformCount; i++) {
    const platform = BABYLON.MeshBuilder.CreateBox("platform" + i, { width: 6, depth: 6, height: 1 }, scene);
    platform.position = new BABYLON.Vector3(i * platformGap, i * platformHeight, 0);

    const mat = new BABYLON.StandardMaterial("platMat" + i, scene);
    mat.diffuseColor = i === platformCount - 1 ? BABYLON.Color3.Green() : BABYLON.Color3.Gray();
    platform.material = mat;

    platform.physicsImpostor = new BABYLON.PhysicsImpostor(platform, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);

    if (i === platformCount - 1) lastPlatform = platform;
  }

  const player = BABYLON.MeshBuilder.CreateSphere("player", { diameter: 2 }, scene);
  player.position = new BABYLON.Vector3(0, 5, 0);
  const playerMat = new BABYLON.StandardMaterial("playerMat", scene);
  playerMat.diffuseColor = BABYLON.Color3.Blue();
  player.material = playerMat;
  player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1 }, scene);

  scene.registerBeforeRender(() => {
    camera.position = player.position.add(new BABYLON.Vector3(0, 10, -20));
    camera.setTarget(player.position);
  });

  const inputMap = {};
  scene.actionManager = new BABYLON.ActionManager(scene);
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, e => inputMap[e.sourceEvent.key.toLowerCase()] = true));
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, e => inputMap[e.sourceEvent.key.toLowerCase()] = false));

  let canJump = true;
  scene.onBeforeRenderObservable.add(() => {
    const forward = camera.getForwardRay().direction;
    const camForward = new BABYLON.Vector3(forward.x, 0, forward.z).normalize();
    const camRight = BABYLON.Vector3.Cross(BABYLON.Axis.Y, forward).normalize();
    const impulse = new BABYLON.Vector3.Zero();
    const speed = 8;

    if (inputMap["w"]) impulse.addInPlace(camForward.scale(speed));
    if (inputMap["s"]) impulse.addInPlace(camForward.scale(-speed));
    if (inputMap["a"]) impulse.addInPlace(camRight.scale(-speed));
    if (inputMap["d"]) impulse.addInPlace(camRight.scale(speed));

    if ((inputMap[" "] || inputMap["space"]) && canJump) {
      player.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 5, 0), player.getAbsolutePosition());
      canJump = false;
      setTimeout(() => canJump = true, 800);
    }

    if (!impulse.equals(BABYLON.Vector3.Zero())) {
      player.physicsImpostor.applyForce(impulse, player.getAbsolutePosition());
    }

    if (lastPlatform && player.intersectsMesh(lastPlatform, false)) {
      showMessage("You win!");
      scene.onBeforeRenderObservable.clear();
    }
  });
}

function startSurvival() {
  hideButtons();
  clearScene();

  const floor = BABYLON.MeshBuilder.CreateGround("floor", { width: 30, height: 30 }, scene);
  floor.material = new BABYLON.StandardMaterial("floorMat", scene);
  floor.material.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
  floor.physicsImpostor = new BABYLON.PhysicsImpostor(floor, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);

  const wallData = [
    { x: 0, z: -15 }, { x: 0, z: 15 },
    { x: -15, z: 0 }, { x: 15, z: 0 }
  ];

  wallData.forEach(data => {
    const wall = BABYLON.MeshBuilder.CreateBox("wall", { width: 30, height: 5, depth: 1 }, scene);
    wall.position = new BABYLON.Vector3(data.x, 2.5, data.z);
    wall.rotation.y = data.z === 0 ? Math.PI / 2 : 0;
    wall.material = new BABYLON.StandardMaterial("wallMat", scene);
    wall.material.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    wall.physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
  });

  const player = BABYLON.MeshBuilder.CreateSphere("player", { diameter: 2 }, scene);
  player.position.y = 2;
  player.material = new BABYLON.StandardMaterial("playerMat", scene);
  player.material.diffuseColor = BABYLON.Color3.Yellow();
  player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1 }, scene);

  const keys = {};
  scene.actionManager = new BABYLON.ActionManager(scene);
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, e => keys[e.sourceEvent.key.toLowerCase()] = true));
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, e => keys[e.sourceEvent.key.toLowerCase()] = false));

  let hit = false;
  const obstacles = [];

  const obstacleLoop = setInterval(() => {
    if (hit) return;
    const box = BABYLON.MeshBuilder.CreateBox("fall", { size: 2 }, scene);
    box.position = new BABYLON.Vector3(Math.random() * 24 - 12, 20, Math.random() * 24 - 12);
    box.material = new BABYLON.StandardMaterial("boxMat", scene);
    box.material.diffuseColor = BABYLON.Color3.Red();
    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1 }, scene);
    obstacles.push(box);
  }, 1000);

  const gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  const info = new BABYLON.GUI.TextBlock();
  info.text = "Avoid the falling obstacles for 20 seconds!";
  info.color = "white";
  info.fontSize = 24;
  gui.addControl(info);

  const timerText = new BABYLON.GUI.TextBlock();
  timerText.text = "Time: 20";
  timerText.color = "white";
  timerText.fontSize = 28;
  timerText.top = "40px";
  gui.addControl(timerText);

  let timeLeft = 20;
  const countdown = setInterval(() => {
    if (hit) return;
    timeLeft--;
    timerText.text = "Time: " + timeLeft;
    if (timeLeft <= 0) {
      clearInterval(countdown);
      clearInterval(obstacleLoop);
      gui.dispose();
      createText("You win!");
    }
  }, 1000);

  scene.onBeforeRenderObservable.add(() => {
    if (hit || !player.physicsImpostor) return;

    const forward = camera.getForwardRay().direction;
    const camForward = new BABYLON.Vector3(forward.x, 0, forward.z).normalize();
    const camRight = BABYLON.Vector3.Cross(BABYLON.Axis.Y, forward).normalize();
    const impulse = new BABYLON.Vector3.Zero();
    const speed = 10;

    if (keys["w"]) impulse.addInPlace(camForward.scale(speed));
    if (keys["s"]) impulse.addInPlace(camForward.scale(-speed));
    if (keys["a"]) impulse.addInPlace(camRight.scale(-speed));
    if (keys["d"]) impulse.addInPlace(camRight.scale(speed));

    if (!impulse.equals(BABYLON.Vector3.Zero())) {
      player.physicsImpostor.applyForce(impulse, player.getAbsolutePosition());
    }

    for (let obs of obstacles) {
      if (player.intersectsMesh(obs, false)) {
        hit = true;
        clearInterval(countdown);
        clearInterval(obstacleLoop);
        gui.dispose();
        obstacles.forEach(o => o.dispose());
        startSurvival();
      }
    }
  });

  camera.setTarget(player);
}

engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
