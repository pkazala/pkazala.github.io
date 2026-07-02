import * as THREE from "three";

const canvases = document.querySelectorAll<HTMLCanvasElement>("[data-europe-globe]");

const POLAND = { lat: 52.2297, lon: 21.0122 };
const EDINBURGH = { lat: 55.9533, lon: -3.1883 };
const RADIUS = 3.1;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const colors = {
  ocean: 0x7bb9ff,
  oceanShadow: 0x2b6fae,
  land: 0x2f8fcd,
  poland: 0xff9b9b,
  uk: 0x9fd0ff,
  route: 0x6aa8ca,
  red: 0xe82922,
  yellow: 0xf4c400,
  blue: 0x00a8df,
  black: 0x171717,
  silver: 0xbfc4ca,
  glass: 0xbfe9ff,
};

type LonLat = [number, number];

const UK_POLYGONS: LonLat[][] = [
  [
    [-5.9, 50.1],
    [-3.6, 50.2],
    [-1.3, 50.8],
    [1.5, 51.6],
    [1.1, 52.8],
    [-0.2, 53.7],
    [-1.0, 54.8],
    [-2.0, 56.0],
    [-3.0, 57.2],
    [-4.4, 58.6],
    [-5.7, 58.4],
    [-6.1, 57.2],
    [-5.2, 56.1],
    [-5.0, 55.0],
    [-4.1, 54.3],
    [-4.8, 53.4],
    [-4.5, 52.4],
    [-5.6, 51.5],
  ],
  [
    [-10.4, 51.4],
    [-8.6, 51.2],
    [-6.5, 52.0],
    [-5.8, 53.2],
    [-6.1, 54.4],
    [-7.2, 55.4],
    [-8.5, 55.3],
    [-9.7, 54.3],
    [-10.2, 52.9],
  ],
];

const POLAND_POLYGONS: LonLat[][] = [
  [
    [14.1, 49.1],
    [16.3, 50.0],
    [18.0, 49.5],
    [19.8, 49.3],
    [22.8, 49.1],
    [24.2, 50.2],
    [23.7, 52.2],
    [23.0, 54.2],
    [20.1, 54.9],
    [17.3, 54.8],
    [14.2, 53.9],
    [14.1, 51.6],
  ],
];

const EUROPE_POLYGONS: LonLat[][] = [
  ...UK_POLYGONS,
  ...POLAND_POLYGONS,
  [
    [-9.4, 36.0],
    [-7.0, 36.1],
    [-4.4, 36.7],
    [-1.7, 37.2],
    [1.8, 41.1],
    [3.2, 42.4],
    [1.5, 43.5],
    [-1.8, 43.7],
    [-5.2, 43.5],
    [-8.8, 42.0],
    [-9.6, 39.1],
  ],
  [
    [-5.3, 43.3],
    [-1.2, 43.6],
    [2.0, 42.6],
    [6.1, 43.2],
    [7.6, 45.7],
    [7.2, 48.2],
    [4.4, 50.0],
    [1.5, 50.9],
    [-1.1, 50.4],
    [-3.0, 48.8],
    [-4.6, 47.4],
    [-4.8, 45.5],
  ],
  [
    [4.6, 48.0],
    [8.5, 47.2],
    [10.5, 47.4],
    [13.4, 48.3],
    [16.0, 48.0],
    [18.7, 49.2],
    [17.0, 51.2],
    [13.0, 52.8],
    [9.0, 53.8],
    [5.6, 53.2],
    [2.7, 51.4],
  ],
  [
    [6.8, 44.0],
    [9.1, 44.4],
    [12.0, 43.7],
    [13.8, 41.9],
    [15.8, 39.9],
    [18.4, 40.1],
    [18.0, 41.8],
    [15.0, 43.9],
    [13.0, 45.8],
    [10.4, 46.4],
    [7.7, 45.6],
  ],
  [
    [10.0, 54.0],
    [13.2, 54.5],
    [16.5, 54.9],
    [20.6, 55.0],
    [24.8, 57.0],
    [27.4, 59.4],
    [24.0, 60.7],
    [18.0, 60.4],
    [12.0, 58.2],
    [9.0, 56.0],
  ],
  [
    [5.0, 58.0],
    [7.8, 57.2],
    [10.6, 58.4],
    [13.0, 60.2],
    [17.4, 62.0],
    [22.6, 64.3],
    [27.2, 63.2],
    [30.8, 61.4],
    [28.5, 59.0],
    [24.1, 57.2],
    [18.5, 56.3],
    [13.6, 55.2],
    [10.2, 54.5],
    [6.8, 55.0],
  ],
  [
    [13.8, 45.2],
    [17.5, 45.0],
    [20.0, 44.4],
    [23.0, 43.2],
    [27.6, 42.4],
    [29.5, 44.2],
    [28.5, 47.0],
    [25.0, 48.2],
    [21.0, 48.8],
    [17.0, 47.8],
    [14.0, 46.5],
  ],
  [
    [19.0, 54.2],
    [24.6, 54.5],
    [31.8, 55.5],
    [33.2, 53.0],
    [31.0, 50.2],
    [27.5, 48.0],
    [23.5, 47.2],
    [20.5, 49.1],
    [22.0, 51.5],
  ],
  [
    [21.0, 37.1],
    [23.6, 37.7],
    [25.0, 39.2],
    [23.5, 41.0],
    [21.0, 40.6],
    [19.4, 39.0],
  ],
];

