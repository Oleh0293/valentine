/**
 * Hearts module - Handles all floating heart animations
 * for the Valentine's Day site background and celebration effects.
 */

const HEART_EMOJIS = ['💖', '💕', '💗', '💓', '💝', '💘', '❤️', '🩷', '💞', '✨', '🌸'];
const CELEBRATION_HEARTS = ['💖', '💕', '💗', '💓', '💝', '💘', '❤️', '🎉', '✨', '🥰', '💞', '🩷'];

/** Configuration for floating background hearts */
interface FloatingHeartConfig {
  /** Minimum animation duration in seconds */
  minDuration: number;
  /** Maximum animation duration in seconds */
  maxDuration: number;
  /** Minimum font size in rem */
  minSize: number;
  /** Maximum font size in rem */
  maxSize: number;
  /** Interval between spawning hearts in milliseconds */
  spawnInterval: number;
  /** Maximum number of hearts on screen at once */
  maxHearts: number;
}

const DEFAULT_CONFIG: FloatingHeartConfig = {
  minDuration: 8,
  maxDuration: 18,
  minSize: 0.8,
  maxSize: 2.5,
  spawnInterval: 600,
  maxHearts: 25,
};

let heartIntervalId: ReturnType<typeof setInterval> | null = null;

/**
 * Generates a random number between min and max (inclusive).
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random number in range
 */
function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Creates a single floating heart element and appends it to the container.
 * The heart floats upward and is removed from the DOM after animation ends.
 * @param container - The HTML element to append the heart to
 * @param config - Configuration for the heart animation
 */
function createFloatingHeart(container: HTMLElement, config: FloatingHeartConfig): void {
  try {
    if (container.children.length >= config.maxHearts) {
      return;
    }

    const heart = document.createElement('span');
    heart.classList.add('floating-heart');
    heart.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];

    const size = randomInRange(config.minSize, config.maxSize);
    const duration = randomInRange(config.minDuration, config.maxDuration);
    const left = randomInRange(0, 100);
    const delay = randomInRange(0, 3);

    heart.style.fontSize = `${size}rem`;
    heart.style.left = `${left}%`;
    heart.style.animationDuration = `${duration}s`;
    heart.style.animationDelay = `${delay}s`;

    container.appendChild(heart);

    const totalTime = (duration + delay) * 1000;
    setTimeout(() => {
      try {
        if (heart.parentNode === container) {
          container.removeChild(heart);
        }
      } catch {
        /* Heart was already removed */
      }
    }, totalTime);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Hearts] Failed to create floating heart: ${message}`);
  }
}

/**
 * Starts the floating hearts background animation.
 * Hearts continuously spawn and float upward from the bottom of the screen.
 * @param containerId - The ID of the container element (default: 'hearts-container')
 * @param config - Optional configuration overrides
 *
 * @example
 * ```ts
 * startFloatingHearts('hearts-container', { spawnInterval: 400 });
 * ```
 */
export function startFloatingHearts(
  containerId: string = 'hearts-container',
  config: Partial<FloatingHeartConfig> = {}
): void {
  try {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`[Hearts] Container element #${containerId} not found`);
      return;
    }

    const mergedConfig: FloatingHeartConfig = { ...DEFAULT_CONFIG, ...config };

    /* Spawn initial batch */
    for (let i = 0; i < 8; i++) {
      setTimeout(() => createFloatingHeart(container, mergedConfig), i * 300);
    }

    /* Continuously spawn hearts */
    heartIntervalId = setInterval(() => {
      createFloatingHeart(container, mergedConfig);
    }, mergedConfig.spawnInterval);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Hearts] Failed to start floating hearts: ${message}`);
  }
}

/**
 * Stops the floating hearts background animation.
 */
export function stopFloatingHearts(): void {
  if (heartIntervalId !== null) {
    clearInterval(heartIntervalId);
    heartIntervalId = null;
  }
}

/**
 * Creates a burst of hearts from a central point for the celebration effect.
 * Hearts fly outward in random directions and fade away.
 * @param centerX - X coordinate of the burst center
 * @param centerY - Y coordinate of the burst center
 * @param count - Number of hearts to burst (default: 30)
 *
 * @example
 * ```ts
 * createHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 40);
 * ```
 */
export function createHeartBurst(
  centerX: number,
  centerY: number,
  count: number = 30
): void {
  try {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        try {
          const heart = document.createElement('span');
          heart.classList.add('burst-heart');
          heart.textContent = CELEBRATION_HEARTS[Math.floor(Math.random() * CELEBRATION_HEARTS.length)];

          const angle = randomInRange(0, Math.PI * 2);
          const distance = randomInRange(100, 400);
          const tx = Math.cos(angle) * distance;
          const ty = Math.sin(angle) * distance;

          heart.style.left = `${centerX}px`;
          heart.style.top = `${centerY}px`;
          heart.style.setProperty('--tx', `${tx}px`);
          heart.style.setProperty('--ty', `${ty}px`);
          heart.style.fontSize = `${randomInRange(1, 3)}rem`;

          document.body.appendChild(heart);

          setTimeout(() => {
            try {
              if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
              }
            } catch {
              /* Heart was already removed */
            }
          }, 3000);
        } catch {
          /* Skip this heart on error */
        }
      }, i * 50);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Hearts] Failed to create heart burst: ${message}`);
  }
}

/**
 * Starts a continuous celebration effect that periodically bursts hearts
 * across the screen. Used after the user says "Yes".
 * @param intervalMs - Interval between bursts in milliseconds (default: 2000)
 * @returns Cleanup function to stop the celebration
 *
 * @example
 * ```ts
 * const stopCelebration = startCelebrationLoop();
 * // Later, to stop:
 * stopCelebration();
 * ```
 */
export function startCelebrationLoop(intervalMs: number = 2000): () => void {
  const burstAtRandomPosition = (): void => {
    const x = randomInRange(100, window.innerWidth - 100);
    const y = randomInRange(100, window.innerHeight - 100);
    createHeartBurst(x, y, 15);
  };

  /* Initial burst */
  createHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 40);
  setTimeout(burstAtRandomPosition, 500);
  setTimeout(burstAtRandomPosition, 1000);

  const id = setInterval(burstAtRandomPosition, intervalMs);

  return () => clearInterval(id);
}
