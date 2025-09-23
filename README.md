[//]: # (Project title updated from copied templates)
# Large Number Card

![GitHub Release](https://img.shields.io/github/v/release/gaco79/large-number-card?style=for-the-badge)
![Downloads](https://img.shields.io/github/downloads/gaco79/large-number-card/total?style=for-the-badge)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/gaco79/large-number-card?style=for-the-badge)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/gaco79/large-number-card/cd.yml?style=for-the-badge)
[![BuyMeACoffee](https://img.shields.io/badge/-buy_me_a%C2%A0coffee-gray?logo=buy-me-a-coffee&style=for-the-badge)](https://www.buymeacoffee.com/gaco79)

<p align="center">A Home Assistant card to display a single number prominently.</p>


## Installation

### HACS (recommended)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=gaco79&repository=large-number-card&category=plugin)

### Manual install (Not recommended)

1. Download and copy `large-number-card.js` from the [latest release](https://github.com/gaco79/large-number-card/releases/latest) into your `config/www` directory.
2. Add the resource reference inside your `configuration.yaml`

```yaml
lovelace:
  mode: yaml
  resources:
    - url: /local/large-number-card.js
      type: module
```

## Configuration

In Home Assistant click `Edit Dashboard`, then `Add Card` and scroll down to find "Custom: Large Number Card". All options except language can be configured by the graphical editor.

#### Sample Configuration

```YAML
type: custom:large-number-card
card:
  color: red
number:
  size: 96
unit_of_measurement:
  display: false
```

| Name                    |  Type  |                      See                      |
| ----------------------- | :----: | :-----------------------------------------------: |
| `card`                | object |   { color: null, color2: null }  |
| `number`              |  bool  |                       true                        |
| `unit_of_measurement` | number |                        0.1                        |

## My Other Cards

Other Home Assistant cards by the same author:

- [Analogue clock](https://github.com/gaco79/clock-simple)
- [Time in Words](https://github.com/gaco79/gcclock-words)

## Development

To develop the card:

- Clone this repository
- Run `docker compose up -d` from the cloned directory
- Run `npm start`
- Browse to `http://localhost:8123/` and configure your home assistant development build
- Add the card to a dashboard as described above

