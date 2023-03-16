import Hit from "../assets/hit.png";
import Hit_Miss from "../assets/hit_miss.png";
import { CellProps, ScreenMode } from "../types/types";

interface Props {
  board: Array<CellProps[]>;
  boardWidth: number;
  boardRef: React.Ref<HTMLDivElement>;
  hits: Array<number[]>;
  misses: Array<number[]>;
  onCellClick: (cell: CellProps) => void;
  screenMode: ScreenMode;
}

export const Board: React.FC<Props> = ({ board, boardWidth, boardRef, onCellClick, hits, misses, screenMode }) => {
  const cellWidth = boardWidth / board?.length;
  const isMobile = screenMode === ScreenMode.MOBILE;
  const isTablet = screenMode === ScreenMode.TABLET;

  return (
    <div className={isTablet ? "board-container-tablet" : isMobile ? "board-container-mobile" : "board-container"}>
      <div className="board" ref={boardRef}>
        {(board || []).map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, cellIndex) => {
              const isHit = (hits || []).filter((hitsValue: number[]) => hitsValue[0] === cell.x && hitsValue[1] === cell.y);
              const isMiss = (misses || []).filter((missesValue: number[]) => missesValue[0] === cell.x && missesValue[1] === cell.y);

              return (
                <div key={cellIndex} className="board-cell" style={{ width: `${cellWidth}px`, height: `${cellWidth}px` }}
                  onClick={() => isHit.length > 0 || isMiss.length > 0 ? null : onCellClick(cell)}>
                  {isHit.length > 0 ? (
                    <img src={Hit} alt={`hitted${cellIndex}`} width="100%" />
                  ) :
                    isMiss.length > 0 && (
                      <img src={Hit_Miss} alt={`missed${cellIndex}`} width="100%" />
                    )
                  }
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
};