canvases.forEach((canvas) => initGlobe(canvas));

function initGlobe(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0.04, 0.7, 6.15);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  const root = new THREE.Group();
  root.position.y = -0.92;
  root.rotation.set(0.58, -0.16, -0.07);
  scene.add(root);

  scene.add(new THREE.HemisphereLight(0x9fd8ff, 0x061b2f, 2.5));
  const key = new THREE.DirectionalLight(0xffffff, 3.4);
  key.position.set(-3, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xbfd7ff, 1.4);
  rim.position.set(4, 1, -2);
  scene.add(rim);

  addOcean(root);
  addLandPatches(root);
  addRoute(root);

  const plane = createToyPlane();
  root.add(plane);

  const routeCurve = createRouteCurve();
  const startTime = performance.now();

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  };

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  renderer.setAnimationLoop(() => {
    const elapsed = (performance.now() - startTime) / 1000;

    const sample = sampleFlight(elapsed);
    const position = routeCurve.getPoint(sample.t);
    const tangent = routeCurve.getTangent(sample.t).multiplyScalar(sample.direction).normalize();
    plane.position.copy(position);
    plane.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), tangent);
    plane.rotateZ(Math.sin(elapsed * 3.6) * 0.05 + sample.bank);

    const propeller = plane.getObjectByName("propeller");
    if (propeller && !reduceMotion) propeller.rotation.x += 0.58;

    renderer.render(scene, camera);
  });
}

function addOcean(root: THREE.Group) {
  const ocean = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS, 96, 96),
    new THREE.MeshStandardMaterial({
      color: colors.ocean,
      opacity: 0.1,
      transparent: true,
      metalness: 0,
      roughness: 0.48,
      depthWrite: false,
    }),
  );
  root.add(ocean);

  const shade = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS * 1.003, 96, 96),
    new THREE.MeshBasicMaterial({
      color: colors.oceanShadow,
      opacity: 0.04,
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
    }),
  );
  root.add(shade);
}

function addLandPatches(root: THREE.Group) {
  const landMaterial = new THREE.MeshStandardMaterial({
    color: colors.land,
    opacity: 0.42,
    transparent: true,
    roughness: 0.72,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  const polandMaterial = new THREE.MeshStandardMaterial({
    color: colors.poland,
    opacity: 0.74,
    transparent: true,
    roughness: 0.68,
    side: THREE.DoubleSide,
  });
  const ukMaterial = new THREE.MeshStandardMaterial({
    color: colors.uk,
    opacity: 0.74,
    transparent: true,
    roughness: 0.68,
    side: THREE.DoubleSide,
  });

  EUROPE_POLYGONS.forEach((polygon) => {
    root.add(createPolygonPatch(polygon, landMaterial, RADIUS + 0.07));
  });
  POLAND_POLYGONS.forEach((polygon) => {
    root.add(createPolygonPatch(polygon, polandMaterial, RADIUS + 0.09));
  });
  UK_POLYGONS.forEach((polygon) => {
    root.add(createPolygonPatch(polygon, ukMaterial, RADIUS + 0.09));
  });
}

function addRoute(root: THREE.Group) {
  const curve = createRouteCurve();
  const points = curve.getPoints(80);
  const route = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({
      color: colors.route,
      depthTest: false,
      transparent: true,
      opacity: 0.7,
    }),
  );
  root.add(route);

  [POLAND, EDINBURGH].forEach((place, index) => {
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 16, 16),
      new THREE.MeshStandardMaterial({
        color: index === 0 ? colors.poland : colors.uk,
        emissive: index === 0 ? 0x7d1d1d : 0x1a4b89,
        emissiveIntensity: 0.1,
        roughness: 0.3,
      }),
    );
    marker.position.copy(latLonToVector(place.lat, place.lon, RADIUS + 0.18));
    root.add(marker);
  });
}

function createRouteCurve() {
  const start = latLonToVector(POLAND.lat, POLAND.lon, RADIUS + 0.28);
  const end = latLonToVector(EDINBURGH.lat, EDINBURGH.lon, RADIUS + 0.28);
  const middle = start.clone().add(end).normalize().multiplyScalar(RADIUS + 0.95);
  return new THREE.QuadraticBezierCurve3(start, middle, end);
}

function sampleFlight(elapsed: number) {
  if (reduceMotion) return { t: 0.52, direction: 1, bank: 0 };

  const duration = 11;
  const phase = (elapsed % duration) / duration;
  const outbound = phase < 0.5;
  const local = outbound ? phase * 2 : (1 - phase) * 2;
  const t = smootherStep(local);
  const turn = Math.max(
    0,
    1 - Math.min(local, 1 - local) / 0.18,
  );

  return {
    t,
    direction: outbound ? 1 : -1,
    bank: (outbound ? 1 : -1) * turn * 0.34,
  };
}

