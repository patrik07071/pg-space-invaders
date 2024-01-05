/**
 * Alien.js
 * Autori: David Stromp, Patrik Barna
 * Dátum: 3.1.2024
 * Verzia: 1.0.0
 * Popis: Tento súbor definuje triedu Alien pre použitie v hernom prostredí.
 * Hlavný program: AlienManager.js
 */

export class Alien {
  /**
   * Konštruktor triedy Alien
   * @param {Object} scene - Scéna, do ktorej bude Alien vložený.
   * @param {Object} bounds - Hranice pohybu Alien-a.
   * @param {Object} healthManager - Manažér zdravia pre manipuláciu so zdravím hráča.
   * @param {Object} model - 3D model Alien-a.
   */
  constructor(scene, bounds, healthManager, model) {
    this.scene = scene;
    this.bounds = bounds;
    this.speed = 0.025;
    this.object = model.clone();
    this.healthManager = healthManager;
  }

  /**
   * Aktivuje Alien-a a pridáva ho do scény.
   */
  activate() {
    this.resetAlienPosition();
    this.scene.add(this.object);
  }

  /**
   * Deaktivuje Alien-a a odstráni ho zo scény, ak je súčasťou parent objektu.
   */
  deactivate() {
    if (this.object.parent) {
      this.scene.remove(this.object);
    }
  }

  /**
   * Nastaví náhodnú počiatočnú pozíciu Alien-a v rámci definovaných hraníc v osiach X a Y, kým hodnota osi Z je statická.
   */
  resetAlienPosition() {
    this.object.position.set(
      Math.random() * (this.bounds.maxX - this.bounds.minX) + this.bounds.minX,
      Math.random() * (this.bounds.maxY - this.bounds.minY) + this.bounds.minY,
      -30,
    );
  }

  /**
   * Aktualizuje pozíciu Alien-a a spracováva interakcie s hranicami scény a zdravím hráča.
   */
  updatePosition() {
    if (!this.object.parent) return;
    this.object.position.z += this.speed;
    if (this.object.position.z > 0) {
      this.healthManager.decreaseHealth();
      this.resetAlienPosition(this.object);
    }
  }
}
