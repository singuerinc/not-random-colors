import { interval } from "rxjs";
import { map, scan, startWith } from "rxjs/operators";
import {
  BoxBufferGeometry,
  Color,
  DirectionalLight,
  Math as TMath,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";
import { Random } from "./utils";

// we need this time to display 16777215 colors in a year
const INTERVAL = 1879.69219;

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

const nextRndFrom = (limit: number, time: number): string[] =>
  Array(limit)
    .fill(0)
    .map((v, i) => time + INTERVAL * i)
    .map(numToColor);

// calculate the seed in this exact moment
const calcSeed = (every, start, time) => Math.floor((time - start) / every);
const createCube = geometry => (_, idx) => {
  const object = new Mesh(
    geometry,
    new MeshLambertMaterial({ color: Math.random() * 0xffffff })
  );
  object.position.x = Math.random() * 800 - 400;
  object.position.y = Math.random() * 800 - 400;
  object.position.z = Math.random() * 800 - 400;
  return object;
};

const init = (container, camera, scene, renderer) => {
  document.body.appendChild(container);
  scene.background = new Color(0xf0f0f0);

  const light = new DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  const geometry = new BoxBufferGeometry(20, 20, 20);
  const cubes = Array(5)
    .fill(0)
    .map(createCube(geometry));

  cubes.forEach(x => scene.add(x));

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
};

// const render = (
//   elem1: HTMLDivElement,
//   elem2: HTMLDivElement,
//   color: string,
//   colors: string[]
// ) => {
//   elem1.style.color = color;
//   elem1.innerText = color;
//   elem2.style.backgroundColor = color;
// };

const render = (C, S, R, d) => {
  const radius = 100;
  C.position.x = radius * Math.sin(TMath.degToRad(d));
  C.position.y = radius * Math.sin(TMath.degToRad(d));
  C.position.z = radius * Math.cos(TMath.degToRad(d));
  C.lookAt(S.position);
  C.updateMatrixWorld();
  R.render(S, C);
};

const animate = (C, S, R, x) => () => {
  x += 0.1;
  requestAnimationFrame(animate(C, S, R, x));
  render(camera$, scene$, renderer$, x);
};

// let's start with the first milisecond of the current year
const START = new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0).getTime();

// const txt = document.querySelector<HTMLDivElement>(".color .txt");
// const bg = document.querySelector<HTMLDivElement>(".colors");

let colors = [];
const source = interval(INTERVAL);

source
  .pipe(
    startWith(START),
    scan(() => calcSeed(INTERVAL, START, new Date().getTime())),
    map((x: number) => numToColor(randomNum(x)))
  )
  .subscribe(color => {
    // save latest 5 colors
    colors = [...colors, color].slice(-5);
    // render(txt, bg, color, colors);
  });

const container$ = document.createElement("div");
const camera$ = new PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
const scene$ = new Scene();
const renderer$ = new WebGLRenderer();

init(container$, camera$, scene$, renderer$);
animate(camera$, scene$, renderer$, 0)();
