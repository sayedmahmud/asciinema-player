function test(kind, callbacks, opts) {
  if (kind == 'random') {
    return random(callbacks, opts);
  } else if (kind == 'clock') {
    return clock(callbacks, opts);
  }
}

function random({ feed, setInterval }, { cols = 80, rows = 24 }) {
  let intervalId;

  return {
    cols: cols,
    rows: rows,

    start: () => {
      intervalId = setInterval(() => { feed(Math.random().toString()) }, 33);
    },

    stop: () => {
      clearInterval(intervalId);
    }
  };
}

function clock({ feed }, { cols = 5, rows = 1 }) {
  const middleRow = Math.floor(rows / 2);
  const leftPad = Math.floor(cols / 2) - 2;
  let intervalId;

  return {
    cols: cols,
    rows: rows,
    duration: 24 * 60,

    start: () => {
      setTimeout(() => {
        feed(`\x1b[?25l\x1b[1m\x1b[${middleRow}B`);
      }, 0);

      intervalId = setInterval(() => {
        const d = new Date();
        const h = d.getHours();
        const m = d.getMinutes();

        feed('\r');
        for (let i = 0; i < leftPad; i++) { feed(' ') }
        feed('\x1b[32m');
        if (h < 10) { feed('0') }
        feed(`${h}`);
        feed('\x1b[39;5m:\x1b[25;35m')
        if (m < 10) { feed('0') }
        feed(`${m}`);
      }, 1000);
    },

    stop: () => {
      clearInterval(intervalId);
    },

    getCurrentTime: () => {
      const d = new Date();

      return d.getHours() * 60 + d.getMinutes();
    }
  };
}

export { test };