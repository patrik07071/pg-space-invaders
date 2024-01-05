/**
 * Game.js
 * Autori: David Stromp, Patrik Barna
 * Dátum: 3.1.2024
 * Verzia: 1.0.0
 * Popis: Hlavný riadiaci súbor pre hernú aplikáciu, zodpovedný za inicializáciu, riadenie a aktualizáciu herných komponentov.
 */

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Importy potrebných herných komponentov
import { GameInit } from "./GameInit.js";
import { HUDManager } from "./HUDManager.js";
import { Controls } from "./Controls.js";
import { Menu } from "./Menu.js";
import { AlienManager } from "./AlienManager.js";
import { Spaceship } from "./Spaceship.js";
import { Bullet } from "./Bullet.js";
import { ScoreManager } from "./ScoreManager.js";
import { GameState } from "./GameState.js";
import { HealthManager } from "./HealthManager.js";
import { ButtonManager } from "./ButtonManager.js";
import { Shop } from "./Shop.js";

export class Game {
  /**
   * Konštruktor pre triedu Game.
   */
  constructor() {
    this.gameInit = new GameInit();
    this.init();
  }

  /**
   * Asynchrónna inicializačná metóda pre herné zdroje a komponenty.
   */
  async init() {
    await this.setupGameResources();
    await this.setupGameClasses();
    await this.preloadModels();
    await this.resetInitGame();
  }

  /**
   * Nastaví základné herné zdroje (scéna, kamera, renderer, častice, fonty, hranice pohybu).
   */
  async setupGameResources() {
    this.scene = this.gameInit.getScene();
    this.camera = this.gameInit.getCamera();
    this.renderer = this.gameInit.getRenderer();
    this.particles = this.gameInit.getParticles();
    this.font = await this.gameInit.loadFont();
    this.loader = new GLTFLoader();
    this.clock = new THREE.Clock();
    this.spaceshipBounds = { minX: -10, maxX: 10, minY: -1, maxY: 3 };
    this.isGameActive = false;
    this.lastBulletTime = 0;
  }

  /**
   * Inicializuje hlavné herné komponenty (controls, scoreManager, healthManager, atď.).
   */
  async setupGameClasses() {
    this.controls = new Controls(this);
    this.scoreManager = new ScoreManager(this, this.font);
    this.healthManager = new HealthManager(this, this.font);
    this.gameState = new GameState(this, this.scoreManager, this.healthManager);
    this.menu = new Menu(this, this.gameState);
    this.shop = new Shop(this, this.menu, this.healthManager);
    this.buttonManager = new ButtonManager(this.menu, this.shop);
    this.hudManager = new HUDManager(
      this.renderer,
      this.font,
      this.healthManager,
      this.scoreManager,
    );
    this.alienManager = new AlienManager(
      this.scene,
      this.spaceshipBounds,
      this.healthManager,
      this.loader,
    );
  }

  /**
   * Prednačíta potrebné 3D modely.
   */
  async preloadModels() {
    await this.alienManager.preloadModel();
  }

  /**
   * Resetuje hru a premenné do počiatočného stavu.
   */
  async resetInitGame() {
    this.clearScene();
    this.createSpaceship();
    this.createAliens();
    this.gameState.disableContBttIfNoSavedGame();
    this.bullets = [];
    this.bulletCooldown = 0.75;
    this.bulletSpeed = 0.2;
  }

