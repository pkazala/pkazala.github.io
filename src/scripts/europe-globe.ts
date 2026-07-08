import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const canvases = document.querySelectorAll<HTMLCanvasElement>(
  "[data-europe-globe]",
);

const POLAND = { lat: 52.2297, lon: 19.65 };
const EDINBURGH = { lat: 54.76, lon: -2.6883 };

const RADIUS = 3.1;
const ROUTE_ALTITUDE = 0.19;
const ROUTE_APEX_ALTITUDE = 0.95;
const ROUTE_THICKNESS = 0.0085;
const AIRPORT_MARKER_RADIUS = 0.022;
const GEOJSON_URL = `${import.meta.env.BASE_URL}data/custom.geo.json`;
const PLANE_MODEL_URL = `${import.meta.env.BASE_URL}models/small-lego-plane.glb`;

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const colors = {
  ocean: 0x7bb9ff,
  oceanShadow: 0x2b6fae,
  land: 0x2f8fcd,
  poland: 0xff9b9b,
  uk: 0xb38cff,
  red: 0xe82922,
  yellow: 0xf4c400,
  black: 0x171717,
  silver: 0xbfc4ca,
  glass: 0xbfe9ff,
};

type LonLat = [number, number];
type LinearRing = LonLat[];
type PolygonCoordinates = LinearRing[];
type MultiPolygonCoordinates = PolygonCoordinates[];

type CountryFeature = {
  type: "Feature";
  properties?: Record<string, string | number | null | undefined>;
  geometry:
    | {
        type: "Polygon";
        coordinates: PolygonCoordinates;
      }
    | {
        type: "MultiPolygon";
        coordinates: MultiPolygonCoordinates;
      }
    | null;
};

type FeatureCollection = {
  type: "FeatureCollection";
  features: CountryFeature[];
};

type FlightSample = {
  t: number;
  direction: 1 | -1;
  bank: number;
  turnEase: number;
};

const EUROPE_BOUNDS = {
  minLon: -25,
  maxLon: 45,
  minLat: 34,
  maxLat: 72,
};

canvases.forEach((canvas) => initGlobe(canvas));

function initGlobe(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0.02, 0.62, 5.65);
  camera.lookAt(0, 1.05, 0);

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
  root.position.y = -0.5;
  root.rotation.set(0.52, -0.14, -0.07);
  scene.add(root);

  scene.add(new THREE.HemisphereLight(0x9fd8ff, 0x061b2f, 2.5));

  const key = new THREE.DirectionalLight(0xffffff, 3.4);
  key.position.set(-3, 4, 5);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xbfd7ff, 1.4);
  rim.position.set(4, 1, -2);
  scene.add(rim);

  addGlobeDepthMask(root);
  addOcean(root);
  void addLandPatches(root);
  addRoute(root);

  const plane = createPlaneGroup();
  root.add(plane);
  void loadGltfPlane(plane);

  const routeCurve = createRouteCurve();
  const startTime = performance.now();
  const planeForward = new THREE.Vector3();
  const planeUp = new THREE.Vector3();
  const planeSide = new THREE.Vector3();
  const planeLocalForward = new THREE.Vector3(1, 0, 0);
  const planeRotationMatrix = new THREE.Matrix4();
  const targetPlaneQuaternion = new THREE.Quaternion();
  const bankQuaternion = new THREE.Quaternion();

  const updatePlanePose = (
    sample: FlightSample,
    elapsed: number,
    smoothing: number,
  ) => {
    const position = routeCurve.getPoint(sample.t);
    const tangent = routeCurve
      .getTangent(sample.t)
      .multiplyScalar(sample.direction)
      .normalize();

    plane.position.copy(position);

    const bank = Math.sin(elapsed * 3.6) * 0.05 + sample.bank;
    planeForward.copy(tangent);
    planeUp.copy(position).normalize();
    planeUp
      .addScaledVector(planeForward, -planeUp.dot(planeForward))
      .normalize();
    planeSide.crossVectors(planeForward, planeUp).normalize();
    planeRotationMatrix.makeBasis(planeForward, planeUp, planeSide);
    targetPlaneQuaternion.setFromRotationMatrix(planeRotationMatrix);
    bankQuaternion.setFromAxisAngle(planeLocalForward, bank);
    targetPlaneQuaternion.multiply(bankQuaternion);

    if (smoothing >= 1) {
      plane.quaternion.copy(targetPlaneQuaternion);
    } else {
      plane.quaternion.slerp(targetPlaneQuaternion, smoothing);
    }
  };

  updatePlanePose(sampleFlight(0), 0, 1);

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
    const poseSmoothing = THREE.MathUtils.lerp(0.14, 0.09, sample.turnEase);
    updatePlanePose(sample, elapsed, reduceMotion ? 1 : poseSmoothing);

    const propeller = plane.getObjectByName("propeller");
    if (propeller && !reduceMotion) {
      propeller.rotation.x += 0.58;
    }

    renderer.render(scene, camera);
  });
}

