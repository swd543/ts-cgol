import { Component, createEffect, createSignal, onCleanup, onMount } from 'solid-js';

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

  const initBoard = (l = 200, b = 100) => new GolNaive(l, b, () => Math.random() > 0.90,
    [Coord.E, Coord.W, Coord.N, Coord.S, Coord.NE, Coord.NW, Coord.SE, Coord.SW], true)

  const [b, setB] = createSignal<Board<boolean>>(initBoard(), { equals: false });
  const [timer, setTimer] = createSignal<NodeJS.Timer | undefined>(setInterval(() => react(), 50));

  const react = () => {
    b().step()
    setB(b())
  }

  const handler = (_event: Event) => {
    const div = 10
    const dims = [~~(window.innerWidth / div), ~~(window.innerHeight / div)]
    setB(initBoard(...dims))
  };

  onMount(() => {
    window.addEventListener('resize', handler);
  });

  onCleanup(() => {
    window.removeEventListener('resize', handler);
  })

  return (
    <div class={styles.App}>
      <h1>Welcome to a very poorly coded game of life</h1>
      <p>In order to make your own implementation of game of life, extend <strong>Board.ts/Board</strong> and then include it in the initBoard function in this file</p>
      <p>To test your implementation of game of life, change <strong>App.test.ts</strong> and run <strong>pnpm test</strong></p>
      <div>
        <button class={styles.skewbutton} onclick={react}>Step</button>
        <button class={styles.skewbutton} onclick={handler}>Reinitialize</button>
        {
          timer() ?
            <button class={styles.skewbutton} onClick={() => { clearInterval(timer()); setTimer(undefined) }}>Pause</button> :
            <button class={styles.skewbutton} onclick={() => { setTimer(setInterval(() => react(), 100)) }}>Resume</button>
        }
      </div>
      <BoardApp b={b()} />
      <div />
    </div>
  );
};

export default App;
