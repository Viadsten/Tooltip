const SAFE_HORIZONTAL_DISTANCE = 15;
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
  if (trigRect.top - SAFE_HORIZONTAL_DISTANCE <= toolRect.height) {
    return (tooltipPosition.BOTTOM);
  } else {
    return (tooltipPosition.TOP);
  }
};

// TODO добавить возможность показывать сбоку
const calculateTooltipPosition = (trigger, tooltip, arrow, content, args) => {
  const trigRect = trigger.getBoundingClientRect();
  const toolRect = tooltip.getBoundingClientRect();
  const arrowRect = arrow.getBoundingClientRect();

  let tooltipCord = {};
  let arrowCord = {};

  // TODO стоит вынести switch'и в отдельные функции
  // vertical
  switch (checkVerticalPosition(trigRect, toolRect)) {
    case (tooltipPosition.BOTTOM):
      tooltipCord.y = trigRect.bottom + window.scrollY + arrowRect.height;
      arrowCord.y = 'calc(-100% + 1px)'; // как-то кринжово тут кальк вписывать. + не знаю как баг с 1px победить
      content.classList.add('arrow-bottom');
      content.classList.add('bottom');
      break;
    default:
      tooltipCord.y = trigRect.top + window.scrollY - toolRect.height - arrowRect.height;
      arrowCord.y = 'calc(100% - 1px)'; // ~~\(*o*)\
      content.classList.remove('arrow-bottom');
      content.classList.remove('bottom');
  }

  // horizontal
  switch (checkHorizontalPosition(trigRect, toolRect, args)) {
    case (tooltipPosition.LEFT):
      tooltipCord.x = args.safePadding;
      arrowCord.x = (trigRect.width - arrowRect.width) / 2 + trigRect.left - args.safePadding;
      break;
    case (tooltipPosition.RIGHT):
      tooltipCord.x = document.documentElement.clientWidth - toolRect.width - args.safePadding;
      arrowCord.x = trigRect.left - tooltipCord.x + (trigRect.width - arrowRect.width) / 2;
      break;
    default:
      tooltipCord.x = trigRect.left + (trigRect.width - toolRect.width) / 2;
      arrowCord.x = (toolRect.width - arrowRect.width) / 2;
  }

  tooltip.style.transform = `translate3d(${tooltipCord.x}px, ${tooltipCord.y}px, 0)`;
  arrow.style.transform = `translate3d(${arrowCord.x}px, ${arrowCord.y}, 0)`;
};

export {calculateTooltipPosition};
