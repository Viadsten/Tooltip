import {calculateTooltipPosition} from './calculate-position';

const textTemplate = (text) => {
  return (`
    <p class="tooltip__text">${text}</p>
  `);
};

const baseTemplate = (content, args) => {
  return (`
    <div class="tooltip">
      <div class="tooltip__content ${args.animation} ${args.mod ? 'tooltip__content--' + args.mod : ''}">
        ${content}
        <div class="tooltip__mark"></div>
      </div>
    </div>
  `);
};

const body = document.querySelector('body');

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
    if (this.args.dev) {
      this.show();
      return;
    }
    this.setListener();
  }

  checkContent(trigger) {
    switch ('string') {
      case (typeof trigger.dataset.text):
        return textTemplate(trigger.dataset.text);
      case (typeof trigger.dataset.html):
        return trigger.dataset.html;
      case (typeof this.args.template):
        return this.args.template;
      default:
        throw new Error('нет контента для тултипа ~.~');
    }
  }

  setListener() {
    if (this.args.click) {
      // document.addEventListener('click', this.clickAction);
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
    this.settingsKey = 'default';
    this.settings = args;
    this.defaultSettings = this.settings[this.settingsKey];
    this.tooltips = [];

    this.updateTooltips = this.updateTooltips.bind(this);
    this.clickAction = this.clickAction.bind(this);

    this.init();
  }

  init() {
    this.triggers.forEach((trigger) => {
      this.getSettings(trigger);
      const tooltip = new Tooltip(trigger, this.getSettings(trigger));
      this.tooltips.push(tooltip);
      if (tooltip.args.click) {
        this.clickHandler = true;
      }
    });

    this.setUpdateOnScroll();
    this.setClickListener();
  }

  setUpdateOnScroll() {
    document.addEventListener('scroll', this.updateTooltips);
  }

  setClickListener() {
    if (!this.clickHandler) {
      return;
    }

    document.addEventListener('click', this.clickAction);
  }

  clickAction(e) {
    this.tooltips.forEach((tooltip) => {
      if (tooltip.args.click && e.target === tooltip.trigger) {
        tooltip.show();
      } else if (tooltip.args.click && tooltip.isOpened) {
        tooltip.hide();
      }
    });
  }

  updateTooltips() {
    this.tooltips.map((tooltip) => {
      if (tooltip.isOpened) {
        tooltip.updatePosition();
      }
    });
  }

  getSettings(trigger) {
    const tooltipKey = trigger.dataset.tooltip;
    if (!tooltipKey) {
      return this.defaultSettings;
    }

    let settings = {};
    settings.animation =
      typeof this.settings[tooltipKey].animation === 'string'
        ? this.settings[tooltipKey].animation
        : this.defaultSettings.animation;
    settings.duration =
      typeof this.settings[tooltipKey].duration === 'number'
        ? this.settings[tooltipKey].duration
        : this.defaultSettings.duration;
    settings.safePadding =
      typeof this.settings[tooltipKey].safePadding === 'number'
        ? this.settings[tooltipKey].safePadding
        : this.defaultSettings.safePadding;
    settings.dev =
      typeof this.settings[tooltipKey].dev === 'boolean'
        ? this.settings[tooltipKey].dev
        : this.defaultSettings.dev;
    settings.click =
      typeof this.settings[tooltipKey].click === 'boolean'
        ? this.settings[tooltipKey].click
        : this.defaultSettings.click;
    settings.mod =
      typeof this.settings[tooltipKey].mod === 'string'
        ? this.settings[tooltipKey].mod
        : this.defaultSettings.mod;
    settings.template =
      typeof this.settings[tooltipKey].template === 'string'
        ? this.settings[tooltipKey].template
        : this.defaultSettings.template;
    return (settings);
  }
}

export {Tooltips};
