/**
 * Controls.js
 * Autori: David Stromp, Patrik Barna
 * Dátum: 3.1.2024
 * Verzia: 1.0.0
 * Popis: Tento súbor definuje triedu Controls, ktorá zodpovedá za spracovanie vstupu z klávesnice pre hru.
 * Hlavný program: Game.js
 */

export class Controls {
  /**
   * Konštruktor triedy Controls
   * @param {Object} game - Referencia na hlavný objekt hry.
   */
  constructor(game) {
    this.game = game;
    this.initEventListeners();
  }

  /**
   * Inicializuje poslucháčov udalostí pre klávesnicu.
   */
  initEventListeners() {
    document.addEventListener("keydown", (event) => this.handleKeyDown(event));
    document.addEventListener("keyup", (event) => this.handleKeyUp(event));
  }

  /**
   * Spracuje stlačenie klávesy.
   * @param {Object} event - Objekt udalosti keydown.
   */
  handleKeyDown(event) {
    switch (event.key) {
      case "ArrowLeft":
        this.game.moveLeft = true;
        break;
      case "ArrowRight":
        this.game.moveRight = true;
        break;
      case "ArrowUp":
        this.game.moveUp = true;
        break;
      case "ArrowDown":
        this.game.moveDown = true;
        break;
      case "Escape":
        this.game.menu.togglePauseMenu();
        break;
      case " ":
        this.game.shoot = true;
        break;
      case "b":
      case "B":
        this.game.shop.toggleShop();
        break;
      case "h":
      case "H":
        this.game.spaceship.toggleLaserBeam();
        break;
      case "c":
      case "C":
        this.game.spaceship.toggleCamera();
        break;
    }
  }

  /**
   * Spracuje uvoľnenie klávesy.
   * @param {Object} event - Objekt udalosti keyup.
   */
  handleKeyUp(event) {
    switch (event.key) {
      case "ArrowLeft":
        this.game.moveLeft = false;
        break;
      case "ArrowRight":
        this.game.moveRight = false;
        break;
      case "ArrowUp":
        this.game.moveUp = false;
        break;
      case "ArrowDown":
        this.game.moveDown = false;
        break;
      case " ":
        this.game.shoot = false;
        break;
    }
  }
}