function addGlobeDepthMask(root: THREE.Group) {
  const material = new THREE.MeshBasicMaterial();
  material.colorWrite = false;
  material.depthWrite = true;
  material.depthTest = true;

  const mask = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS * 0.995, 96, 96),
    material,
  );

  mask.renderOrder = -10;
  root.add(mask);
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

async function addLandPatches(root: THREE.Group) {
  const landGroup = new THREE.Group();
  landGroup.name = "real-country-polygons";
  root.add(landGroup);

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
    metalness: 0,
    side: THREE.DoubleSide,
  });

  const ukMaterial = new THREE.MeshStandardMaterial({
    color: colors.uk,
    opacity: 0.74,
    transparent: true,
    roughness: 0.68,
    metalness: 0,
    side: THREE.DoubleSide,
  });

  const borderMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.24,
    depthTest: true,
    depthWrite: false,
  });

  try {
    const geojson = await loadCountriesGeoJson();

    geojson.features.forEach((feature) => {
      if (!feature.geometry) return;

      const material = getCountryMaterial(
        feature,
        landMaterial,
        polandMaterial,
        ukMaterial,
      );

      if (feature.geometry.type === "Polygon") {
        addCountryPolygon(
          landGroup,
          feature.geometry.coordinates,
          material,
          borderMaterial,
        );
      }

      if (feature.geometry.type === "MultiPolygon") {
        feature.geometry.coordinates.forEach((polygon) => {
          addCountryPolygon(landGroup, polygon, material, borderMaterial);
        });
      }
    });
  } catch (error) {
    console.error("Failed to load country GeoJSON:", error);
  }
}

async function loadCountriesGeoJson(): Promise<FeatureCollection> {
  const response = await fetch(GEOJSON_URL);

  if (!response.ok) {
    throw new Error(`Could not fetch ${GEOJSON_URL}: ${response.status}`);
  }

  return response.json() as Promise<FeatureCollection>;
}

function getCountryMaterial(
  feature: CountryFeature,
  landMaterial: THREE.Material,
  polandMaterial: THREE.Material,
  ukMaterial: THREE.Material,
) {
  const code = getCountryCode(feature);
  const name = getCountryName(feature);

  if (code === "POL" || name === "Poland") return polandMaterial;
  if (code === "GBR" || name === "United Kingdom") return ukMaterial;

  return landMaterial;
}

function getCountryCode(feature: CountryFeature) {
  const props = feature.properties ?? {};

  const code =
    props.ISO_A3_EH ??
    props.iso_a3_eh ??
    props.ISO_A3 ??
    props.iso_a3 ??
    props.ADM0_A3 ??
    props.adm0_a3 ??
    props.SOV_A3 ??
    props.sov_a3 ??
    "";

  return String(code).toUpperCase();
}

function getCountryName(feature: CountryFeature) {
  const props = feature.properties ?? {};

  const name =
    props.ADMIN ??
    props.admin ??
    props.NAME_EN ??
    props.name_en ??
    props.NAME_LONG ??
    props.name_long ??
    props.NAME ??
    props.name ??
    "";

  return String(name);
}

