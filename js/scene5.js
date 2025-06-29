const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
let currentScene = null;
let switchBtn = document.getElementById("switchBtn");
switchBtn.style.display = "none";
const toggleMusicBtn = document.createElement("button");
toggleMusicBtn.innerText = "Toggle Music";
toggleMusicBtn.style.position = "absolute";
toggleMusicBtn.style.top = "140px";
toggleMusicBtn.style.right = "15px";
toggleMusicBtn.style.zIndex = 10;
toggleMusicBtn.style.padding = "8px 16px";
toggleMusicBtn.style.background = "#00ffff";
toggleMusicBtn.style.color = "#000";
toggleMusicBtn.style.border = "none";
toggleMusicBtn.style.borderRadius = "6px";
toggleMusicBtn.style.fontWeight = "bold";
toggleMusicBtn.style.cursor = "pointer";
document.body.appendChild(toggleMusicBtn);

let musicOn = false;
const audio = new Audio("js/assets/music.mp3");
audio.loop = true;
audio.autoplay = false;

toggleMusicBtn.addEventListener("click", () => {
  if (musicOn) {
    audio.pause();
  } else {
    audio.play();
  }
  musicOn = !musicOn;
});

// MUSIC SETUP
let music;
function initMusic(scene) {
  music = new BABYLON.Sound("music", "js/assets/music.mp3", scene, null, {
    loop: true,
    autoplay: false,
    volume: 0.4,
  });

  const toggleBtn = document.createElement("button");
  toggleBtn.innerText = "Toggle Music";
  toggleBtn.style.position = "absolute";
  toggleBtn.style.top = "20px";
  toggleBtn.style.right = "15px";
  toggleBtn.style.zIndex = 10;
  toggleBtn.style.padding = "8px 16px";
  toggleBtn.style.background = "#ffc107";
  toggleBtn.style.color = "#000";
  toggleBtn.style.border = "none";
  toggleBtn.style.borderRadius = "6px";
  toggleBtn.style.fontWeight = "bold";
  toggleBtn.style.cursor = "pointer";

  toggleBtn.addEventListener("click", () => {
    if (music.isPlaying) {
      music.pause();
    } else {
      music.play();
    }
  });

  document.body.appendChild(toggleBtn);
}

function showSceneMenu() {
  switchBtn.style.display = "none";
const toggleMusicBtn = document.createElement("button");
toggleMusicBtn.innerText = "Toggle Music";
toggleMusicBtn.style.position = "absolute";
toggleMusicBtn.style.top = "140px";
toggleMusicBtn.style.right = "15px";
toggleMusicBtn.style.zIndex = 10;
toggleMusicBtn.style.padding = "8px 16px";
toggleMusicBtn.style.background = "#00ffff";
toggleMusicBtn.style.color = "#000";
toggleMusicBtn.style.border = "none";
toggleMusicBtn.style.borderRadius = "6px";
toggleMusicBtn.style.fontWeight = "bold";
toggleMusicBtn.style.cursor = "pointer";
document.body.appendChild(toggleMusicBtn);

let musicOn = false;
const audio = new Audio("js/assets/music.mp3");
audio.loop = true;
audio.autoplay = false;

toggleMusicBtn.addEventListener("click", () => {
  if (musicOn) {
    audio.pause();
  } else {
    audio.play();
  }
  musicOn = !musicOn;
});
  const overlay = document.createElement("div");
  overlay.id = "menuOverlay";
  overlay.style.position = "absolute";
  overlay.style.top = "50%";
  overlay.style.left = "50%";
  overlay.style.transform = "translate(-50%, -50%)";
  overlay.style.background = "rgba(0,0,0,0.8)";
  overlay.style.padding = "20px";
  overlay.style.borderRadius = "10px";
  overlay.style.zIndex = 20;
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.gap = "10px";

  const btnA = document.createElement("button");
  btnA.innerText = "Start Particle Garden";
  btnA.onclick = () => {
    document.body.removeChild(overlay);
    startSceneA();
  };

  const btnB = document.createElement("button");
  btnB.innerText = "Start Target Smash";
  btnB.onclick = () => {
    document.body.removeChild(overlay);
    startSceneB();
  };

  [btnA, btnB].forEach(btn => {
    btn.style.padding = "10px";
    btn.style.fontSize = "16px";
    btn.style.fontWeight = "bold";
    btn.style.cursor = "pointer";
    btn.style.border = "none";
    btn.style.borderRadius = "6px";
    btn.style.background = "#00ffff";
    btn.style.color = "black";
  });

  overlay.appendChild(btnA);
  overlay.appendChild(btnB);
  document.body.appendChild(overlay);
}

