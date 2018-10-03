import { Random } from "./utils";

function rndColor(rnd: number): string {
  const rgbColors = 16777215;
  return (
    "#" +
    Math.floor((rnd / 4294967294) * rgbColors)
      .toString(16)
      .padEnd(6, "0")
  );
}

function random(seed: number): number {
  return new Random(seed).next();
}

function render(elem1: HTMLDivElement, elem2: HTMLDivElement, color: string) {
  elem1.style.color = color;
  elem1.innerText = color;
  elem2.style.backgroundColor = color;
}

const INTERVAL = 1879.69219;
const start = new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0).getTime();
const txt = document.querySelector<HTMLDivElement>(".color .txt");
const bg = document.querySelector<HTMLDivElement>(".colors");

setInterval(() => {
  const now = new Date().getTime();
  const seed = Math.floor((now - start) / INTERVAL);
  const r = random(seed);
  const color = rndColor(r);

  render(txt, bg, color);
}, INTERVAL);

// render(txt, bg, "#212325");
