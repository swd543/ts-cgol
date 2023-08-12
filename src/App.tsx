import { Component, createEffect, createSignal } from 'solid-js';

import styles from './App.module.css';
import { Board, Coord, GolNaive } from './Board';
import { render } from 'solid-js/web';

const BoardApp = (props: { b: Board<boolean> }) => (
  <div style={{ display: "grid", "grid-template-columns": `repeat(${props.b.x_size}, 1fr)` }}>
    {
      props.b.repr().map(i => i.map(j => (
        <div class={j ? styles.alive : styles.dead} style={{ "min-width": "0.1vw", "min-height": `${90 / props.b.y_size}vh` }} />
      )))
    }
  </div>
)

const App: Component = () => {

  const initBoard = () => new GolNaive(200, 100, () => Math.random() > 0.90,
    [Coord.E, Coord.W, Coord.N, Coord.S, Coord.NE, Coord.NW, Coord.SE, Coord.SW], true)

  const [b, setB] = createSignal<Board<boolean>>(initBoard(), { equals: false });
  const [timer, setTimer] = createSignal<NodeJS.Timer | undefined>(setInterval(() => react(), 50));

  const react = () => {
    b().step()
    setB(b())
  }

  return (
    <div class={styles.App}>
      <h1>Welcome to a very poorly coded game of life</h1>
      <p>In order to make your own implementation of game of life, extend <strong>Board.ts/Board</strong> and then include it in the initBoard function in this file</p>
      <p>To test your implementation of game of life, change <strong>App.test.ts</strong> and run <strong>pnpm test</strong></p>
      <div>
        <button onclick={react}>step</button>
        {
          timer() ?
            <button onClick={() => { clearInterval(timer()); setTimer(undefined) }}>pause</button> :
            <button onclick={() => { setTimer(setInterval(() => react(), 100)) }}>resume</button>
        }
      </div>
      <BoardApp b={b()} />
      <div />
    </div>
  );
};

export default App;
