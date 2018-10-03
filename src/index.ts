import { interval } from "rxjs";
import { map, scan, startWith } from "rxjs/operators";
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

const render = (
  elem1: HTMLDivElement,
  elem2: HTMLDivElement,
  color: string
) => {
  elem1.style.color = color;
  elem1.innerText = color;
  elem2.style.backgroundColor = color;
};

// let's start with the first milisecond of the current year
const START = new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0).getTime();

const txt = document.querySelector<HTMLDivElement>(".color .txt");
const bg = document.querySelector<HTMLDivElement>(".colors");

const source = interval(INTERVAL);

source
  .pipe(startWith(START))
  .pipe(scan<number>(() => calcSeed(INTERVAL, START, new Date().getTime())))
  .pipe(map((x: number) => numToColor(randomNum(x))))
  .subscribe(color => render(txt, bg, color));
