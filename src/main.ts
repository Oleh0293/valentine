/**
 * Main entry point for the Valentine's Day site.
 * Initializes all modules: floating hearts, runaway button, and celebration.
 */

import './style.css';
import { startFloatingHearts } from './hearts';
import { initRunawayButton } from './runaway-button';
import { showCelebration, createSparkle } from './celebration';

/**
 * Initializes the Yes button click handler.
 * When clicked, triggers the celebration screen transition.
 */
function initYesButton(): void {
  try {
    const yesButton = document.getElementById('yes-button') as HTMLButtonElement | null;

    if (!yesButton) {
      console.error('[Main] Yes button not found');
      return;
    }

    /* Celebration on click */
    yesButton.addEventListener('click', () => {
      showCelebration('question-screen', 'celebration-screen');
    });

    /* Sparkle trail on hover */
    let sparkleThrottle = false;
    yesButton.addEventListener('mousemove', (event: MouseEvent) => {
      if (sparkleThrottle) return;
      sparkleThrottle = true;
      createSparkle(event);
      setTimeout(() => {
        sparkleThrottle = false;
      }, 100);
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Main] Failed to initialize Yes button: ${message}`);
  }
}

/**
 * Sets up fallback handling for all GIF images.
 * If a GIF fails to load, hides its container gracefully instead of showing broken content.
 */
function initGifFallbacks(): void {
  try {
    const gifImages = document.querySelectorAll<HTMLImageElement>('.cute-gif');
    gifImages.forEach((img) => {
      img.addEventListener('error', () => {
        const container = img.closest('.gif-container') as HTMLElement | null;
        if (container) {
          container.style.display = 'none';
        }
      });
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Main] Failed to initialize GIF fallbacks: ${message}`);
  }
}

/**
 * Main initialization function.
 * Sets up all interactive elements and animations when the DOM is ready.
 */
function init(): void {
  try {
    /* Set up GIF error fallbacks */
    initGifFallbacks();

    /* Start the floating hearts background */
    startFloatingHearts('hearts-container');

    /* Initialize the runaway "No" button */
    initRunawayButton('no-button', 'yes-button');

    /* Initialize the "Yes" button */
    initYesButton();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Main] Failed to initialize application: ${message}`);
  }
}

/* Wait for DOM to be fully loaded before initializing */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
