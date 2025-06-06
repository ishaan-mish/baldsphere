if (typeof THREE === 'undefined') {
  console.error('Three.js not loaded.');
} else {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeeeeee);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.5, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7.5).normalize();
  scene.add(directionalLight);

  const loader = new THREE.GLTFLoader();
  let brain;

  loader.load(
    'Brain.glb',
    function (gltf) {
      brain = gltf.scene;
      scene.add(brain);

      brain.scale.set(1.5, 1.5, 1.5);
      brain.rotation.set(0, 0, 0);
      brain.position.set(0, -1, 0);

      // Hide all arrows initially
      const arrowNames = ['frontal_arrow', 'occipital_arrow', 'parital_arrow', 'temporal_arrow'];
      arrowNames.forEach(name => {
        const arrow = brain.getObjectByName(name);
        if (arrow) arrow.visible = false;
      });

      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.error('Error loading model', error);
    }
  );

  const originGeometry = new THREE.SphereGeometry(0.05, 16, 16);
  const originMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const originSphere = new THREE.Mesh(originGeometry, originMaterial);
  originSphere.position.set(0, 0, 0);
  scene.add(originSphere);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = true;
  controls.enableZoom = true;

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function animate() {
    requestAnimationFrame(animate);
    if (brain) {
      brain.rotation.y += 0.01;
    }
    controls.update();
    renderer.render(scene, camera);
  }

  // Checkbox logic
  window.applyLobeSelection = function () {
    const frontal = document.getElementById('frontalCheck').checked;
    const occipital = document.getElementById('occipitalCheck').checked;
    const temporal = document.getElementById('temporalCheck').checked;
    const parietal = document.getElementById('parietalCheck').checked;

    const arrowStates = {
      'frontal_arrow': frontal,
      'occipital_arrow': occipital,
      'temporal_arrow': temporal,
      'parital_arrow': parietal,
    };

    Object.entries(arrowStates).forEach(([name, visible]) => {
      const arrow = scene.getObjectByName(name);
      if (arrow) arrow.visible = visible;
    });
  };
}
