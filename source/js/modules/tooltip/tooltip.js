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
    // TODO перенести обработчики на document
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

    // TODO вынести в отдельную функцию calculatePosition
    const trigRect = this.trigger.getBoundingClientRect();
    const toolRect = this.tooltip.getBoundingClientRect();
    // TODO -1 тут подвисла. негоже
    toolRect.height = toolRect.height + this.mark.getBoundingClientRect().height - 1;
    const yPos = trigRect.top + window.scrollY - toolRect.height;
    const xPos = trigRect.left + (trigRect.width - toolRect.width) / 2;

    this.tooltip.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;

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

  render() {
    body.insertAdjacentHTML('beforeend', baseTemplate(this.text, this.args));
    this.tooltip = body.lastElementChild;
    this.content = this.tooltip.querySelector('.tooltip__content');
    this.mark = this.tooltip.querySelector('.tooltip__mark');
  }
}

const initTooltip = () => {
  const btn = document.querySelector('[data-tooltip]');

  const tooltip = new Tooltip(btn);
};

export {initTooltip};
