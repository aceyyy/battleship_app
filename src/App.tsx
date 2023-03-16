import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { Stats } from './components/Stats';
import { Board } from './components/Board';
import { mockResponse } from './mocks/mockResponse';
import { CellProps, ScreenMode, ShipResponse, ShipType } from './types/types';
import './App.css';



export type HittedShips = Record<ShipType, number>;

const hittedShipsInitialize = {} as HittedShips;

const boardSize = 10;

const setDefaultValueFromScreenMode = (isBoardWidth: boolean) => {
  const width = window.innerWidth;

  if (width < 900) {
    return isBoardWidth ? window.innerWidth - 40 : ScreenMode.MOBILE;
  } else if (width < 1200) {
    return isBoardWidth ? window.innerWidth - 131 : ScreenMode.TABLET;
  } else {
    return isBoardWidth ? window.innerWidth - 690 : ScreenMode.DESKTOP;
  }
};

function App() {
  const [screenMode, setScreenMode] = useState<ScreenMode>(setDefaultValueFromScreenMode(false) as ScreenMode);
  const [boardWidth, setBoardWidth] = useState<number>(setDefaultValueFromScreenMode(true) as number);
  const [hits, setHits] = useState<Array<number[]>>([]);
  const [misses, setMisses] = useState<Array<number[]>>([]);
  const [hittedShips, setHittedShips] = useState<HittedShips>(hittedShipsInitialize);

  const boardRef = useRef<HTMLDivElement>(null);

  const isDesktop = screenMode === ScreenMode.DESKTOP;
  const isMobile = screenMode === ScreenMode.MOBILE;

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
        setHittedShips({ ...hittedShips, [shipType]: hittedShips?.[currentShipType] + 1 });
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

    const currentScreenWidth = window.innerWidth;

    if (currentScreenWidth < 900) {
      setScreenMode(ScreenMode.MOBILE);
    } else if (currentScreenWidth < 1300) {
      setScreenMode(ScreenMode.TABLET);
    } else {
      setScreenMode(ScreenMode.DESKTOP);
    }
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
        alert(`PLAYER 1 SCORE: ${misses.length}\nPLAYER 2 SCORE: 0\nGAME OVER!`);
        resetGame();
      }, 300);
    }
  }, [hits.length, misses.length, shipTotalSize, resetGame])

  useEffect(() => {
    window.addEventListener('resize', updateBoardWidth);
    return () => {
      window.removeEventListener('resize', updateBoardWidth);
    }
  }, []);

  return (
    <div className="App">
      <Header screenMode={screenMode} />
      {isDesktop ? (
        <div className="content-container-desktop">
          <Stats
            shipTypes={shipTypes}
            hittedShips={hittedShips}
            misses={misses}
            screenMode={screenMode}
          />
          <Board
            board={board}
            boardWidth={boardWidth}
            boardRef={boardRef}
            hits={hits}
            misses={misses}
            onCellClick={onCellClick}
            screenMode={screenMode}
          />
        </div>
      ) : (
        <div className={isMobile ? "content-container-mobile" : "content-container-tablet"}>
          <Board
            board={board}
            boardWidth={boardWidth}
            boardRef={boardRef}
            hits={hits}
            misses={misses}
            onCellClick={onCellClick}
            screenMode={screenMode}
          />
          <Stats
            shipTypes={shipTypes}
            hittedShips={hittedShips}
            misses={misses}
            screenMode={screenMode}
          />
        </div>
      )}
    </div>
  );
}

export default App;
