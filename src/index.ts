import { interval } from "rxjs";
import { map, scan, startWith } from "rxjs/operators";
import { Random } from "./utils";

const INTERVAL = 1879.69219;
const toHex = (num: number) =>
  Math.floor(num)
    .toString(16)
    // @ts-ignore
    .padEnd(6, "0");

const rndToColor = (rnd: number): string =>
  "#" + toHex((rnd / 4294967294) * 16777215);

const random = (seed: number): number => new Random(seed).next();

const nextRndFrom = (limit: number, time: number): string[] =>
  Array(limit)
    .fill(0)
    .map((v, i) => time + INTERVAL * i)
    .map(rndToColor);

const calcSeed = (every, start, time) => Math.floor((time - start) / every);

const render = (
  elem1: HTMLDivElement,
  elem2: HTMLDivElement,
  color: string
) => {
  elem1.style.color = color;
  elem1.innerText = color;
  elem2.style.backgroundColor = color;
};

const START = new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0).getTime();
const txt = document.querySelector<HTMLDivElement>(".color .txt");
const bg = document.querySelector<HTMLDivElement>(".colors");
const source = interval(INTERVAL);

source
  .pipe(startWith(START))
  .pipe(scan<number>(() => calcSeed(INTERVAL, START, new Date().getTime())))
  .pipe(map((x: number) => rndToColor(random(x))))
  .subscribe(color => {
    render(txt, bg, color);
  });