function addCountryPolygon(
  root: THREE.Group,
  polygon: PolygonCoordinates,
  fillMaterial: THREE.Material,
  borderMaterial: THREE.LineBasicMaterial,
) {
  const rings = preparePolygonRingsForEurope(polygon);

  if (rings.length === 0) return;

  const mesh = createGeoPolygonMesh(rings, fillMaterial, RADIUS + 0.075);

  if (mesh) {
    mesh.renderOrder = 2;
    root.add(mesh);
  }

  const border = createBorderLine(rings[0], borderMaterial, RADIUS + 0.105);
  border.renderOrder = 3;
  root.add(border);
}

function preparePolygonRingsForEurope(
  polygon: PolygonCoordinates,
): PolygonCoordinates {
  const outer = stripClosingPoint(polygon[0] ?? []);

  if (outer.length < 3) return [];
  if (!ringOverlapsEurope(outer)) return [];

  const outerBounds = getRingBounds(outer);
  if (!outerBounds) return [];

  // Skip obvious far-away / broken northern artifacts.
  // This is mainly to avoid weird Arctic wedges on a Europe-focused globe.
  const outerWidth = outerBounds.maxLon - outerBounds.minLon;
  const outerHeight = outerBounds.maxLat - outerBounds.minLat;

  if (outerBounds.maxLat > 70 && outerWidth > 20 && outerHeight > 8) {
    return [];
  }

  const preparedOuter = densifyRing(outer, 0.45);

  const holes = polygon
    .slice(1)
    .map(stripClosingPoint)
    .filter((ring) => ring.length >= 3)
    .filter(ringOverlapsEurope)
    .map((ring) => densifyRing(ring, 0.45));

  return [preparedOuter, ...holes];
}

function createGeoPolygonMesh(
  rings: PolygonCoordinates,
  material: THREE.Material,
  radius: number,
) {
  let outerRing = [...rings[0]];

  if (!outerRing || outerRing.length < 3) return null;

  let holes = rings
    .slice(1)
    .filter((ring) => ring.length >= 3)
    .map((ring) => [...ring]);

  const outer2D = outerRing.map(([lon, lat]) => new THREE.Vector2(lon, lat));

  // Outer ring should be counter-clockwise for stable triangulation
  if (THREE.ShapeUtils.isClockWise(outer2D)) {
    outerRing.reverse();
    outer2D.reverse();
  }

  const holes2D = holes.map((ring) =>
    ring.map(([lon, lat]) => new THREE.Vector2(lon, lat)),
  );

  // Holes should be clockwise
  holes.forEach((hole, index) => {
    if (!THREE.ShapeUtils.isClockWise(holes2D[index])) {
      hole.reverse();
      holes2D[index].reverse();
    }
  });

  const faces = THREE.ShapeUtils.triangulateShape(outer2D, holes2D);

  const allPoints: LonLat[] = [];
  outerRing.forEach((point) => allPoints.push(point));
  holes.forEach((hole) => {
    hole.forEach((point) => allPoints.push(point));
  });

  const vertices: number[] = [];
  const normals: number[] = [];

  faces.forEach((face) => {
    face.forEach((pointIndex) => {
      const point = allPoints[pointIndex];
      if (!point) return;

      const [lon, lat] = point;
      const position = latLonToVector(lat, lon, radius);

      vertices.push(position.x, position.y, position.z);

      const normal = position.clone().normalize();
      normals.push(normal.x, normal.y, normal.z);
    });
  });

  if (vertices.length === 0) return null;

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.computeBoundingSphere();

  return new THREE.Mesh(geometry, material);
}

