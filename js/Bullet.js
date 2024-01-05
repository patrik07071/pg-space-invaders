/**
 * Bullet.js
 * Autori: David Stromp, Patrik Barna
 * Dátum: 3.1.2024
 * Verzia: 1.0.0
 * Popis: Tento súbor definuje triedu Bullet pre použitie v hernom prostredí.
 * Hlavný program: Game.js
 */

import * as THREE from "three";

export class Bullet {
  /**
   * Konštruktor triedy Bullet
   * @param {Object} scene - Scéna, do ktorej bude guľka vložená.
   * @param {Object} position - Počiatočná pozícia guľky.
   * @param {number} bulletSpeed - Rýchlosť pohybu guľky.
   */
  constructor(scene, position, bulletSpeed) {
    this.scene = scene;
    this.speed = bulletSpeed;
    this.object = this.createBullet(position);
  }

  /**
   * Vytvorí guľku a pridá ju do scény.
   * @param {Object} position - Pozícia, kde bude guľka vytvorená.
   * @returns {Object} Vráti 3D objekt guľky.
   */
  createBullet(position) {
    const bulletGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);

    bullet.position.copy(position);
    this.scene.add(bullet);

    return bullet;
  }

  /**
   * Aktualizuje pozíciu guľky.
   */
  update() {
    if (this.object) {
      this.object.position.z -= this.speed;
    }
  }

  /**
   * Kontroluje, či je guľka mimo scény.
   * @returns {boolean} Vráti true, ak je guľka mimo scény.
   */
  isOffScreen() {
    return this.object.position.z < -50; 
  }

  /**
   * Odstráni guľku zo scény a uvoľní jej referencie.
   */
  removeFromScene() {
    if (this.object) {
      this.scene.remove(this.object);
      this.object = null;
    }
  }
}
