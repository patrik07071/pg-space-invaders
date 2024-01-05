/**
 * Menu.js
 * Autori: David Stromp, Patrik Barna
 * Dátum: 3.1.2024
 * Verzia: 1.0.0
 * Popis: Spravuje logiku a zobrazenie menu a overlayov v hre.
 * Hlavný program: Game.js
 */

export class Menu {
  /**
   * Konštruktor pre triedu Menu.
   * @param {Object} game - Hlavný objekt hry.
   * @param {GameState} gameState - Stav hry pre správu uložených hier.
   */
  constructor(game, gameState) {
    this.game = game;
    this.gameState = gameState;
    this.isMainMenuVisible = true;
  }

  /**
   * Získa DOM element podľa ID.
   * @param {string} elementId - ID DOM elementu.
   * @returns {HTMLElement} - Vráti vybraný DOM element.
   */
  getElement(elementId) {
    return document.getElementById(elementId);
  }

  /**
   * Prepne zobrazenie elementu.
   * @param {string} elementId - ID elementu, ktorého zobrazenie sa má zmeniť.
   * @param {string} displayStyle - CSS vlastnosť 'display' pre zmenu zobrazenia.
   */
  toggleDisplay(elementId, displayStyle) {
    const element = this.getElement(elementId);
    element && (element.style.display = displayStyle);
  }

  /**
   * Zobrazí overlay s daným ID.
   * @param {string} overlayId - ID overlayu na zobrazenie.
   */
  showOverlay(overlayId) {
    this.toggleDisplay(overlayId, "flex");
  }

  /**
   * Skryje overlay s daným ID.
   * @param {string} overlayId - ID overlayu na skrytie.
   */
  hideOverlay(overlayId) {
    this.toggleDisplay(overlayId, "none");
  }

  /**
   * Ošetruje stlačenie tlačidla "Start".
   * Spustí novú hru alebo zobrazí overlay pre potvrdenie novej hry.
   */
  handleStartButton() {
    if (this.gameState.retrieveSavedGame()) {
      this.showOverlay("newGameConfirmationOverlay");
    } else {
      this.hideOverlay("mainMenu");
      this.game.startGame();
      this.isMainMenuVisible = false;
    }
  }

  /**
   * Ošetruje stlačenie tlačidla "Continue".
   * Pokračuje v uloženej hre.
   */
  handleContinueButton() {
    this.hideOverlay("mainMenu");
    this.game.continueGame();
    this.isMainMenuVisible = false;
  }

  /**
   * Ošetruje potvrdenie začatia novej hry.
   */
  handleConfirmNewGame() {
    this.hideOverlay("newGameConfirmationOverlay");
    this.hideOverlay("mainMenu");
    this.gameState.removeSavedGame();
    this.game.startGame();
    this.isMainMenuVisible = false;
  }

  /**
   * Ošetruje reset hry.
   */
  handleResetGame() {
    this.hideOverlay("gameOverOverlay");
    this.gameState.removeSavedGame();
    this.game.startGame();
    this.isMainMenuVisible = false;
  }

  /**
   * Ošetruje prechod do hlavného menu z pauzy.
   */
  handlePauseGoToMainMenu() {
    this.hideOverlay("pauseMenuOverlay");
    this.gameState.disableContBttIfNoSavedGame();
    this.showMenu();
  }

  /**
   * Ošetruje prechod do hlavného menu po ukončení hry.
   */
  handleGoToMainMenu() {
    this.hideOverlay("gameOverOverlay");
    this.gameState.removeSavedGame();
    this.game.resetInitGame();
    this.showMenu();
  }

  /**
   * Prepína okno pauzovania hry.
   */
  togglePauseMenu() {
    if (this.game.isGameActive) {
      this.showOverlay("pauseMenuOverlay");
      this.game.isGameActive = false;
    } else {
      this.hideOverlay("pauseMenuOverlay");
      this.game.isGameActive = true;
      this.game.startGameLoop();
    }
  }

  /**
   * Zobrazí overlay po ukončení hry.
   */
  openGameOverOverlay() {
    this.showOverlay("gameOverOverlay");
    this.game.isGameActive = false;
  }

  /**
   * Zobrazí hlavné menu.
   */
  showMenu() {
    this.showOverlay("mainMenu");
    this.isMainMenuVisible = true;
  }
}