function createBorderLine(
  ring: LinearRing,
  material: THREE.LineBasicMaterial,
  radius: number,
) {
  const points = ring.map(([lon, lat]) => latLonToVector(lat, lon, radius));

  if (points.length > 0) {
    points.push(points[0].clone());
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.Line(geometry, material);
}

function stripClosingPoint(ring: LinearRing): LinearRing {
  if (ring.length < 2) return ring;

  const first = ring[0];
  const last = ring[ring.length - 1];

  if (first[0] === last[0] && first[1] === last[1]) {
    return ring.slice(0, -1);
  }

  return ring;
}

function densifyRing(ring: LinearRing, maxStepDegrees: number): LinearRing {
  const dense: LinearRing = [];

  ring.forEach((point, index) => {
    const next = ring[(index + 1) % ring.length];

    const lonDelta = next[0] - point[0];
    const latDelta = next[1] - point[1];

    const distance = Math.hypot(lonDelta, latDelta);
    const steps = Math.max(1, Math.ceil(distance / maxStepDegrees));

    for (let step = 0; step < steps; step++) {
      const t = step / steps;

      dense.push([
        THREE.MathUtils.lerp(point[0], next[0], t),
        THREE.MathUtils.lerp(point[1], next[1], t),
      ]);
    }
  });

  return dense;
}

function ringOverlapsEurope(ring: LinearRing) {
  const bounds = getRingBounds(ring);

  if (!bounds) return false;

  return (
    bounds.maxLon >= EUROPE_BOUNDS.minLon &&
    bounds.minLon <= EUROPE_BOUNDS.maxLon &&
    bounds.maxLat >= EUROPE_BOUNDS.minLat &&
    bounds.minLat <= EUROPE_BOUNDS.maxLat
  );
}

function getRingBounds(ring: LinearRing) {
  if (ring.length === 0) return null;

  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  ring.forEach(([lon, lat]) => {
    minLon = Math.min(minLon, lon);
    maxLon = Math.max(maxLon, lon);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  });

  return { minLon, maxLon, minLat, maxLat };
}

function addRoute(root: THREE.Group) {
  const curve = createRouteCurve();
  const route = createGradientRouteMesh(curve);

  root.add(route);

  [POLAND, EDINBURGH].forEach((place, index) => {
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(AIRPORT_MARKER_RADIUS, 16, 16),
      new THREE.MeshStandardMaterial({
        color: index === 0 ? colors.poland : colors.uk,
        emissive: index === 0 ? 0x7d1d1d : 0x5a2d91,
        emissiveIntensity: 0.1,
        depthWrite: false,
        roughness: 0.3,
      }),
    );

    marker.renderOrder = 2;
    marker.position.copy(
      latLonToVector(place.lat, place.lon, RADIUS + ROUTE_ALTITUDE),
    );
    root.add(marker);
  });
}

function createRouteCurve(altitude = ROUTE_ALTITUDE) {
  const start = latLonToVector(POLAND.lat, POLAND.lon, RADIUS + altitude);
  const end = latLonToVector(EDINBURGH.lat, EDINBURGH.lon, RADIUS + altitude);
  const middle = start
    .clone()
    .add(end)
    .normalize()
    .multiplyScalar(RADIUS + ROUTE_APEX_ALTITUDE);

  return new THREE.QuadraticBezierCurve3(start, middle, end);
}

function createGradientRouteMesh(curve: THREE.Curve<THREE.Vector3>) {
  const tubularSegments = 96;
  const radialSegments = 8;
  const geometry = new THREE.TubeGeometry(
    curve,
    tubularSegments,
    ROUTE_THICKNESS,
    radialSegments,
    false,
  );
  const startColor = new THREE.Color(colors.poland);
  const endColor = new THREE.Color(colors.uk);
  const vertexColors: number[] = [];
  const ringSize = radialSegments + 1;

  for (let index = 0; index < geometry.attributes.position.count; index++) {
    const t = Math.floor(index / ringSize) / tubularSegments;
    const color = startColor.clone().lerp(endColor, t);

    vertexColors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(vertexColors, 3),
  );

  const route = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      vertexColors: true,
      depthTest: true,
      depthWrite: false,
      transparent: true,
      opacity: 0.58,
    }),
  );

  route.renderOrder = 4;

  return route;
}

