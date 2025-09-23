import { version } from "../package.json";
import { customElement } from "lit/decorators.js";
import { DEFAULT_CONFIG } from "./const";

/**
 * LargeNumberCard
 *
 * A lightweight Home Assistant custom element (<large-number-card>) that displays a single
 * large numeric value with an optional unit of measurement. The element watches the
 * Home Assistant `hass` object (setter `hass`) and re-renders whenever the underlying
 * state for the configured `entity_id` changes.
 *
 * Responsibilities
 * - Merge user configuration with a DEFAULT_CONFIG using a deep merge so nested config
 *   objects (e.g. `number`, `unit_of_measurement`, `card`) are merged rather than replaced.
 * - Render a simple card (ha-card) with centered content and a configurable gradient
 *   background, text color and typographic styles for the number and unit.
 * - Handle different display states: loading (when hass not available), unknown (when
 *   entity not found) and the actual entity state string. If a unit is present in the
 *   entity attributes it will be shown according to the `unit_of_measurement` config.
 *
 * Example
 * @example
 * // Typical configuration passed to setConfig
 * {
 *   entity_id: "sensor.temperature",
 *   number: { size: 48, font_weight: "700", color: "#fff" },
 *   unit_of_measurement: { display: true, size: 14, as_prefix: false, color: "#eee" },
 *   card: { color: "#2196F3", color2: "#21CBF3" }
 * }
 *
 * Properties
 * @property {HTMLElement | undefined} content - Root card element (ha-card) appended to this custom element.
 * @property {any} config - Effective configuration (DEFAULT_CONFIG deep-merged with user config).
 * @property {any} _hass - Internal reference to the latest Home Assistant `hass` object.
 * @property {HTMLElement | undefined} numberEl - Container element that holds the numeric value and unit.
 *
 * Methods
 * @method
 * set hass(hass: any)
 * @param {any} hass - Home Assistant object. Setter stores the value internally and triggers re-render.
 *
 * @method
 * updateContent(): void
 * @remarks
 * Compute the display text from the merged `config` and the current `_hass` states,
 * create the DOM structure on first render (ha-card + number container) or update the
 * existing DOM elements on subsequent renders. Applies card and layout styles derived
 * from `config.card` and delegates number/unit rendering to updateNumberDisplay.
 *
 * @method
 * updateNumberDisplay(display: string, unit_of_measurement_text: string): void
 * @param {string} display - The text to render as the primary numeric value (usually an entity state).
 * @param {string} unit_of_measurement_text - The unit text to render (may be empty).
 * @remarks
 * Ensures the number and unit <span> elements exist, updates their textContent and styles
 * (font size, weight, color) using values from `config.number` and `config.unit_of_measurement`.
 * When `unit_of_measurement.as_prefix` is true the layout direction is reversed so the unit
 * appears before the number.
 *
 * @method
 * private deepMerge(target: any, source: any): any
 * @param {any} target - The target object to merge into (usually DEFAULT_CONFIG or a nested portion).
 * @param {any} source - The source object whose values overwrite or extend target values.
 * @returns {any} A new object representing a deep merge of target and source. Nested plain objects are merged;
 *          primitive values and arrays are replaced by the source.
 * @private
 *
 * @method
 * setConfig(config: any): void
 * @param {any} config - User provided configuration object. This is deep-merged with DEFAULT_CONFIG.
 * @remarks
 * If `entity_id` is missing a console warning is emitted. After merging the configuration the card is rendered/updated.
 *
 * @method
 * getCardSize(): number
 * @returns {number} The approximate height/size of the card (used by Home Assistant layout). This card returns 2.
 *
 * Notes
 * - This class is written as a native custom element (extends HTMLElement) and expects to be
 *   registered as @customElement("large-number-card") elsewhere in the codebase.
 * - Types are intentionally loose (any) for `hass` and `config` because the component is
 *   primarily configured with plain JS objects and integrates with Home Assistant's dynamic shape.
 */
@customElement("large-number-card")
class LargeNumberCard extends HTMLElement {

  content;
  config;
  _hass;
  numberEl;
  card;


  set hass(hass) {
    // store hass internally and re-render when it changes
    this._hass = hass;
    this.updateContent();
  }

  /**
   * Compute the display text and unit from hass + config.
   */
  private computeDisplayTexts() {
    let state_display_text = "0";
    let unit_of_measurement_text = "";

    const hasEntityId = this.config && this.config.entity_id;
    const hassStates = this._hass && this._hass.states;

    if (hasEntityId && hassStates) {
      const stateObj = hassStates[this.config.entity_id];

      if (stateObj) {
        state_display_text = stateObj.state;

        // unit if available
        if (stateObj.attributes && stateObj.attributes.unit_of_measurement) {
          unit_of_measurement_text = stateObj.attributes.unit_of_measurement;
        }
      } else {
        state_display_text = "unknown";
      }
    } else if (hasEntityId && !hassStates) {
      // hass not yet available
      state_display_text = "loading";
    }

    return { state_display_text, unit_of_measurement_text };
  }

