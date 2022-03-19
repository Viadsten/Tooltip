
import {Tooltips} from './tooltip';

let tooltips;

const initTooltip = () => {
  const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
  if (tooltipTriggers) {
    tooltips = new Tooltips(tooltipTriggers, {
      click: true,
      animation: 'fib',
      duration: 200,
    });
  }

  window.tooltips = tooltips;

  const tooltipClickTrigger = document.querySelector('[data-tooltip-click]');

  if (tooltipClickTrigger) {
    const clickTooltip = new Tooltips(tooltipClickTrigger, {
      click: true,
    });
  }

  const tooltipDev = document.querySelector('[data-tooltip-dev]');

  if (tooltipDev) {
    const devTooltip = new Tooltips(tooltipDev, {
      devMode: true,
    });
  }
};

export {initTooltip, tooltips};
