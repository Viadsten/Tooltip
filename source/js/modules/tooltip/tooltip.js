const baseTemplate = (text, args) => {
  return (`
    <div class="tooltip">
      <div class="tooltip__content ${args.animation}">
        <p class="tooltip__text">${text}</p>
        <div class="tooltip__mark"></div>
      </div>
    </div>
  `);
};

const body = document.querySelector('body');

const settings = {
  animation: 'fade',
  duration: 300,
  safePadding: 16,
};

const tooltipPosition = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
  TOP: 'top',
  BOTTOM: 'bottom',
};

const checkHorizontalPosition = (trigRect, toolRect, args) => {
  if (trigRect.left + (trigRect.width - toolRect.width) / 2 <= args.safePadding) {
    return (tooltipPosition.LEFT);
  } else if (document.documentElement.clientWidth - trigRect.right + (trigRect.width - toolRect.width) / 2 <= args.safePadding) {
    return (tooltipPosition.RIGHT);
  } else {
    return (tooltipPosition.CENTER);
  }
};

const checkVerticalPosition = (trigRect, toolRect) => {
  if (trigRect.top <= toolRect.height) {
    return (tooltipPosition.BOTTOM);
  } else {
    return (tooltipPosition.TOP);
  }
};

class Tooltip {
  constructor(trigger, args = settings) {
    this.trigger = trigger;
    this.text = trigger.dataset.tooltip;
    this.args = args;

    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
    this.removeTooltip = this.removeTooltip.bind(this);

    this.init();
  }

  init() {
    this.setListener();
  }

  setListener() {
    // TODO добавить обработчик клика
    this.trigger.addEventListener('mouseenter', this.showTooltip);
    this.trigger.addEventListener('mouseleave', this.hideTooltip);
  }

  showTooltip() {
    // if else?
    if (this.removeTimeout) {
      clearTimeout(this.removeTimeout);
    } else {
      this.render();
    }

    this.calculateTooltipPosition();

    this.content.style.transitionDuration = this.args.duration + 'ms';
    this.content.classList.add('is-shown');
  }

  hideTooltip() {
    this.content.classList.remove('is-shown');
    this.removeTimeout = setTimeout(this.removeTooltip, this.args.duration);
  }

  removeTooltip() {
    this.tooltip.remove();
    delete this.removeTimeout;
  }

  calculateTooltipPosition() {
    const trigRect = this.trigger.getBoundingClientRect();
    const toolRect = this.tooltip.getBoundingClientRect();
    const arrowRect = this.arrow.getBoundingClientRect();

    let tooltip = {};
    let arrow = {};

    // vertical
    switch (checkVerticalPosition(trigRect, toolRect)) {
      case (tooltipPosition.BOTTOM):
        tooltip.y = trigRect.bottom + window.scrollY + arrowRect.height;
        arrow.y = 'calc(-100% + 1px)'; // как-то кринжово тут кальк вписывать. + не знаю как баг с 1px победить
        this.content.classList.add('arrow-bottom');
        break;
      default:
        tooltip.y = trigRect.top + window.scrollY - toolRect.height - arrowRect.height;
        arrow.y = 'calc(100% - 1px)'; // как-то кринжово)
        this.content.classList.remove('arrow-bottom');
    }

    // horizontal
    switch (checkHorizontalPosition(trigRect, toolRect, this.args)) {
      case (tooltipPosition.LEFT):
        tooltip.x = this.args.safePadding;
        arrow.x = (trigRect.width - arrowRect.width) / 2 + trigRect.left - this.args.safePadding;
        break;
      case (tooltipPosition.RIGHT):
        tooltip.x = document.documentElement.clientWidth - toolRect.width - this.args.safePadding;
        arrow.x = trigRect.left - tooltip.x + (trigRect.width - arrowRect.width) / 2;
        break;
      default:
        tooltip.x = trigRect.left + (trigRect.width - toolRect.width) / 2;
        arrow.x = (toolRect.width - arrowRect.width) / 2;
    }

    this.tooltip.style.transform = `translate3d(${tooltip.x}px, ${tooltip.y}px, 0)`;
    this.arrow.style.transform = `translate3d(${arrow.x}px, ${arrow.y}, 0)`;
  }

  render() {
    body.insertAdjacentHTML('beforeend', baseTemplate(this.text, this.args));
    this.tooltip = body.lastElementChild;
    this.content = this.tooltip.querySelector('.tooltip__content');
    this.arrow = this.tooltip.querySelector('.tooltip__mark');
  }
}

const initTooltip = () => {
  const btns = document.querySelectorAll('[data-tooltip]');

  btns.forEach((btn) => {
    const tooltip = new Tooltip(btn);
  });
};

export {initTooltip};