function sampleFlight(elapsed: number): FlightSample {
  if (reduceMotion) {
    return { t: 0.52, direction: 1, bank: 0, turnEase: 0 };
  }

  const duration = 11;
  const phase = (elapsed % duration) / duration;
  const outbound = phase < 0.5;
  const local = outbound ? phase * 2 : (1 - phase) * 2;
  const t = smootherStep(local);
  const endpointDistance = Math.min(local, 1 - local);
  const turnEase = smootherStep(
    1 - THREE.MathUtils.clamp(endpointDistance / 0.22, 0, 1),
  );

  return {
    t,
    direction: outbound ? 1 : -1,
    bank: Math.sin(phase * Math.PI * 2) * 0.16,
    turnEase,
  };
}

function createPlaneGroup() {
  const plane = new THREE.Group();
  plane.add(createToyPlane());

  return plane;
}

async function loadGltfPlane(plane: THREE.Group) {
  try {
    const loader = new GLTFLoader();
    const loaded = await loader.loadAsync(PLANE_MODEL_URL);
    const model = loaded.scene;

    normalizeGltfPlane(model);
    plane.clear();
    plane.add(model);
  } catch (error) {
    console.warn("Falling back to procedural LEGO plane:", error);
  }
}

function normalizeGltfPlane(model: THREE.Group) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const longestSide = Math.max(size.x, size.y, size.z);
  const targetLength = 0.32;
  const scale = targetLength / longestSide;

  model.scale.setScalar(scale);
  model.rotation.set(Math.PI / 2, 0, 0);
  model.updateMatrixWorld(true);

  const transformedBox = new THREE.Box3().setFromObject(model);
  const transformedCenter = transformedBox.getCenter(new THREE.Vector3());

  model.position.sub(transformedCenter);
  makeGltfPlaneMaterialsUnlit(model);

  model.traverse((child) => {
    child.renderOrder = 8;
  });
}

function makeGltfPlaneMaterialsUnlit(model: THREE.Group) {
  const unlitMaterials = new Map<string, THREE.MeshBasicMaterial>();

  model.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material];
    const convertedMaterials = materials.map((material) => {
      const existing = unlitMaterials.get(material.uuid);

      if (existing) return existing;

      const source = material as THREE.Material & {
        alphaMap?: THREE.Texture | null;
        color?: THREE.Color;
        map?: THREE.Texture | null;
      };

      const converted = new THREE.MeshBasicMaterial({
        alphaMap: source.alphaMap ?? null,
        color: source.color?.clone() ?? new THREE.Color(0xffffff),
        map: source.map ?? null,
        opacity: material.opacity,
        transparent: material.transparent,
        depthTest: material.depthTest,
        depthWrite: material.depthWrite,
        side: material.side,
        toneMapped: false,
      });

      unlitMaterials.set(material.uuid, converted);

      return converted;
    });

    child.material = Array.isArray(child.material)
      ? convertedMaterials
      : convertedMaterials[0];
  });
}

