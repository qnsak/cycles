import {
  eventName as weaponSelectorEvent,
  WeaponSelectorActions,
} from '../../actions/weaponSelector';

import TileUnit from '../TileUnit';
import ActionButton from './ActionButton';
import ActionsMenu from './ActionsMenu';

export default class WeaponSelectorMenu extends ActionsMenu {
  protected linesTiles = {
    top     : [2674, 2675, 2675, 2675, 2675, 2675, 2675, 2676],
    middle  : [2704, 2705, 2705, 2705, 2705, 2705, 2705, 2706],
    bottom  : [2734, 2735, 2735, 2735, 2735, 2735, 2735, 2736],
  };

  private buttonWidth: number = 200;

  constructor(scene: Phaser.Scene, layer: Phaser.Tilemaps.DynamicTilemapLayer) {
    super(scene, layer);
  }

  protected createAdditionalButtons() {
    const container = this.scene.add.container(0, 0);

    const { tile } = this;

    if (tile) {
      const tileUnit = tile.properties.tileUnit as TileUnit;
      const unit = tileUnit.getUnit();
      const weapons = unit.inventory.getWeapons();

      const weaponButtons = weapons.map((weapon, index) => {
        const coord = { x: 0, y: (index + 1) * 30 };
        return this.createWeaponButton(weapon, coord);
      });

      container.add(weaponButtons);
    }

    return container;
  }

  protected createPermanentButtons() {
    const container = this.scene.add.container(0, 0);

    const cancel = this.createCancelButton();

    container.add(cancel);

    return container;
  }

  private createCancelButton() {
    const button = new ActionButton(this.scene, {
      onClick: () => {
        this
          .hide()
          .sendAction(WeaponSelectorActions.cancel);
      },
      text: 'cancel',
      width: 200,
    });

    return button.getContainer();
  }

  private createWeaponButton(weapon: Weapon, coord?: Coord) {
    const button = new ActionButton(this.scene, {
      coord,
      onClick: () => {
        this.hide();
        console.log(weapon);
      },
      text: `${weapon.name}         x${weapon.usage}`,
      width: this.buttonWidth,
    });

    return button.getContainer();
  }

  /** Send attack's action to the scene (through event). */
  private sendAction(action: string) {
    this.scene.events.emit(`${weaponSelectorEvent}${action}`, this.tile);
  }
}