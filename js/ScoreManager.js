/**
 * ScoreManager.js
 * Autori: David Stromp, Patrik Barna
 * Dátum: 3.1.2024
 * Verzia: 1.0.0
 * Popis: Spravuje skóre v hre a jeho vizuálnu prezentáciu.
 * Hlavný program: Game.js
 */

import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

export class ScoreManager {
  /**
   * Konštruktor pre ScoreManager.
   * @param {Object} game - Hlavný objekt hry.
   * @param {THREE.Font} font - Font použitý pre text skóre.
   */
  constructor(game, font) {
    this.game = game;
    this.font = font;
    this.score = 0;
    this.scoreText = null;
  }

  /**
   * Vytvára textové zobrazenie skóre.
   * @param {THREE.Scene} hudScene - Scéna pre zobrazenie informačného panelu (HUD).
   */
  createScoreText(hudScene) {
    if (!this.font) return;

    const geometry = new TextGeometry("Score: " + this.score, {
      font: this.font,
      size: 25,
      height: 5,
    });

    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.scoreText = new THREE.Mesh(geometry, material);
    this.updatePosition(window.innerWidth, window.innerHeight);
    hudScene.add(this.scoreText);
  }

  /**
   * Aktualizuje hodnotu a zobrazenie skóre.
   * @param {number} newScore - Nová hodnota skóre.
   */
  updateScore(newScore) {
    this.score = newScore;
    if (this.scoreText) {
      this.scoreText.geometry.dispose();
      this.scoreText.geometry = new TextGeometry("Score: " + this.score, {
        font: this.font,
        size: 25,
        height: 5,
      });
    }
  }

  /**
   * Zvyšuje skóre.
   * @param {number} amount - Množstvo, o ktoré sa má zvýšiť skóre (Default = 10).
   */
  increaseScore(amount = 10) {
    this.updateScore(this.score + amount);
  }

  /**
   * Znižuje skóre.
   * @param {number} amount - Množstvo, o ktoré sa má znížiť skóre (Default = 10).
   */
  decreaseScore(amount = 10) {
    this.updateScore(this.score - amount);
  }

  /**
   * Resetuje skóre na počiatočnú hodnotu.
   */
  resetScore() {
    this.score = 0;
    this.updateScore(this.score);
  }

  /**
   * Aktualizuje pozíciu textu skóre v HUD.
   * @param {number} width - Šírka okna.
   * @param {number} height - Výška okna.
   */
  updatePosition(width, height) {
    if (this.scoreText) {
      this.scoreText.position.set(-width / 2 + 50, height / 2 - 50, 0);
    }
  }
}