function createToyPlane() {
  const plane = new THREE.Group();
  plane.scale.setScalar(0.118);

  const red = mat(colors.red, 0.32);
  const yellow = mat(colors.yellow, 0.38);
  const black = mat(colors.black, 0.28);
  const silver = mat(colors.silver, 0.22, 0.35);

  const glass = new THREE.MeshPhysicalMaterial({
    color: colors.glass,
    roughness: 0.05,
    transmission: 0.45,
    transparent: true,
    opacity: 0.55,
  });

  addBox(plane, [1.78, 0.3, 0.38], [0, 0, 0], red);
  addBox(plane, [1.34, 0.14, 0.34], [-0.16, -0.22, 0], red);
  addBox(plane, [0.72, 0.12, 2.72], [0.12, 0.03, 0], yellow);
  addBox(plane, [0.62, 0.1, 1.26], [-0.82, 0.1, 0], red);
  addBox(plane, [0.7, 0.18, 0.44], [0.18, 0.28, 0], red);
  addCanopy(plane, [0.5, 0.28, 0.46], [0.34, 0.5, 0], glass);
  addBox(plane, [0.34, 0.14, 0.38], [-0.5, 0.2, 0], red);
  addTailFin(plane, [-0.96, 0.38, 0], red);

  const nose = new THREE.Mesh(
    new THREE.CylinderGeometry(0.21, 0.26, 0.3, 24),
    red,
  );
  nose.rotation.z = Math.PI / 2;
  nose.position.x = 0.98;
  plane.add(nose);

  const engine = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.18, 24),
    silver,
  );
  engine.rotation.z = Math.PI / 2;
  engine.position.x = 1.2;
  plane.add(engine);

  const propeller = new THREE.Group();
  propeller.name = "propeller";
  propeller.position.x = 1.34;

  addBox(propeller, [0.05, 0.62, 0.08], [0, 0, 0], black);
  addBox(propeller, [0.05, 0.08, 0.62], [0, 0, 0], black);

  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.055, 0.045, 18),
    black,
  );
  hub.rotation.z = Math.PI / 2;
  propeller.add(hub);

  plane.add(propeller);

  for (let z = -1.02; z <= 1.02; z += 0.34) {
    addStud(plane, -0.12, 0.16, z, yellow, 0.105);
    addStud(plane, 0.22, 0.16, z, yellow, 0.105);
  }

  addStud(plane, -0.04, 0.44, -0.14, red, 0.085);
  addStud(plane, -0.04, 0.44, 0.14, red, 0.085);
  addStud(plane, -0.74, 0.2, -0.3, red, 0.08);
  addStud(plane, -0.74, 0.2, 0.3, red, 0.08);
  addStud(plane, -0.98, 0.82, 0, red, 0.085);

  plane.traverse((child) => {
    child.renderOrder = 8;
  });

  return plane;
}

function addCanopy(
  group: THREE.Group,
  size: [number, number, number],
  position: [number, number, number],
  material: THREE.Material,
) {
  const [width, height, depth] = size;
  const x = width / 2;
  const y = height / 2;
  const z = depth / 2;
  const topX = x * 0.62;
  const topZ = z * 0.72;

  // prettier-ignore
  const vertices = new Float32Array([
    -x,
    -y,
    -z,
    x,
    -y,
    -z,
    x,
    -y,
    z,
    -x,
    -y,
    z,
    -topX,
    y,
    -topZ,
    topX,
    y,
    -topZ,
    topX,
    y,
    topZ,
    -topX,
    y,
    topZ,
  ]);

  // prettier-ignore
  const indices = [
    0, 1, 2, 0, 2, 3,
    4, 6, 5, 4, 7, 6,
    0, 4, 5, 0, 5, 1,
    1, 5, 6, 1, 6, 2,
    2, 6, 7, 2, 7, 3,
    3, 7, 4, 3, 4, 0,
  ];

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const canopy = new THREE.Mesh(geometry, material);
  canopy.position.set(position[0], position[1], position[2]);
  group.add(canopy);
}

function addTailFin(
  group: THREE.Group,
  position: [number, number, number],
  material: THREE.Material,
) {
  const geometry = new THREE.BufferGeometry();
  // prettier-ignore
  const vertices = new Float32Array([
    -0.18, -0.22, -0.18,
    0.2, -0.22, -0.18,
    0.1, 0.42, -0.14,
    -0.24, 0.42, -0.14,
    -0.18, -0.22, 0.18,
    0.2, -0.22, 0.18,
    0.1, 0.42, 0.14,
    -0.24, 0.42, 0.14,
  ]);
  // prettier-ignore
  const indices = [
    0, 1, 2, 0, 2, 3,
    4, 6, 5, 4, 7, 6,
    0, 4, 5, 0, 5, 1,
    1, 5, 6, 1, 6, 2,
    2, 6, 7, 2, 7, 3,
    3, 7, 4, 3, 4, 0,
  ];

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const fin = new THREE.Mesh(geometry, material);
  fin.position.set(position[0], position[1], position[2]);
  group.add(fin);
}

function addBox(
  group: THREE.Group,
  size: [number, number, number],
  position: [number, number, number],
  material: THREE.Material,
) {
  const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(position[0], position[1], position[2]);

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
  const stud = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, 0.09, 24),
    material,
  );

  stud.position.set(x, y, z);
  group.add(stud);
}

function mat(color: number, roughness: number, metalness = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
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
