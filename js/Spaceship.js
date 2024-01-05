/**
 * Spaceship.js
 * Autori: David Stromp, Patrik Barna
 * Dátum: 3.1.2024
 * Verzia: 1.0.0
 * Popis: Spravuje kozmickú loď v hre vrátane jej pohybu, kamery a laserového lúča.
 * Hlavný program: Game.js
 */

import * as THREE from "three";

export class Spaceship {
  /**
   * Konštruktor pre Spaceship.
   * @param {Object} game - Hlavný objekt hry.
   * @param {THREE.Scene} scene - Scéna, do ktorej bude loď pridaná.
   * @param {THREE.Camera} camera - Kamera, ktorá sleduje loď.
   * @param {THREE.Loader} loader - Načítač pre 3D modely.
   */
  constructor(game, scene, camera, loader) {
    this.game = game;
    this.scene = scene;
    this.camera = camera;
    this.loader = loader;
    this.speed = 5;
    this.followCamera = false;
    this.object = this.createSpaceship();
    this.originalCameraX = 0;
    this.originalCameraY = 3;
    this.targetCameraPosition = new THREE.Vector3(
      this.originalCameraX,
      this.originalCameraY,
      this.camera.position.z,
    );
  }

  /**
   * Vytvára a pridáva 3D model kozmickej lode do scény.
   */
  createSpaceship() {
    this.loader.load(
      "../models/Spaceship.glb",
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.003, 0.003, 0.003);
        model.position.set(0, 0, 0);
        model.rotation.set(0, Math.PI, 0.3);
        this.scene.add(model);
        this.object = model;
      },
      undefined,
      function (error) {
        console.error(error);
      },
    );
  }

  /**
   * Aktualizuje pozíciu lode na základe vstupu od hráča a obmedzení, taktiež volá aktualizáciu kmaery, ak kamera sleduje loď.
   * @param {boolean} moveLeft - Má sa loď pohybovať doľava.
   * @param {boolean} moveRight - Má sa loď pohybovať doprava.
   * @param {boolean} moveUp - Má sa loď pohybovať nahor.
   * @param {boolean} moveDown - Má sa loď pohybovať nadol.
   * @param {Object} bounds - Hranice pohybu lode.
   * @param {number} delta - Časový rozdiel od poslednej aktualizácie.
   */
  updatePosition(moveLeft, moveRight, moveUp, moveDown, bounds, delta) {
    if (!this.object) return;
    if (moveLeft && this.object.position.x > bounds.minX) {
      this.object.position.x -= this.speed * delta;
      this.object.rotation.set(0, Math.PI, -0.15);
    } else if (moveRight && this.object.position.x < bounds.maxX) {
      this.object.position.x += this.speed * delta;
      this.object.rotation.set(0, Math.PI, 0.15);
    } else this.object.rotation.set(0, Math.PI, 0);
    if (moveUp && this.object.position.y < bounds.maxY) {
      this.object.position.y += this.speed * delta;
    }
    if (moveDown && this.object.position.y > bounds.minY) {
      this.object.position.y -= this.speed * delta;
    }
    this.updateCamera(delta);
  }

  /**
   * Prepína, či kamera má sledovať loď.
   */
  toggleCamera() {
    this.followCamera = !this.followCamera;
  }

  /**
   * Aktualizuje pozíciu kamery v závislosti od polohy lode.
   */
  updateCamera() {
    const lerpFactor = 0.1;
    let targetPosition;

    if (this.followCamera) {
      targetPosition = new THREE.Vector3(
        this.originalCameraX + this.object.position.x,
        this.originalCameraY + this.object.position.y,
        this.camera.position.z,
      );
    } else if (this.targetCameraPosition) {
      targetPosition = this.targetCameraPosition;
    }

    this.camera.position.lerp(targetPosition, lerpFactor);
  }

  /**
   * Prepína stav laserového lúča lode.
   */
  toggleLaserBeam() {
    if (!this.laserBeam) {
      this.createLaserBeam();
    } else {
      this.scene.remove(this.laserBeam);
      this.laserBeam = null;
    }
  }

  /**
   * Vytvára laserový lúč.
   * @param {number} [length=50] - Dĺžka laserového lúča.
   * @param {number} [color=0xffffff] - Farba laserového lúča.
   */
  createLaserBeam(lenght = 50, color = 0xffffff) {
    if (this.laserBeam) {
      this.scene.remove(this.laserBeam);
    }

    const laserGeometry = new THREE.CylinderGeometry(0.05, 0.05, lenght, 32);
    const laserMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
    });

    this.laserBeam = new THREE.Mesh(laserGeometry, laserMaterial);
    this.laserBeam.rotation.x = Math.PI / 2;
    this.scene.add(this.laserBeam);

    this.laserBeam.position.copy(this.object.position);
    this.laserBeam.position.z -= lenght / 2;
  }
}