function startSceneA() {
  switchBtn.style.display = "block";
  switchBtn.innerText = "Switch to Target Smash";
  if (currentScene) currentScene.dispose();
  const scene = new BABYLON.Scene(engine);
  currentScene = scene;

  const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.5, 25, new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);

  const background = new BABYLON.Layer("bg", "https://images.unsplash.com/photo-1506744038136-46273834b3fb", scene);
  background.isBackground = true;

  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
  light.intensity = 0.8;

  for (let i = 0; i < 5; i++) {
    const sphere = BABYLON.MeshBuilder.CreateSphere("core" + i, { diameter: 2 }, scene);
    sphere.position = new BABYLON.Vector3(Math.random() * 10 - 5, 0, Math.random() * 10 - 5);
    const mat = new BABYLON.StandardMaterial("mat" + i, scene);
    mat.emissiveColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    sphere.material = mat;

    const particleSystem = new BABYLON.ParticleSystem("particles" + i, 2000, scene);
    particleSystem.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", scene);
    particleSystem.emitter = sphere;
    particleSystem.minEmitBox = new BABYLON.Vector3(-1, -1, -1);
    particleSystem.maxEmitBox = new BABYLON.Vector3(1, 1, 1);
    particleSystem.color1 = new BABYLON.Color4(Math.random(), Math.random(), Math.random(), 1.0);
    particleSystem.color2 = new BABYLON.Color4(Math.random(), Math.random(), Math.random(), 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
    particleSystem.minSize = 0.3;
    particleSystem.maxSize = 1.0;
    particleSystem.minLifeTime = 0.5;
    particleSystem.maxLifeTime = 1.5;
    particleSystem.emitRate = 500;
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    particleSystem.gravity = new BABYLON.Vector3(0, -1, 0);
    particleSystem.direction1 = new BABYLON.Vector3(-1, 1, -1);
    particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;
    particleSystem.updateSpeed = 0.015;
    particleSystem.start();
  }

  initMusic(scene);
}

function startSceneB() {
  switchBtn.style.display = "block";
  switchBtn.innerText = "Switch to Particle Garden";
  if (currentScene) currentScene.dispose();
  const scene = new BABYLON.Scene(engine);
  currentScene = scene;
  canvas.classList.add("target-mode");

  let score = 0;
  let misses = 0;
  let startTime = Date.now();

  const statsDisplay = document.getElementById("statsDisplay");
  statsDisplay.style.display = "block";

  const clickSound = new Audio("js/assets/click.mp3");

  function updateStats() {
    const time = Math.floor((Date.now() - startTime) / 1000);
    statsDisplay.innerText = `Score: ${score} | Misses: ${misses} | Time: ${time}s`;
  }

  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, -20), scene);
  camera.setTarget(BABYLON.Vector3.Zero());

  const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

  const targetColors = [BABYLON.Color3.Red(), BABYLON.Color3.Blue(), BABYLON.Color3.Yellow(), BABYLON.Color3.Green()];
  const targetSize = 1;

  function spawnTarget() {
    const target = BABYLON.MeshBuilder.CreateSphere("target", { diameter: targetSize }, scene);
    target.position = new BABYLON.Vector3(Math.random() * 8 - 4, Math.random() * 8 - 4, 0);
    const mat = new BABYLON.StandardMaterial("targetMat", scene);
    mat.diffuseColor = targetColors[Math.floor(Math.random() * targetColors.length)];
    target.material = mat;

    const timeout = setTimeout(() => {
      if (scene.meshes.includes(target)) {
        target.dispose();
        misses++;
        updateStats();
        if (misses >= 3) {
          alert("Too many misses! Restarting...");
          startSceneB();
        }
      }
  }, 1500);

    target.actionManager = new BABYLON.ActionManager(scene);
    target.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
      clearTimeout(timeout);
      if (!target.isDisposed()) {
        target.dispose();
        clickSound.currentTime = 0;
        clickSound.play();
        score++;
        updateStats();
        if (score >= 30) showSceneMenu();
      }
    }));
  }

  scene.onPointerDown = function () {
    if (scene) {
      const pick = scene.pick(scene.pointerX, scene.pointerY);
      if (pick.hit && pick.pickedMesh.name.includes("target")) {
        pick.pickedMesh.actionManager.processTrigger(BABYLON.ActionManager.OnPickTrigger);
      }
    }
  };

  setInterval(spawnTarget, 1000);
  updateStats();
}

// Toggle between A and B
switchBtn.addEventListener("click", () => {
  if (currentScene && currentScene.meshes.some(m => m.name.includes("target"))) {
    startSceneA();
  } else {
    startSceneB();
  }
});

showSceneMenu();
engine.runRenderLoop(() => currentScene && currentScene.render());
window.addEventListener("resize", () => engine.resize());