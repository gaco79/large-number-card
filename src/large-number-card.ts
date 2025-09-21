import { version } from "../package.json";
import { customElement } from "lit/decorators.js";

@customElement("large-number-card")
class LargeNumberCard extends HTMLElement {

  content;
  config;
  _hass;
  numberEl;


  set hass(hass) {
    // store hass internally and re-render when it changes
    this._hass = hass;
    console.log("HASS object updated:", hass);
    this.updateContent();
  }

  updateContent() {
    // compute display text from hass + config
    let display = "0";

    const hasEntityId = this.config && this.config.entity_id;
    const hassStates = this._hass && this._hass.states;

    if (hasEntityId && hassStates) {
      const stateObj = hassStates[this.config.entity_id];
      if (stateObj) {
        display = stateObj.state;
        // append unit if available
        if (stateObj.attributes && stateObj.attributes.unit_of_measurement) {
          display = `${display} ${stateObj.attributes.unit_of_measurement}`;
        }
      } else {
        display = "unknown";
      }
    } else if (hasEntityId && !hassStates) {
      // hass not yet available
      display = "loading";
    }

    if (!this.content) {
      const card = document.createElement("ha-card");

      card.style.padding = "16px";
      card.style.background = "linear-gradient(135deg, #4f46e5, #06b6d4)";
      card.style.color = "white";
      card.style.borderRadius = "1rem";
      card.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";

      const number = document.createElement("div");
      number.textContent = display;
      number.style.fontSize = "2rem";
      number.style.fontWeight = "bold";
      number.style.marginBottom = "12px";

      card.appendChild(number);

      this.appendChild(card);
      this.content = card;
      this.numberEl = number;
    } else {
      // update existing element
      if (this.numberEl) {
        this.numberEl.textContent = display;
      } else {
        // fallback: find the first div in the card
        const el = this.content.querySelector("div");
        if (el) {
          el.textContent = display;
          this.numberEl = el;
        }
      }
    }
  }

  setConfig(config) {
    this.config = config || {};
    if (!this.config.entity_id) {
      console.warn('large-number-card: no entity_id provided in config');
    }
    this.updateContent();
  }

  getCardSize() {
    return 2;
  }
}


// Add this type declaration to fix TypeScript error re customCard
declare global {
  interface Window {
    customCards: Array<{
      type: string;
      name: string;
      description: string;
    }>;
  }
}

/* eslint no-console: 0 */
console.info(
  `%c large-number-card ${version}`,
  'color: white; background-color:rgba(109, 51, 109, 1); font-weight: 700;'
);

// This puts your card into the UI card picker dialog
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'large-number-card',
  name: 'Large Number',
  description: 'Card displaying a large number.',
});