/**
 * GameState.js
 * Autori: David Stromp, Patrik Barna
 * Dátum: 3.1.2024
 * Verzia: 1.0.0
 * Popis: Spravuje stav hry, vrátane ukladania, načítania a resetovania stavu hry.
 * Hlavný program: Game.js
 */

export class GameState {
  /**
   * Konštruktor pre GameState.
   * @param {Object} game - Hlavný objekt hry.
   * @param {ScoreManager} scoreManager - Manažér skóre hry.
   * @param {HealthManager} healthManager - Manažér zdravia hry.
   */
  constructor(game, scoreManager, healthManager) {
    this.game = game;
    this.scoreManager = scoreManager;
    this.healthManager = healthManager;
  }

  /**
   * Uloží aktuálny stav hry do localStorage.
   */
  saveGame() {
    const gameState = {
      score: this.scoreManager.score,
      health: this.healthManager.healthCount,
      bulletCooldown: this.game.bulletCooldown,
      bulletSpeed: this.game.bulletSpeed,
    };
    localStorage.setItem("gameState", JSON.stringify(gameState));
  }

  /**
   * Načíta uložený stav hry z localStorage.
   */
  loadGame() {
    const savedGame = JSON.parse(localStorage.getItem("gameState"));
    if (savedGame) {
      this.scoreManager.score = savedGame.score;
      this.healthManager.healthCount = savedGame.health;
      this.game.bulletCooldown = savedGame.bulletCooldown;
      this.game.bulletSpeed = savedGame.bulletSpeed;
    }
  }

  /**
   * Zakáže tlačidlo pokračovania v hre, ak nie je dostupný uložený stav hry.
   */
  disableContBttIfNoSavedGame() {
    const savedGame = this.retrieveSavedGame();
    const continueButton = document.getElementById("continueButton");
    if (!savedGame) {
      //console.log("No Saved Game");
      continueButton.disabled = true;
      continueButton.style.backgroundColor = "grey";
    } else {
      //console.log("Found Saved Game");
      continueButton.disabled = false;
      continueButton.style.backgroundColor = "";
    }
  }

  /**
   * Kontroluje, či je uložený stav hry dostupný v localStorage.
   * @returns {boolean} Vráti true, ak je uložený stav hry dostupný.
   */
  retrieveSavedGame() {
    const savedGame = localStorage.getItem("gameState");
    return !!savedGame;
  }

  /**
   * Odstráni uložený stav hry z localStorage.
   */
  removeSavedGame() {
    localStorage.clear();
  }
}
