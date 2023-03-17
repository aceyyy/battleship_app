import React from "react";
import { ShipSizeCount, ShipType } from "../types/types";
import Shape_Carrier from "../assets/shape_carrier.png";
import Shape_Battleship from "../assets/shape_battleship.png";
import Shape_Cruiser from "../assets/shape_cruiser.png";
import Shape_Submarine from "../assets/shape_submarine.png";
import Shape_Destroyer from "../assets/shape_destroyer.png";
import Small_Circle from "../assets/small_circle.png";
import Hit_Small from "../assets/hit_small.png";

interface Props {
  shipTypes: Record<ShipType, ShipSizeCount>;
  hittedShips: Record<ShipType, number>;
  hits: Array<number[]>;
  isTablet: boolean;
  isMobile: boolean;
};

export const Stats: React.FC<Props> = ({ shipTypes, hittedShips, hits, isTablet, isMobile }) => {
  const shipMaxSize = Math.max(...Object.values(shipTypes).map(a => a.size));

  const renderShipImage = (ship: ShipType) => {
    switch (ship) {
      case ShipType.CARRIER:
        return <img src={Shape_Carrier} alt={ship} width="100%" />
      case ShipType.BATTLESHIP:
        return <img src={Shape_Battleship} alt={ship} width="100%" />
      case ShipType.CRUISER:
        return <img src={Shape_Cruiser} alt={ship} width="100%" />
      case ShipType.SUBMARINE:
        return <img src={Shape_Submarine} alt={ship} width="100%" />
      case ShipType.DESTROYER:
        return <img src={Shape_Destroyer} alt={ship} width="100%" />
      default:
        return;
    }
  };

  const renderShipImageAndSize = (obj: ShipSizeCount, currentShip: ShipType) => {
    return (
      <React.Fragment>
        <div className="ship-image-container">
          {renderShipImage(currentShip)}
        </div>
        <div className="ship-size-container">
          {new Array(shipMaxSize).fill(null).map((value2, key2) => {
            if (key2 + 1 <= obj.size) {
              if (hittedShips?.[currentShip] >= key2 + 1) {
                return <img key={key2} src={Hit_Small} alt={`hit_small${key2}`} className="small-circle-for-size" />
              }

              return <img key={key2} src={Small_Circle} alt={`small_circle${key2}`} className="small-circle-for-size" />
            }

            return <div key={key2} className="small-circle-for-size" />
          })}
        </div>
      </React.Fragment>
    )
  };

  return (
    <div className={isTablet ? "stats-container-tablet" : "stats-container"}>
      <div className="players-container">
        <div className="player-1-container">
          <div className="stats-score">{hits.length <= 10 ? `0${hits.length}` : hits.length}</div>
          <div className="stats-line" />
          <div className="stats-player-label">player 1</div>
        </div>
        <div className="player-2-container">
          <div className="stats-score">00</div>
          <div className="stats-line" />
          <div className="stats-player-label">player 2</div>
        </div>
      </div>

      <div className={isTablet ? "ships-container-tablet" : isMobile ? "ships-container-mobile" : "ships-container"}>
        {Object.keys(shipTypes).length > 0 && (
          Object.keys(shipTypes).map((value, key) => {
            const currentShip = value as ShipType;
            const obj = shipTypes[currentShip];

            return (
              <React.Fragment key={key}>
                {isTablet || isMobile ? (
                  <div className="ships-image-size-container-tablet">
                    {renderShipImageAndSize(obj, currentShip)}
                  </div>
                ) : (
                  renderShipImageAndSize(obj, currentShip)
                )}
              </React.Fragment>
            )
          })
        )}
      </div>
    </div>
  )
};