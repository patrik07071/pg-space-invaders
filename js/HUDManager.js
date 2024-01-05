/**
 * HUDManager.js
 * Autori: David Stromp, Patrik Barna
 * Dátum: 3.1.2024
 * Verzia: 1.0.0
 * Popis: Správa a vykreslenie informačného panela (HUD) pre hru.
 * Hlavný program: Game.js
 */

import * as THREE from "three";

export class HUDManager {
  /**
   * Konštruktor pre HUDManager.
   * @param {THREE.WebGLRenderer} renderer - WebGL renderer používaný pre vykreslenie hry.
   * @param {THREE.Font} font - Font použitý pre text v HUD.
   * @param {HealthManager} healthManager - Manažér zdravia pre zobrazenie zdravotného stavu hráča.
   * @param {ScoreManager} scoreManager - Manažér skóre pre zobrazenie skóre hráča.
   */
  constructor(renderer, font, healthManager, scoreManager) {
    this.renderer = renderer;
    this.font = font;
    this.healthManager = healthManager;
    this.scoreManager = scoreManager;
    this.setupHud();
  }

  /**
   * Nastaví scénu a kameru pre HUD a inicializuje textové zobrazenia.
   */
  setupHud() {
    this.hudScene = new THREE.Scene();
    this.hudCamera = new THREE.OrthographicCamera(
      -window.innerWidth / 2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      -window.innerHeight / 2,
      1,
      1000,
    );
    this.hudCamera.position.z = 10;

    this.healthManager.createHealthText(this.hudScene);
    this.scoreManager.createScoreText(this.hudScene);
  }

  /**
   * Aktualizuje kameru a pozície textov v HUD podľa zmeny veľkosti okna.
   */
  updateHud() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.hudCamera.left = -width / 2;
    this.hudCamera.right = width / 2;
    this.hudCamera.top = height / 2;
    this.hudCamera.bottom = -height / 2;
    this.hudCamera.updateProjectionMatrix();

    if (this.healthManager) {
      this.healthManager.updatePosition(width, height);
    }
    if (this.scoreManager) {
      this.scoreManager.updatePosition(width, height);
    }
  }

  /**
   * Vykreslí informačný panel (HUD) na obrazovku.
   */
  renderHud() {
    this.renderer.clearDepth();
    this.renderer.render(this.hudScene, this.hudCamera);
  }
}
