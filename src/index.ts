import Stats from "stats.js";
import {
  Color,
  DirectionalLight,
  DoubleSide,
  Math as TMath,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  RingGeometry,
  Scene,
  WebGLRenderer
} from "three";
import { Random } from "./utils";

// we need this time to display 16777215 colors in a year
const WIDTH = 1280;
const HEIGHT = 1024;
const INTERVAL = 1879.69219;
// let's start with the first milisecond of the current year
const START = new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0).getTime();
const NUM_ELMS = 80;
const GAP = -30;

const toHex = (num: number) =>
  Math.floor(num)
    .toString(16)
    // @ts-ignore
    .padEnd(6, "0");

const numToColor = (num: number): string =>
  "#" + toHex((num / 4294967294) * 16777215);

// we want random... but always the same number
// for the same seed (unique second in the year)
const randomNum = (seed: number): number => new Random(seed).next();

// calculate the seed in this exact moment
const calcSeed = (every, start, time) => Math.floor((time - start) / every);
const colorByIndex = (i, s) => idx =>
  numToColor(randomNum(calcSeed(i, s, s + idx * i)));

const create = geometry => (_, idx) => {
  const color = colorByIndex(INTERVAL, START)(idx);
  const object = new Mesh(
    geometry,
    new MeshBasicMaterial({
      color,
      side: DoubleSide
    })
  );
  object.position.x = -6 + Math.floor(Math.random() * 12);
  object.position.y = 0;
  object.position.z = GAP * idx;
  object.colorIdx = idx;
  return object;
};

const init = (container, camera, scene, renderer, stats) => {
  document.body.appendChild(container);
  document.body.appendChild(stats.dom);
  container.style.width = "800px";
  container.style.height = "600px";
  scene.background = new Color(0x232527);

  const light = new DirectionalLight(0xffffff, 0.6);
  light.position.set(1, 1, 2).normalize();
  scene.add(light);

  const geometry = new RingGeometry(60, 30, 128);
  const els = Array(NUM_ELMS)
    .fill(0)
    .map(create(geometry));

  els.forEach(x => scene.add(x));

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  return els;
};

// const oscilate = d => obj => {
//   obj.position.y = 200 * Math.sin(TMath.degToRad(d));
// };

const render = (C, S, R, objs: Mesh[], d, stats) => {
  stats.begin();

  const radius = 20;
  C.position.x = radius * Math.sin(TMath.degToRad(d));
  C.position.y = radius * Math.sin(TMath.degToRad(d));
  const final = objs.length * GAP;

  for (let i = 0; i < objs.length; i++) {
    const obj = objs[i];
    obj.position.z += 1;

    // swap
    if (obj.position.z > 100) {
      obj.position.z = final;
      obj.colorIdx += NUM_ELMS;
      const color = colorByIndex(INTERVAL, START)(obj.colorIdx);
      obj.material.color.setStyle(new Color(color));
    }
  }

  C.updateMatrixWorld();

  stats.end();

  R.render(S, C);
};

const animate = (C, S, R, objs, x, stats) => () => {
  x += 0.1;
  requestAnimationFrame(animate(C, S, R, objs, x, stats));
  render(camera$, scene$, renderer$, objs, x, stats);
};

const container$ = document.createElement("div");
const camera$ = new PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera$.position.x = 6;
camera$.position.y = 0;

const stats$ = new Stats();
const scene$ = new Scene();
const renderer$ = new WebGLRenderer();
const objs$ = init(container$, camera$, scene$, renderer$, stats$);

animate(camera$, scene$, renderer$, objs$, 0, stats$)();
