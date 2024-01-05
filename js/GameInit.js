/**
 * GameInit.js
 * Autori: David Stromp, Patrik Barna
 * Dátum: 3.1.2024
 * Verzia: 1.0.0
 * Popis: Inicializácia základných komponentov herného prostredia ako scéna, kamera, renderer a vizuálne efekty.
 * Hlavný program: Game.js
 */

import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TTFLoader } from "three/addons/loaders/TTFLoader.js";

export class GameInit {
  /**
   * Konštruktor pre triedu GameInit.
   */
  constructor() {
    this.initGame();
  }

  /**
   * Hlavná inicializačná metóda pre nastavenie herného prostredia.
   */
  initGame() {
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.addLights();
    this.createParticlesBackground(3000);
  }

  /**
   * Nastaví scénu hry.
   */
  setupScene() {
    this.scene = new THREE.Scene();
  }

  /**
   * Nastaví kameru v hernom prostredí.
   */
  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.camera.position.y = 3;
    this.camera.position.z = 10;
  }

  /**
   * Nastaví WebGL renderer pre vykresľovanie 3D grafiky.
   */
  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.renderer.autoClear = false;
  }

  /**
   * Pridá osvetlenie do scény.
   */
  addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 5, 0).normalize();
    directionalLight.intensity = 15;
    this.scene.add(directionalLight);
  }

  /**
   * Poskytuje prístup k scéne.
   * @returns {THREE.Scene} Vráti objekt scény.
   */
  getScene() {
    return this.scene;
  }

  /**
   * Poskytuje prístup k kamere.
   * @returns {THREE.Camera} Vráti objekt kamery.
   */
  getCamera() {
    return this.camera;
  }

  /**
   * Poskytuje prístup k WebGL rendereru.
   * @returns {THREE.WebGLRenderer} Vráti objekt WebGL rendereru.
   */
  getRenderer() {
    return this.renderer;
  }

  /**
   * Poskytuje prístup k časticovému systému.
   * @returns {THREE.Points} Vráti objekt časticového systému.
   */
  getParticles() {
    return this.particles;
  }

  /**
   * Asynchrónne načíta písmo pre použitie v hre.
   * @returns {Promise<THREE.Font>} Vráti Promise, ktorý sa vyrieši na objekt písma.
   */
  async loadFont() {
    const fontLoader = new FontLoader();
    const ttfLoader = new TTFLoader();
    return new Promise((resolve, reject) => {
      ttfLoader.load(
        "./fonts/CaskaydiaCoveNerdFont-Light.ttf",
        (ttfFont) => {
          resolve(fontLoader.parse(ttfFont));
        },
        undefined,
        (error) => {
          console.error("Error loading font:", error);
          reject(error);
        },
      );
    });
  }

  /**
   * Vytvorí pozadie s časticami.
   * @param {number} counts - Počet častíc na vygenerovanie.
   */
  createParticlesBackground(counts) {
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(counts * 3);
    for (let i = 0; i < counts * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 75;
      positions[i + 1] = (Math.random() - 0.5) * 50;
      positions[i + 2] = (Math.random() - 0.5) * 50;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );

    const particlesMaterial = new THREE.PointsMaterial();
    particlesMaterial.size = 0.01;
    particlesMaterial.sizeAttenuation = true;

    this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(this.particles);
  }

  /**
   * Aktualizuje pohyb častíc v pozadí.
   */
  updateParticles() {
    const positions = this.particles.geometry.attributes.position.array;
    const resetDistance = 25;

    for (let i = 0; i < positions.length; i += 3) {
      if (positions[i + 2] > resetDistance) {
        positions[i] = (Math.random() - 0.5) * 50;
        positions[i + 1] = (Math.random() - 0.5) * 25;
        positions[i + 2] = -resetDistance;
      } else {
        positions[i + 2] += 0.02;
      }
    }

    this.particles.geometry.attributes.position.needsUpdate = true;
  }
}
