/**
 * Celebration module - Handles the transition to the celebration screen
 * when the user clicks "Yes" to be a Valentine.
 */

import { createHeartBurst, startCelebrationLoop } from './hearts';

/** Callback type for the celebration event */
type CelebrationCallback = () => void;

/**
 * Transitions from the question screen to the celebration screen
 * with a smooth animation and heart burst effects.
 * @param questionScreenId - ID of the question screen element
 * @param celebrationScreenId - ID of the celebration screen element
 * @param onCelebrate - Optional callback to run when celebration starts
 *
 * @example
 * ```ts
 * showCelebration('question-screen', 'celebration-screen', () => {
 *   console.log('User said yes!');
 * });
 * ```
 */
export function showCelebration(
  questionScreenId: string = 'question-screen',
  celebrationScreenId: string = 'celebration-screen',
  onCelebrate?: CelebrationCallback
): void {
  try {
    const questionScreen = document.getElementById(questionScreenId);
    const celebrationScreen = document.getElementById(celebrationScreenId);

    if (!questionScreen) {
      console.error(`[Celebration] Question screen #${questionScreenId} not found`);
      return;
    }

    if (!celebrationScreen) {
      console.error(`[Celebration] Celebration screen #${celebrationScreenId} not found`);
      return;
    }

    /* Hide question screen */
    questionScreen.classList.remove('active');

    /* Show celebration screen after a brief delay for smooth transition */
    setTimeout(() => {
      try {
        celebrationScreen.classList.add('active');

        /* Launch heart bursts */
        createHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 50);

        /* Start continuous celebration */
        startCelebrationLoop(3000);

        /* Execute callback if provided */
        if (onCelebrate) {
          onCelebrate();
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[Celebration] Failed during celebration display: ${message}`);
      }
    }, 400);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Celebration] Failed to show celebration: ${message}`);
  }
}

/**
 * Creates sparkle elements near the cursor when hovering the Yes button.
 * Adds a magical sparkle trail effect.
 * @param event - The mouse event from hovering
 */
export function createSparkle(event: MouseEvent): void {
  try {
    const sparkleEmojis = ['✨', '💖', '⭐', '💫', '🌟'];
    const sparkle = document.createElement('span');
    sparkle.classList.add('sparkle');
    sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];

    const offsetX = (Math.random() - 0.5) * 30;
    const offsetY = (Math.random() - 0.5) * 30;

    sparkle.style.left = `${event.clientX + offsetX}px`;
    sparkle.style.top = `${event.clientY + offsetY}px`;

    document.body.appendChild(sparkle);

    setTimeout(() => {
      try {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      } catch {
        /* Sparkle already removed */
      }
    }, 800);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Celebration] Failed to create sparkle: ${message}`);
  }
}
