/**
 * Runaway Button module - Makes the "No" button escape from the cursor
 * every time the user tries to click it or hover over it.
 */

/** Configuration for the runaway behavior */
interface RunawayConfig {
  /** Minimum distance to jump in pixels */
  minJumpDistance: number;
  /** Maximum distance to jump in pixels */
  maxJumpDistance: number;
  /** Padding from screen edges in pixels */
  edgePadding: number;
  /** Messages to show after multiple escape attempts */
  escapeMessages: string[];
}

const DEFAULT_RUNAWAY_CONFIG: RunawayConfig = {
  minJumpDistance: 100,
  maxJumpDistance: 300,
  edgePadding: 20,
  escapeMessages: [
    'Ні 💔',
    'Ти впевнена? 🥺',
    'Серйозно?? 😢',
    'Подумай ще раз! 😭',
    'Ну будь ласка! 💕',
    'Не роби так! 🥹',
    'Мені буде сумно... 😿',
    'Ну прошуууу! 🙏',
    'Останній шанс! 💝',
    'Тобі мене не зловити! 😜',
  ],
};

let escapeCount = 0;
let isRunaway = false;

/**
 * Generates a random number between min and max.
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random number in the specified range
 */
function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Calculates a safe random position within viewport bounds.
 * Ensures the button doesn't escape off-screen.
 * @param buttonWidth - Width of the button element
 * @param buttonHeight - Height of the button element
 * @param config - Runaway configuration
 * @returns Object with x and y coordinates
 */
function getRandomSafePosition(
  buttonWidth: number,
  buttonHeight: number,
  config: RunawayConfig
): { x: number; y: number } {
  const maxX = window.innerWidth - buttonWidth - config.edgePadding;
  const maxY = window.innerHeight - buttonHeight - config.edgePadding;

  const x = Math.max(config.edgePadding, Math.min(randomBetween(config.edgePadding, maxX), maxX));
  const y = Math.max(config.edgePadding, Math.min(randomBetween(config.edgePadding, maxY), maxY));

  return { x, y };
}

/**
 * Makes the No button jump to a random position away from the cursor.
 * Also updates the button text with progressively desperate messages.
 * @param button - The No button element
 * @param config - Runaway configuration
 */
function escapeFromCursor(button: HTMLButtonElement, config: RunawayConfig): void {
  try {
    if (!isRunaway) {
      isRunaway = true;
      button.classList.add('runaway');
    }

    const rect = button.getBoundingClientRect();
    const { x, y } = getRandomSafePosition(rect.width, rect.height, config);

    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
    button.style.transition = 'left 0.2s ease-out, top 0.2s ease-out';

    /* Update button text with escalating messages */
    const messageIndex = Math.min(escapeCount, config.escapeMessages.length - 1);
    button.textContent = config.escapeMessages[messageIndex];

    escapeCount++;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[RunawayButton] Failed to escape: ${message}`);
  }
}

/**
 * Callback to trigger on the Yes button when the No button has been
 * attempted many times - makes the Yes button grow to be more inviting.
 * @param yesButton - The Yes button element
 */
function growYesButton(yesButton: HTMLButtonElement): void {
  try {
    const growthLevel = Math.min(Math.floor(escapeCount / 2), 4);
    /* Remove all previous growth classes */
    yesButton.classList.remove('growing-1', 'growing-2', 'growing-3', 'growing-4');

    if (growthLevel > 0) {
      yesButton.classList.add(`growing-${growthLevel}`);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[RunawayButton] Failed to grow Yes button: ${message}`);
  }
}

/**
 * Initializes the runaway behavior on the No button.
 * The button will jump away on hover (desktop) and touchstart (mobile).
 * @param noButtonId - The ID of the No button element (default: 'no-button')
 * @param yesButtonId - The ID of the Yes button element (default: 'yes-button')
 * @param config - Optional configuration overrides
 * @returns Cleanup function to remove event listeners
 *
 * @example
 * ```ts
 * const cleanup = initRunawayButton('no-button', 'yes-button');
 * // Later, to stop the behavior:
 * cleanup();
 * ```
 */
export function initRunawayButton(
  noButtonId: string = 'no-button',
  yesButtonId: string = 'yes-button',
  config: Partial<RunawayConfig> = {}
): () => void {
  try {
    const noButton = document.getElementById(noButtonId) as HTMLButtonElement | null;
    const yesButton = document.getElementById(yesButtonId) as HTMLButtonElement | null;

    if (!noButton) {
      console.error(`[RunawayButton] No button element #${noButtonId} not found`);
      return () => {};
    }

    if (!yesButton) {
      console.error(`[RunawayButton] Yes button element #${yesButtonId} not found`);
      return () => {};
    }

    const mergedConfig: RunawayConfig = { ...DEFAULT_RUNAWAY_CONFIG, ...config };

    const handleEscape = (event: Event): void => {
      event.preventDefault();
      event.stopPropagation();
      escapeFromCursor(noButton, mergedConfig);
      growYesButton(yesButton);
    };

    /* Desktop: escape on hover */
    noButton.addEventListener('mouseenter', handleEscape);

    /* Mobile: escape on touch */
    noButton.addEventListener('touchstart', handleEscape, { passive: false });

    /* Also prevent click just in case */
    noButton.addEventListener('click', (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      escapeFromCursor(noButton, mergedConfig);
      growYesButton(yesButton);
    });

    /* Cleanup function */
    return () => {
      noButton.removeEventListener('mouseenter', handleEscape);
      noButton.removeEventListener('touchstart', handleEscape);
      escapeCount = 0;
      isRunaway = false;
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[RunawayButton] Failed to initialize: ${message}`);
    return () => {};
  }
}

/**
 * Gets the current number of escape attempts.
 * @returns The number of times the user has tried to click the No button
 */
export function getEscapeCount(): number {
  return escapeCount;
}
