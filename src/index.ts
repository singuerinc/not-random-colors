import { Random } from "./utils";

const txt = document.querySelector(".color .txt") as HTMLDivElement;
const ul = document.querySelector(".colors") as HTMLDivElement;

const INTERVAL = 1879.69219;
const start = new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0).getTime();
const color = rnd =>
  "#" + Math.floor((rnd / 4294967294) * 16777215).toString(16);
const random = seed => new Random(seed).next();

const render = c => {
  txt.style.color = c;
  txt.innerText = c;
  ul.style.backgroundColor = c;
};

setInterval(() => {
  const now = new Date().getTime();
  const seed = Math.floor((now - start) / INTERVAL);
  const r = random(seed);
  const c = color(r);

  render(c);
}, INTERVAL);
