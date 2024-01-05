/**
 * ShopItem.js
 * Autori: David Stromp, Patrik Barna
 * Dátum: 3.1.2024
 * Verzia: 1.0.0
 * Popis: Reprezentuje položku v hernom obchode a spravuje jej nákup a dostupnosť.
 * Hlavný program: Shop.js
 */

export class ShopItem {
  /**
   * Konštruktor pre ShopItem.
   * @param {string} name - Názov položky obchodu.
   * @param {string} description - Popis položky obchodu.
   * @param {number} cost - Cena položky.
   * @param {Function} onPurchase - Funkcia, ktorá sa vykoná pri nákupe položky.
   * @param {number} limit - Maximálna hodnota alebo limit pre položku.
   * @param {number} currentAmount - Aktuálna hodnota alebo počet položky.
   */
  constructor(name, description, cost, onPurchase, limit, currentAmount) {
    this.name = name;
    this.description = description;
    this.cost = cost;
    this.onPurchase = onPurchase;
    this.limit = limit;
    this.currentAmount = currentAmount;
  }

  /**
   * Vykoná nákup tejto položky.
   * @param {Object} game - Hlavný objekt hry.
   * @param {Function} popup - Funkcia na zobrazenie vyskakovacej informácie.
   */
  purchase(game, popup) {
    if (game.scoreManager.score >= this.cost) {
      game.scoreManager.decreaseScore(this.cost);
      this.onPurchase(game);
      popup();
    } else {
      alert("Not enough score!");
    }
  }

  /**
   * Určuje, či je položka obchodu na svojom maximálnom limite.
   * @returns {boolean} Vráti true, ak je položka maximálne vylepšená.
   */
  isMaxedOut() {
    if (this.name === "Reduce Cooldown") {
      return this.currentAmount <= this.limit;
    }
    return this.currentAmount >= this.limit;
  }

  /**
   * Aktualizuje tlačidlo na základe toho, či je položka maximálne vylepšená.
   * @param {HTMLElement} button - Tlačidlo priradené k tejto položke obchodu.
   * @param {boolean} isMaxed - Indikátor, či je položka na svojom limite.
   */
  updateButton(button, isMaxed) {
    if (isMaxed) {
      button.textContent = "MAX";
      button.disabled = true;
      button.style.backgroundColor = "grey";
    } else {
      button.textContent = "Buy";
      button.disabled = false;
      button.style.backgroundColor = "";
    }
  }

  /**
   * Aktualizuje položku na novú zakúpenú hdonotu.
   * @param {number} newValue - Nová hodnota položky.
   */
  updateCurrentCount(newValue) {
    this.currentAmount = newValue;
  }
}
