
// TODO допилить функционал ресайза

const defaultSettings = {
  animation: 'fade',
  duration: 200,
  safePadding: 16,
  breakpoints: {
    320: {
      safePadding: 16,
    },
    767: {
      safePadding: 24,
    },
    1023: {
      safePadding: 32,
    },
    1439: {
      safePadding: 40,
    },
  },
};

const setBreakpoints = () => {
  Object.keys(settings.breakpoints).forEach((point) => {
    const breakpoint = window.matchMedia(`(min-width:${point}px)`);
    const breakpointChecker = () => {
      if (breakpoint.matches) {
        for (let key in settings.breakpoints[point]) {
          if (settings.breakpoints[point] && tooltips.length) {
            tooltips.forEach((el) => {
              el.args[key] = el.args.breakpoints[point][key];
            });
          }
        }
      } else {
        let res = Object.keys(settings.breakpoints).filter((el) => Number(el) < Number(point));
        const calcPoint = Math.max(...res);

        for (let key in settings.breakpoints[point]) {
          if (settings.breakpoints[point] && tooltips.length) {
            tooltips.forEach((el) => {
              el.args[key] = el.args.breakpoints[calcPoint][key];
            });
          }
        }
      }
    };
    breakpoint.addListener(breakpointChecker);
    breakpointChecker();
  });
};
