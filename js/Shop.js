/**
 * Shop.js
 * Autori: David Stromp, Patrik Barna
 * Dátum: 3.1.2024
 * Verzia: 1.0.0
 * Popis: Spravuje funkcionality obchodu v hre, vrátane zobrazenia, aktualizácie a nákupu položiek.
 * Hlavný program: Game.js
 */

import { ShopItem } from "./ShopItem.js";
export class Shop {
  /**
   * Konštruktor pre triedu Shop.
   * @param {Object} game - Hlavný objekt hry.
   * @param {Menu} menu - Objekt menu pre správu overlayov.
   * @param {HealthManager} healthManager - Manažér zdravia pre správu zdravotných položiek.
   */
  constructor(game, menu, healthManager) {
    this.game = game;
    this.menu = menu;
    this.healthManager = healthManager;
    this.shopItems = {};
    this.setupShopItems();
  }

  /**
   * Získa DOM element podľa jeho ID.
   * @param {string} elementId - ID DOM elementu, ktorý má byť získaný.
   * @returns {HTMLElement} - Vráti vybraný DOM element.
   */
  getElement(elementId) {
    return document.getElementById(elementId);
  }

  /**
   * Zmení CSS vlastnosť 'display' zvoleného DOM elementu.
   * @param {string} elementId - ID DOM elementu, ktorého zobrazenie sa má zmeniť.
   * @param {string} displayStyle - Štýl zobrazenia (napr. 'none', 'flex').
   */
  toggleDisplay(elementId, displayStyle) {
    const element = this.getElement(elementId);
    element && (element.style.display = displayStyle);
  }

  /**
   * Zobrazí overlay (prekryvný element) na základe jeho ID.
   * @param {string} overlayId - ID overlayu, ktorý sa má zobraziť.
   */
  showOverlay(overlayId) {
    this.toggleDisplay(overlayId, "flex");
  }

  /**
   * Skryje overlay (prekryvný element) na základe jeho ID.
   * @param {string} overlayId - ID overlayu, ktorý sa má skryť.
   */
  hideOverlay(overlayId) {
    this.toggleDisplay(overlayId, "none");
  }

  /**
   * Vytvorí položky obchodu a priradí im funkcionality.
   */
  setupShopItems() {
    this.shopItems["reduceCooldown"] = new ShopItem(
      "Reduce Cooldown",
      "Reduces shooting cooldown.",
      200,
      (game) => {
        game.bulletCooldown -= 0.05;
      },
      0.25,
      this.game.bulletCooldown,
    );
    this.shopItems["increaseBSpeed"] = new ShopItem(
      "Increase Bullet Speed",
      "Increase the speed at which the bullet projectile goes",
      250,
      (game) => {
        game.bulletSpeed += 0.05;
      },
      0.75,
      this.game.bulletSpeed,
    );
    this.shopItems["increaseHealth"] = new ShopItem(
      "Increase Health",
      "Increase current health",
      500,
      (game) => {
        game.healthManager.increaseHealth();
      },
      3,
      this.healthManager.healthCount,
    );

    for (let key in this.shopItems) {
      this.createShopItemElement(this.shopItems[key], key);
    }
  }

  /**
   * Vytvorí HTML element pre položku obchodu a pridá ho do obchodného rozhrania.
   * @param {ShopItem} shopItem - Objekt položky obchodu.
   * @param {string} shopItemKey - Identifikátor položky obchodu.
   */
  createShopItemElement(shopItem, shopItemKey) {
    const shopMenu = this.getElement("gameShopOverlay").querySelector(
      ".overlayShopContent",
    );

    const itemContainer = document.createElement("div");
    itemContainer.className = "shop-item";

    const itemName = document.createElement("h4");
    itemName.textContent = shopItem.name;
    itemContainer.appendChild(itemName);

    const itemPrice = document.createElement("p");
    itemPrice.textContent = `Cost: ${shopItem.cost}`;
    itemContainer.appendChild(itemPrice);

    const buyButton = document.createElement("button");
    buyButton.textContent = "Buy";
    buyButton.id = shopItem.name + "-buyButton";
    buyButton.className = "menuButton";
    buyButton.addEventListener("click", () => {
      shopItem.purchase(this.game, () => this.showPopup(buyButton));
      this.updateItemCurrentCount(shopItemKey);
      this.game.render();
    });
    itemContainer.appendChild(buyButton);

    const itemDescription = document.createElement("p");
    itemDescription.className = "item-description";
    itemDescription.textContent = shopItem.description;
    itemContainer.appendChild(itemDescription);

    const closeButton = shopMenu.querySelector("#closeShop");
    shopMenu.insertBefore(itemContainer, closeButton);
  }

  /**
   * Zobrazí alebo skryje obchodné rozhranie.
   */
  toggleShop() {
    this.updateItemCurrentCount();
    const element = this.getElement("gameShopOverlay");
    const elementStatus = window.getComputedStyle(element).display;

    if (this.menu.isMainMenuVisible) {
      this.toggleDisplay(
        "gameShopOverlay",
        elementStatus === "none" ? "flex" : "none",
      );
    } else {
      if (this.game.isGameActive) {
        this.showOverlay("gameShopOverlay");
        this.game.isGameActive = false;
      } else if (!this.game.isGameActive && elementStatus !== "none") {
        this.hideOverlay("gameShopOverlay");
        this.game.isGameActive = true;
        this.game.startGameLoop();
      }
    }
  }

  /**
   * Aktualizuje dostupnosť a stav položiek v obchode.
   * @param {string} [currentItemKey] - Kľúč aktuálnej položky, ktorá má byť aktualizovaná.
   */
  updateItemCurrentCount(currentItemKey) {
    if (currentItemKey) {
      switch (currentItemKey) {
        case "reduceCooldown":
          this.shopItems["reduceCooldown"].updateCurrentCount(
            this.game.bulletCooldown,
          );
          break;
        case "increaseHealth":
          this.shopItems["increaseHealth"].updateCurrentCount(
            this.healthManager.healthCount,
          );
          break;
        case "increaseBSpeed":
          this.shopItems["increaseBSpeed"].updateCurrentCount(
            this.game.bulletSpeed,
          );
          break;
      }

      const shopItem = this.shopItems[currentItemKey];
      const buyButton = document.getElementById(
        this.shopItems[currentItemKey].name + "-buyButton",
      );
      const isMaxed = shopItem.isMaxedOut();
      shopItem.updateButton(buyButton, isMaxed);
    } else {
      for (let key in this.shopItems) {
        this.updateItemCurrentCount(key);
      }
    }
  }

  /**
   * Zobrazí vyskakovací bublinu (popup) po zakúpení položky.
   * @param {HTMLElement} button - Tlačidlo, ktoré bolo stlačené na nákup položky.
   */
  showPopup(button) {
    const popup = document.getElementById("popupMessage");
    const buttonPos = button.getBoundingClientRect();

    popup.style.left = buttonPos.left + (button.offsetWidth / 2) + "px";
    popup.style.top = window.scrollY + buttonPos.top - 70 + "px";
    popup.style.display = "block";

    setTimeout(function () {
      popup.style.display = "none";
    }, 1000);
  }
}