  /**
   * Začne hernú slučku, a vytvára animáciu v loope pokial je isGameActive true.
   */
  startGameLoop() {
    const animate = () => {
      if (this.isGameActive) {
        this.updateGameObjects();
        this.gameState.saveGame();
        this.render();
        this.gameInit.updateParticles();

        const elapsedTime = this.clock.getElapsedTime();
        this.particles.position.z = +elapsedTime * 0.1;

        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }

  /**
   * Vyčistí scénu od všetkých objektov.
   */
  clearScene() {
    const removeFromScene = (obj) => {
      if (obj) {
        this.scene.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      }
    };

    // Odstránenie objektov zvieracej lode a laserového zamerania
    if (this.spaceship && this.spaceship.laserBeam) {
      removeFromScene(this.spaceship.laserBeam);
      this.spaceship.laserBeam = null;
    }

    // Odstránenie kozmickej lode
    if (this.spaceship && this.spaceship.object) {
      removeFromScene(this.spaceship.object);
      this.spaceship = null;
    }

    // Odstránenie Alienov
    if (this.aliens) {
      this.aliens.forEach((alien) =>
        alien && alien.object && removeFromScene(alien.object)
      );
      this.aliens = [];
    }

    // Odstránenie striel
    if (this.bullets) {
      this.bullets.forEach((bullet) =>
        bullet && bullet.object && removeFromScene(bullet.object)
      );
      this.bullets = [];
    }

    // Resetovanie zdravia a skóre
    this.healthManager.resetHealth();
    this.scoreManager.resetScore();
  }

  /**
   * Vyresetuje všetky premenne pomocou resetInitGame a spustí novú hru.
   */
  async startGame() {
    await this.resetInitGame();
    this.isGameActive = true;
    this.startGameLoop();
  }

  /**
   * Pokračuje v uloženej hre.
   */
  continueGame() {
    this.gameState.loadGame();

    this.scoreManager.updateScore(this.scoreManager.score);
    this.healthManager.updateHealth(this.healthManager.healthCount);

    this.isGameActive = true;
    this.startGameLoop();
  }

  /**
   * Aktualizuje stav herných objektov.
   */
  updateGameObjects() {
    const delta = this.clock.getDelta();
    this.updateSpaceship(delta);
    this.updateAliens();
    this.updateBullets();
    this.checkCollisions();
    const elapsedTime = this.clock.getElapsedTime();
    if (this.shoot && elapsedTime - this.lastBulletTime > this.bulletCooldown) {
      this.createBullet();
      this.lastBulletTime = elapsedTime;
    }
  }

  /**
   * Renderuje scénu a HUD.
   */
  render() {
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    this.hudManager.renderHud();
  }

  /**
   * Vytvorí objekt kozmickej lode.
   */
  createSpaceship() {
    this.spaceship = new Spaceship(this, this.scene, this.camera, this.loader);
  }

  /**
   * Vytvorí skupinu Alienov pomocou AlienManagera.
   */
  createAliens() {
    this.alienManager.createAlienPool(10);
    this.aliens = Array.from({ length: 5 }, () => this.alienManager.getAlien());
  }

  /**
   * Vytvorí nový objekt Bullet a pridá ho do zoznamu striel.
   */
  createBullet() {
    const newBullet = new Bullet(
      this.scene,
      this.spaceship.object.position,
      this.bulletSpeed,
    );
    this.bullets.push(newBullet);
  }

  /**
   * Aktualizuje pozíciu kozmickej lode na základe vstupu od hráča.
   * @param {number} delta - Časový rozdiel od poslednej aktualizácie.
   */
  updateSpaceship(delta) {
    this.spaceship.updatePosition(
      this.moveLeft,
      this.moveRight,
      this.moveUp,
      this.moveDown,
      this.spaceshipBounds,
      delta,
    );
  }

  /**
   * Aktualizuje pozície všetkých Alienov.
   */
  updateAliens() {
    this.aliens.forEach((alien) => {
      if (alien.object) {
        alien.updatePosition();
      }
    });
  }

  /**
   * Aktualizuje striely a odstraňuje tie, ktoré sú mimo scény.
   */
  updateBullets() {
    this.bullets.forEach((bullet) => bullet.update());
    this.bullets = this.bullets.filter((bullet) => {
      if (bullet.isOffScreen()) {
        bullet.removeFromScene();
        return false;
      }
      return true;
    });
  }

  /**
   * Kontroluje a spracúva kolízie medzi strielami, Alienmi a kozmickou lodou.
   */
  checkCollisions() {
    let laserInCollision = false;
    let closestAlienDistance = Infinity;

    for (let j = this.aliens.length - 1; j >= 0; j--) {
      let alien = this.aliens[j];
      if (!alien || !alien.object) continue;

      if (this.spaceship.object && this.spaceship.laserBeam) {
        const distanceZ = Math.abs(
          alien.object.position.z - this.spaceship.object.position.z,
        );
        const distanceXY = new THREE.Vector2(
          alien.object.position.x - this.spaceship.object.position.x,
          alien.object.position.y - this.spaceship.object.position.y,
        ).length();

        if (distanceXY < 0.75 && distanceZ < closestAlienDistance) {
          closestAlienDistance = distanceZ;
          laserInCollision = true;
        }

        const laserLength = laserInCollision ? closestAlienDistance : 50;
        const laserColor = laserInCollision ? 0xff0000 : 0xffffff;
        this.spaceship.createLaserBeam(laserLength, laserColor);
      }

      for (let i = this.bullets.length - 1; i >= 0; i--) {
        let bullet = this.bullets[i];
        if (!bullet || !bullet.object) continue;

        if (bullet.object.position.distanceTo(alien.object.position) < 0.75) {
          this.scene.remove(bullet.object);
          this.bullets.splice(i, 1);
          this.alienManager.resetAlien(alien);
          this.aliens[j] = this.alienManager.getAlien();
          this.scoreManager.increaseScore(100);
          break;
        }
      }
    }
  }

  /**
   * Aktualizuje kameru a renderer pri zmene veľkosti okna.
   */
  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);

    this.hudManager.updateHud();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  window.addEventListener("resize", () => game.onWindowResize(), false);
});
