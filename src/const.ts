export const DEFAULT_CONFIG = {
    entity_id: '',
    number:
        { size: '48', color: '#FFFFFF', font_weight: 'bold', decimals: 1, font_family: 'Home Assistant' },
    unit_of_measurement:
        { display: true, as_prefix: false, display_text: null, size: '24', color: '#FFFFFF', font_weight: 'normal', font_family: 'Home Assistant' },
    card:
        { color: null, color2: null },

}

// Font registry for predefined Google Fonts
export const FONT_REGISTRY = {
    'Home Assistant': null, // Default font - no import needed
    'Rubik Microbe': 'https://fonts.googleapis.com/css2?family=Rubik+Microbe&display=swap',
    'Rubik Doodle Shadow': 'https://fonts.googleapis.com/css2?family=Rubik+Doodle+Shadow&display=swap',
    'Monofett': 'https://fonts.googleapis.com/css2?family=Monofett&display=swap'
}