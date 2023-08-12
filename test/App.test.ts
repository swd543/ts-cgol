import { expect, test } from 'vitest';
import { Coord, GolNaive } from '../src/Board';

test("Sanity check", () => {
    expect(true).toBe(true);
});

const pairs = [
    [Coord.E, Coord.W],
    [Coord.N, Coord.S],
    [Coord.SE, Coord.NW],
    [Coord.SW, Coord.NE]
]

test("Inversion", () => {
    pairs.forEach(a => {
        expect(a[0]().add(a[1]())).toStrictEqual(new Coord())
    })
});

test("Inversion mul", () => {
    pairs.forEach(a => {
        const d = 9999
        expect(a[0]().mul(d).add(a[1]().mul(d))).toStrictEqual(new Coord())
    })
});

test("GolNaive", () => {
    let b = new GolNaive(10, 3, () => Math.random() > 0.5)
    console.log(b)
});

test("countNeighbours4dof", () => {
    let b = new GolNaive(3, 3, () => true)
    expect(b.countNeighbours(new Coord(1, 1))).toBe(4)
    expect(b.countNeighbours(new Coord(0, 0))).toBe(2)
});

test("countNeighbours8dof", () => {
    let b = new GolNaive(3, 3, () => true, [Coord.E, Coord.N, Coord.S, Coord.W, Coord.NE, Coord.NW, Coord.SE, Coord.SW])
    expect(b.countNeighbours(new Coord(1, 1))).toBe(8)
    expect(b.countNeighbours(new Coord(2, 2))).toBe(3)
});

test("countNeighbours4dofWrap", () => {
    let b = new GolNaive(3, 3, () => true, [Coord.E, Coord.N, Coord.S, Coord.W], true)
    expect(b.countNeighbours(new Coord(0, 0))).toBe(4)
});

test("countNeighbours8dofWrap", () => {
    let b = new GolNaive(3, 3, () => true, [Coord.E, Coord.N, Coord.S, Coord.W, Coord.NE, Coord.NW, Coord.SE, Coord.SW], true)
    expect(b.countNeighbours(new Coord(2, 2))).toBe(8)
});

test("step", () => {
    let b = new GolNaive(3, 3, () => false, [Coord.E, Coord.N, Coord.S, Coord.W], false)
    b.board = [[false, true, false], [true, false, true], [false, false, false]]
    console.log(b)
    b.step()
    console.log(b)
});