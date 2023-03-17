import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { Stats } from './components/Stats';
import { Board } from './components/Board';
import { mockResponse } from './mocks/mockResponse';
import { CellProps, HittedShips, ScreenMode, ShipResponse, ShipType } from './types/types';
import { isScreenModeMobile, isScreenModeTablet, setValueFromScreenMode } from './utils/utils';
import './App.css';

const boardSize = 10;

const hittedShipsInitialize = {} as HittedShips;

function App() {
  const [screenMode, setScreenMode] = useState<ScreenMode>(setValueFromScreenMode(false) as ScreenMode);
  const [boardWidth, setBoardWidth] = useState<number>(setValueFromScreenMode(true) as number);
  const [hits, setHits] = useState<Array<number[]>>([]);
  const [misses, setMisses] = useState<Array<number[]>>([]);
  const [hittedShips, setHittedShips] = useState<HittedShips>(hittedShipsInitialize);

  const boardRef = useRef<HTMLDivElement>(null);

  const isTablet = isScreenModeTablet(screenMode);
  const isMobile = isScreenModeMobile(screenMode);

  const data: ShipResponse = (mockResponse);
  const { shipTypes, layout } = data;

  const shipTotalSize = Object.keys(shipTypes).length > 0 ? Object.values(shipTypes).reduce((a, v) => a = a + v.size, 0) : 0;

  const generateBoard = useCallback(() => {
    const newBoard = [];

    for (let i = 0; i < boardSize; i++) {
      const newRow = [];

      for (let j = 0; j < boardSize; j++) {
        newRow.push({
          x: j,
          y: i,
          hasShip: false,
          shipType: "",
        });
      }

      newBoard.push(newRow);
    }

    for (const ship of layout) {
      for (const position of ship.positions) {
        const [row, col] = position;
        newBoard[row][col].hasShip = true;
        newBoard[row][col].shipType = ship.ship;
      }
    }

    return newBoard;
  }, [layout]);

  const board = generateBoard();

  const onCellClick = ({ x, y, hasShip, shipType }: CellProps) => {
    const currentShipType = shipType as ShipType

    if (hasShip) {
      setHits([...hits, [x, y]]);

      if (hittedShips?.[currentShipType]) {
        setHittedShips({ ...hittedShips, [shipType]: hittedShips[currentShipType] + 1 });
      } else {
        setHittedShips({ ...hittedShips, [shipType]: 1 })
      };

    } else {
      setMisses([...misses, [x, y]]);
    };
  };

  const updateBoardWidth = () => {
    if (boardRef && boardRef.current) {
      const boardWidth = boardRef.current.offsetWidth;

      if (boardWidth) {
        setBoardWidth(boardWidth);
      }
    }

    const valueFromScreenMode = setValueFromScreenMode(false) as ScreenMode;
    setScreenMode(valueFromScreenMode);
  };

  const resetGame = useCallback(() => {
    generateBoard();
    setHits([])
    setMisses([])
    setHittedShips(hittedShipsInitialize);
  }, [generateBoard]);

  useEffect(() => {
    if (shipTotalSize === hits.length) {
      // set a delay to mark the last hitted battleship
      setTimeout(() => {
        alert("GAME OVER!");
        resetGame();
      }, 100);
    }
  }, [hits.length, shipTotalSize, resetGame])

  useEffect(() => {
    window.addEventListener('resize', updateBoardWidth);
    return () => {
      window.removeEventListener('resize', updateBoardWidth);
    }
  }, []);

  return (
    <div className="App">
      <Header screenMode={screenMode} />
      {isMobile || isTablet ? (
        <div className={isMobile ? "content-container-mobile" : "content-container-tablet"}>
          <Board
            board={board}
            boardWidth={boardWidth}
            boardRef={boardRef}
            hits={hits}
            misses={misses}
            onCellClick={onCellClick}
            isTablet={isTablet}
            isMobile={isMobile}
          />
          <Stats
            shipTypes={shipTypes}
            hittedShips={hittedShips}
            hits={hits}
            isTablet={isTablet}
            isMobile={isMobile}
          />
        </div>
      ) : (
        <div className="content-container-desktop">
          <Stats
            shipTypes={shipTypes}
            hittedShips={hittedShips}
            hits={hits}
            isTablet={isTablet}
            isMobile={isMobile}
          />
          <Board
            board={board}
            boardWidth={boardWidth}
            boardRef={boardRef}
            hits={hits}
            misses={misses}
            onCellClick={onCellClick}
            isTablet={isTablet}
            isMobile={isMobile}
          />
        </div>
      )}
    </div>
  );
}

export default App;
