/**
 * AlienManager.js
 * Autori: David Stromp, Patrik Barna
 * Dátum: 3.1.2024
 * Verzia: 1.0.0
 * Popis: Tento súbor definuje triedu AlienManager, ktorá je zodpovedná za správu entít Alien.
 * Hlavný program: Game.js
 */

import { Alien } from "./Alien.js";

export class AlienManager {
  /**
   * Konštruktor triedy AlienManager
   * @param {Object} scene - Scéna, do ktorej budú Alien-i vložení.
   * @param {Object} bounds - Hranice pohybu Alien-ov.
   * @param {Object} healthManager - Manažér zdravia pre manipuláciu so zdravím hráča.
   * @param {Object} gltfLoader - Loader na načítanie 3D modelov.
   */
  constructor(scene, bounds, healthManager, gltfLoader) {
    this.scene = scene;
    this.bounds = bounds;
    this.healthManager = healthManager;
    this.loader = gltfLoader;
    this.alienPool = [];
    this.activeAliens = [];
  }

  /**
   * Asynchrónne načíta 3D model pre Alien-a.
   * @param {string} url - URL adresa 3D modelu.
   */
  async preloadModel(url) {
    const gltf = await this.loader.loadAsync("../models/ufo.glb");
    this.model = await gltf.scene;
    this.model.scale.set(0.2, 0.2, 0.2);
  }

  /**
   * Vytvorí a inicializuje bazén Alien-ov.
   * @param {number} size - Veľkosť bazénu (počet Alien-ov).
   */
  createAlienPool(size) {
    for (let i = 0; i < size; i++) {
      const alien = new Alien(
        this.scene,
        this.bounds,
        this.healthManager,
        this.model,
      );
      alien.deactivate();
      this.alienPool.push(alien);
    }
  }

  /**
   * Získa Alien-a z bazénu alebo vytvorí nového, ak je bazén prázdny.
   * @returns {Alien} Vráti instanciu Alien-a.
   */
  getAlien() {
    if (this.alienPool.length > 0) {
      const alien = this.alienPool.pop();
      alien.activate();
      this.activeAliens.push(alien);
      return alien;
    }
    return new Alien(this.scene, this.bounds, this.healthManager, this.model);
  }

  /**
   * Resetuje Alien-a a vráti ho späť do bazénu.
   * @param {Alien} alien - Alien, ktorý má byť resetovaný.
   */
  resetAlien(alien) {
    alien.deactivate();
    this.alienPool.push(alien);
  }
}
