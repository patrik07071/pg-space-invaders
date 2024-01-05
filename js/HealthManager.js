/**
 * HealthManager.js
 * Autori: David Stromp, Patrik Barna
 * Dátum: 3.1.2024
 * Verzia: 1.0.0
 * Popis: Správa zdravie hráča a jeho vizualizáciu v hernom prostredí.
 * Hlavný program: Game.js
 */

import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

export class HealthManager {
  /**
   * Konštruktor pre HealthManager.
   * @param {Object} game - Hlavný objekt hry.
   * @param {THREE.Font} font - Font použitý pre textové zobrazenie zdravia.
   */
  constructor(game, font) {
    this.game = game;
    this.font = font;
    this.healthCount = 3;
    this.healthTextDisplay = "\uf4e1 "; // Symbol srdca
    this.healthTextMesh = null;
  }

  /**
   * Vytvára textové zobrazenie zdravia.
   * @param {THREE.Scene} hudScene - Scéna pre zobrazenie informačného panelu (HUD).
   */
  createHealthText(hudScene) {
    if (!this.font) return;
    const geometry = new TextGeometry(
      "Health: " + this.healthTextDisplay.repeat(this.healthCount),
      {
        font: this.font,
        size: 25,
        height: 5,
      },
    );

    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.healthTextMesh = new THREE.Mesh(geometry, material);
    this.updatePosition(window.innerWidth, window.innerHeight);
    hudScene.add(this.healthTextMesh);
  }

  /**
   * Aktualizuje zobrazenie zdravia.
   * @param {number} newHealth - Nový stav zdravia hráča.
   */
  updateHealth(newHealth) {
    this.healthCount = newHealth;
    if (this.healthTextMesh) {
      this.healthTextMesh.geometry.dispose();
      this.healthTextMesh.geometry = new TextGeometry(
        "Health: " + this.healthTextDisplay.repeat(this.healthCount),
        {
          font: this.font,
          size: 25,
          height: 5,
        },
      );
    }
    this.checkGameOver();
  }

  /**
   * Zvyšuje zdravie hráča.
   * @param {number} amount - Množstvo, o ktoré sa má zvýšiť zdravie ( Default = 1).
   */
  increaseHealth(amount = 1) {
    this.updateHealth(this.healthCount + amount);
  }

  /**
   * Znižuje zdravie hráča.
   * @param {number} amount - Množstvo, o ktoré sa má znížiť zdravie (Default = 1).
   */
  decreaseHealth(amount = 1) {
    this.updateHealth(this.healthCount - amount);
  }

  /**
   * Kontroluje, či hráčova hra skončila (zdravie kleslo na nulu).
   */
  checkGameOver() {
    if (this.healthCount === 0) {
      this.game.menu.openGameOverOverlay();
    }
  }

  /**
   * Resetuje zdravie hráča na počiatočnú hodnotu.
   */
  resetHealth() {
    this.healthCount = 3;
    this.updateHealth(this.healthCount);
  }

  /**
   * Aktualizuje pozíciu textu zobrazenia zdravia.
   * @param {number} width - Šírka okna.
   * @param {number} height - Výška okna.
   */
  updatePosition(width, height) {
    if (this.healthTextMesh) {
      this.healthTextMesh.position.set(width / 2 - 330, height / 2 - 50, 0);
    }
  }
}