function createToyPlane() {
  const plane = new THREE.Group();
  plane.scale.setScalar(0.125);

  const red = mat(colors.red, 0.32);
  const yellow = mat(colors.yellow, 0.38);
  const blue = mat(colors.blue, 0.35);
  const black = mat(colors.black, 0.28);
  const silver = mat(colors.silver, 0.22, 0.35);
  const glass = new THREE.MeshPhysicalMaterial({
    color: colors.glass,
    roughness: 0.05,
    transmission: 0.45,
    transparent: true,
    opacity: 0.55,
  });

  addBox(plane, [1.35, 0.34, 0.34], [0, 0, 0], red);
  addBox(plane, [0.52, 0.14, 0.36], [-0.05, -0.27, 0], blue);
  addBox(plane, [0.58, 0.1, 2.42], [0.05, 0.02, 0], yellow);
  addBox(plane, [0.42, 0.08, 1.0], [-0.72, 0.16, 0], yellow);
  addBox(plane, [0.1, 0.55, 0.36], [-0.82, 0.4, 0], red);
  addBox(plane, [0.34, 0.18, 0.32], [0.28, 0.28, 0], glass);

  const nose = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.26, 24), red);
  nose.rotation.z = Math.PI / 2;
  nose.position.x = 0.78;
  plane.add(nose);

  const engine = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.16, 24), silver);
  engine.rotation.z = Math.PI / 2;
  engine.position.x = 0.98;
  plane.add(engine);

  const propeller = new THREE.Group();
  propeller.name = "propeller";
  propeller.position.x = 1.09;
  addBox(propeller, [0.04, 0.4, 0.06], [0, 0, 0], black);
  addBox(propeller, [0.04, 0.06, 0.4], [0, 0, 0], black);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.045, 18), black);
  hub.rotation.z = Math.PI / 2;
  propeller.add(hub);
  plane.add(propeller);

  for (let z = -0.9; z <= 0.9; z += 0.36) {
    addStud(plane, -0.08, 0.13, z, yellow, 0.12);
    addStud(plane, 0.24, 0.13, z, yellow, 0.12);
  }
  addStud(plane, -0.46, 0.23, -0.25, red, 0.1);
  addStud(plane, -0.46, 0.23, 0.25, red, 0.1);
  addStud(plane, -0.74, 0.24, -0.28, yellow, 0.09);
  addStud(plane, -0.74, 0.24, 0.28, yellow, 0.09);

  return plane;
}

function addBox(
  group: THREE.Group,
  size: [number, number, number],
  position: [number, number, number],
  material: THREE.Material,
  radius = 0.03,
) {
  const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(position[0], position[1], position[2]);
  mesh.userData.radius = radius;
  group.add(mesh);
  return mesh;
}

function addStud(
  group: THREE.Group,
  x: number,
  y: number,
  z: number,
  material: THREE.Material,
  radius = 0.09,
) {
  const stud = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.09, 24), material);
  stud.position.set(x, y, z);
  group.add(stud);
}

function mat(color: number, roughness: number, metalness = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function createPolygonPatch(polygon: LonLat[], material: THREE.Material, radius: number) {
  const smoothPolygon = densifyPolygon(polygon, 0.65);
  const points = smoothPolygon.map(([lon, lat]) => new THREE.Vector2(lon, lat));
  const faces = THREE.ShapeUtils.triangulateShape(points, []);
  const vertices: number[] = [];
  const normals: number[] = [];

  faces.forEach((face) => {
    face.forEach((pointIndex) => {
      const [lon, lat] = smoothPolygon[pointIndex];
      const position = latLonToVector(lat, lon, radius);
      vertices.push(position.x, position.y, position.z);
      const normal = position.clone().normalize();
      normals.push(normal.x, normal.y, normal.z);
    });
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.computeBoundingSphere();

  return new THREE.Mesh(geometry, material);
}

function densifyPolygon(polygon: LonLat[], maxStep: number) {
  const points: LonLat[] = [];

  polygon.forEach((point, index) => {
    const next = polygon[(index + 1) % polygon.length];
    const lonDelta = next[0] - point[0];
    const latDelta = next[1] - point[1];
    const steps = Math.max(1, Math.ceil(Math.hypot(lonDelta, latDelta) / maxStep));

    for (let step = 0; step < steps; step++) {
      const t = step / steps;
      const eased = smootherStep(t);
      points.push([
        THREE.MathUtils.lerp(point[0], next[0], eased),
        THREE.MathUtils.lerp(point[1], next[1], eased),
      ]);
    }
  });

  return points;
}

function smootherStep(t: number) {
  const x = THREE.MathUtils.clamp(t, 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
}

function latLonToVector(lat: number, lon: number, radius: number) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.cos(theta),
  );
}
