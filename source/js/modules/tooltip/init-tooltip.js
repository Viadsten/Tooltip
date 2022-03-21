
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
    template: '<p class="tooltip__text">я создан в JS</p>',
  },
  'scale': {
    animation: 'scale',
  },
};

const initTooltip = () => {
  const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
  if (tooltipTriggers) {
    tooltips = new Tooltips(tooltipTriggers, settings);
  }

  window.tooltips = tooltips;
};

export {initTooltip, tooltips};
