import {calculateTooltipPosition} from './calculate-position';

const textTemplate = (text) => {
  return (`
    <p class="tooltip__text">${text}</p>
  `);
};

const baseTemplate = (content, args) => {
  return (`
    <div class="tooltip">
      <div class="tooltip__content ${args.animation}">
        ${content.type === 'text'
      ? textTemplate(content.el)
      : content.el}
        <div class="tooltip__mark"></div>
      </div>
    </div>
  `);
};

const body = document.querySelector('body');

const defaultSettings = {
  animation: 'fade',
  duration: 200,
  safePadding: 16,
};

class Tooltip {
  constructor(trigger, args) {
    this.trigger = trigger;
    this.args = args;
    this.content = this.checkContent(trigger);

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.remove = this.remove.bind(this);
    this.clickAction = this.clickAction.bind(this);

    this.init();
  }

  init() {
    if (this.args.devMode) {
      this.show();
      return;
    }
    this.setListener();
  }

  checkContent(trigger) {
    // ??? -.-"
    switch ('string') {
      case (typeof trigger.dataset.text):
        return {
          type: 'text',
          el: trigger.dataset.text,
        };
      case (typeof trigger.dataset.html):
        return {
          type: 'html',
          el: trigger.dataset.html,
        };
      default:
        return false;
    }
  }

  setListener() {
    if (this.args.click) {
      document.addEventListener('click', this.clickAction);
    } else {
      this.trigger.addEventListener('mouseenter', this.show);
      this.trigger.addEventListener('mouseleave', this.hide);
    }
  }

  clickAction(e) {
    if (e.target === this.trigger) {
      this.show();
    } else if (this.isOpened) {
      this.hide();
    }
  }

  show() {
    // if else? крайне непонятный кусок кода
    if (this.removeTimeout) {
      clearTimeout(this.removeTimeout);
    } else if (!this.isOpened) {
      this.render();
      this.isOpened = true;
    }

    this.updatePosition();
    // без таймаута css анимация отрабатывает некорректно
    setTimeout(() => {
      this.contentNode.style.transitionDuration = this.args.duration + 'ms';
      this.contentNode.classList.add('is-shown');
    });
  }

  updatePosition() {
    calculateTooltipPosition(this.trigger, this.tooltip, this.arrow, this.contentNode, this.args);
  }

  hide() {
    this.contentNode.classList.remove('is-shown');
    this.removeTimeout = setTimeout(this.remove, this.args.duration);
  }

  remove() {
    this.tooltip.remove();
    this.isOpened = false;
    delete this.removeTimeout;
  }

  render() {
    body.insertAdjacentHTML('beforeend', baseTemplate(this.content, this.args));
    this.tooltip = body.lastElementChild;
    this.contentNode = this.tooltip.querySelector('.tooltip__content');
    this.contentNode.style.maxWidth = `calc(100vw - ${this.args.safePadding * 2}px)`;
    this.arrow = this.tooltip.querySelector('.tooltip__mark');
  }
}

class Tooltips {
  constructor(selector, args) {
    this.triggers = selector.length ? [...selector] : [selector];
    this.settings = this.checkSettings(args);
    this.tooltips = [];

    this.updateTooltips = this.updateTooltips.bind(this);

    this.init();
    this.setUpdateOnScroll();
  }

  init() {
    this.triggers.forEach((trigger) => {
      const tooltip = new Tooltip(trigger, this.settings);
      this.tooltips.push(tooltip);
    });
  }

  checkSettings(args) {
    if (!args) {
      return defaultSettings;
    }

    args.safePadding = (typeof args.safePadding === 'number') ? args.safePadding : defaultSettings.safePadding;
    args.animation = (typeof args.animation === 'string') ? args.animation : defaultSettings.animation;
    args.duration = (typeof args.duration === 'number') ? args.duration : defaultSettings.duration;
    return args;
  }

  setUpdateOnScroll() {
    document.addEventListener('scroll', this.updateTooltips);
  }

  updateTooltips() {
    this.tooltips.map((tooltip) => {
      if (tooltip.isOpened) {
        tooltip.updatePosition();
      }
    });
  }
}

export {Tooltips};
