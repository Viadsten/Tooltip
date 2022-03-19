
import {Tooltips} from './tooltip';

let tooltips;

const settings = {
  'default': {
    animation: 'fib',
    duration: 200,
    safePadding: 16,
    click: false,
    dev: false,
  },
  'dev': {
    dev: true,
  },
  'click': {
    click: true,
  },
  'img': {
    mod: 'img',
  },
  'red': {
    mod: 'red',
  },
  'template': {
    template: '<p class="tooltip__text">Выгляжу как все, но я создан в JS ^-^</p>',
  },
  'scale': {
    animation: 'scale',
    dev: true,
  },
};

const initTooltip = () => {
  const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
  if (tooltipTriggers) {
    tooltips = new Tooltips(tooltipTriggers, settings);
  }

  window.tooltips = tooltips;

  // const tooltipClickTrigger = document.querySelector('[data-tooltip-click]');

  // if (tooltipClickTrigger) {
  //   const clickTooltip = new Tooltips(tooltipClickTrigger, {
  //     click: true,
  //   });
  // }

  // const tooltipDev = document.querySelector('[data-tooltip-dev]');

  // if (tooltipDev) {
  //   const devTooltip = new Tooltips(tooltipDev, {
  //     devMode: true,
  //   });
  // }
};

export {initTooltip, tooltips};
