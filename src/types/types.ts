export enum ScreenMode {
  DESKTOP = 'desktop',
  TABLET = 'tablet',
  MOBILE = 'mobile'
}

export interface CellProps {
  x: number;
  y: number;
  hasShip: boolean;
  shipType: string;
}

export enum ShipType {
  CARRIER = 'carrier',
  BATTLESHIP = "battleship",
  CRUISER = "cruiser",
  SUBMARINE = "submarine",
  DESTROYER = "destroyer",
}

export interface ShipSizeCount {
  size: number;
  count: number;
}

export interface ShipLayout {
  ship: string;
  positions: Array<number[]>;
}

export interface ShipResponse {
  shipTypes: Record<ShipType, ShipSizeCount>;
  layout: ShipLayout[];
}