  /**
   * If card.color is a template, render it via hass.callApi and update config.card.color.
   */
  private async applyCardTemplateColor() {
    if (!this.config || !this.config.card || !this.config.card.color) return;

    const colorTemplate = this.config.card.color;
    if (colorTemplate.includes("{{") || colorTemplate.includes("{%")) {
      if (this._hass && typeof this._hass.callApi === "function") {
        try {
          const rendered: any = await this._hass.callApi('POST', 'template', {
            template: colorTemplate
          });
          if (typeof rendered === "string" && rendered.trim() !== "") {
            this.config.card.color = rendered.trim();
            // no immediate re-render here; caller may continue to update content
          }
          console.log("rendered color: ", this.config.card.color);
        } catch (err: any) {
          console.warn("large-number-card: template render failed", err);
        }
      }
    }
  }

  /**
   * Ensure the ha-card and number container exist and are initialized.
   */
  private ensureCard() {
    if (this.content) return;

    this.card = document.createElement("ha-card");

    this.card.style.display = "flex";
    this.card.style.justifyContent = "center";
    this.card.style.alignItems = "center";
    this.card.style.padding = "16px";
    this.card.style.color = "white";

    const numberBox = document.createElement("div");
    numberBox.style.display = "flex";
    numberBox.style.flexDirection = "row";
    numberBox.style.justifyContent = "center";
    numberBox.style.alignItems = "center";

    this.numberEl = numberBox;

    this.card.appendChild(numberBox);
    this.appendChild(this.card);

    this.content = this.card;
  }

  async updateContent() {
    // compute display text from hass + config
    const { state_display_text, unit_of_measurement_text } = this.computeDisplayTexts();

    // evaluate templates in card color if needed (may update config.card.color)
    await this.applyCardTemplateColor();

    // create card and number container if this is first render
    this.ensureCard();

    // update number & unit elements and styles
    if (this.numberEl) {
      this.updateNumberDisplay(state_display_text, unit_of_measurement_text);
    }
  }

  updateNumberDisplay(state_display_text, unit_of_measurement_text) {
    // apply card gradient if color is static
    if (this.config.card.color && !this.config.card.color.includes("{{")) {
      console.log("large-number-card: applying card colors", this.config.card.color, this.config.card.color2);
      this.card.style.background = `linear-gradient(135deg, ${this.config.card.color}, ${this.config.card.color2 || this.config.card.color})`;
    }

    // ensure number span
    let number = this.numberEl.querySelector("span#number");
    if (!number) {
      number = document.createElement("span");
      number.id = "number";
      // small separation to unit handled by unit element margin
    }
    number.textContent = state_display_text;
    number.style.fontSize = this.config.number.size + "px";
    number.style.fontWeight = this.config.number.font_weight;
    number.style.color = this.config.number.color;

    // append or re-append ensures ordering when direction changes
    if (!number.parentElement) {
      this.numberEl.appendChild(number);
    }

    // handle unit if displayed
    if (this.config.unit_of_measurement.display) {
      let unit_of_measurement_element = this.numberEl.querySelector("span#unit_of_measurement");

      if (!unit_of_measurement_element) {
        unit_of_measurement_element = document.createElement("span");
        unit_of_measurement_element.id = "unit_of_measurement";
      }

      unit_of_measurement_element.textContent = unit_of_measurement_text;
      unit_of_measurement_element.style.fontSize = this.config.unit_of_measurement.size + "px";
      unit_of_measurement_element.style.fontWeight = this.config.unit_of_measurement.font_weight;
      unit_of_measurement_element.style.color = this.config.unit_of_measurement.color;
      unit_of_measurement_element.style.margin = "0 8px";

      if (!unit_of_measurement_element.parentElement) {
        this.numberEl.appendChild(unit_of_measurement_element);
      }
    } else {
      // remove unit element if present and not desired
      const existingUnit = this.numberEl.querySelector("span#unit_of_measurement");
      if (existingUnit && existingUnit.parentElement) {
        existingUnit.parentElement.removeChild(existingUnit);
      }
    }

    // layout direction when unit is prefix
    if (this.config.unit_of_measurement.display && this.config.unit_of_measurement.as_prefix) {
      this.numberEl.style.flexDirection = "row-reverse";
    } else {
      this.numberEl.style.flexDirection = "row";
    }
  }

  /**
    Deep merge helper to merge nested config objects like number, unit_of_measurement, card
  */
  private deepMerge(target: any, source: any): any {
    const out: any = Array.isArray(target) ? [...target] : { ...target };
    if (source && typeof source === "object") {
      for (const key of Object.keys(source)) {
        const val = source[key];
        if (val && typeof val === "object" && !Array.isArray(val)) {
          out[key] = this.deepMerge(target ? target[key] : {}, val);
        } else {
          out[key] = val;
        }
      }
    }
    return out;
  }

  setConfig(config) {
    this.config = this.deepMerge(DEFAULT_CONFIG, config || {});
    console.log("large-number-card: effective config", this.config);

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