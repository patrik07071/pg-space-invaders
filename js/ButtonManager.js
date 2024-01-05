/**
 * ButtonManager.js
 * Autori: David Stromp, Patrik Barna
 * Dátum: 3.1.2024
 * Verzia: 1.0.0
 * Popis: Tento súbor definuje triedu ButtonManager, ktorá zodpovedá za správu udalostí tlačidiel v menu, v obchode a aj v hre ako napríklad pauza hry.
 * Hlavný program: Game.js
 */

export class ButtonManager {
  /**
   * Konštruktor triedy ButtonManager
   * @param {Object} menu - Referencia na objekt menu hry.
   * @param {Object} shop - Referencia na objekt obchodu v hre.
   */
  constructor(menu, shop) {
    this.menu = menu;
    this.shop = shop;
    this.setupButtonActions();
  }

  /**
   * Nastaví udalosti tlačidiel pre menu, obchod, pauzu a koniec hry.
   */
  setupButtonActions() {
    const buttonActions = {
      startButton: () => this.menu.handleStartButton(),
      continueButton: () => this.menu.handleContinueButton(),
      shopButton: () => this.shop.toggleShop(),
      closeShop: () => this.shop.toggleShop(),
      confirmNewGame: () => this.menu.handleConfirmNewGame(),
      cancelNewGame: () =>
        this.menu.toggleDisplay("newGameConfirmationOverlay", "none"),
      resumeGame: () => this.menu.togglePauseMenu(),
      resetGame: () => this.menu.handleResetGame(),
      goToMainMenu: () => this.menu.handleGoToMainMenu(),
      pauseGoToMainMenu: () => this.menu.handlePauseGoToMainMenu(),
    };

    // Registrácia udalostí pre každé tlačidlo
    for (const [buttonId, action] of Object.entries(buttonActions)) {
      const button = document.getElementById(buttonId);
      if (button) {
        button.addEventListener("click", action);
      }
    }
  }
}
