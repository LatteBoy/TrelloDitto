'use client'
import { useBoardStore } from '@/store/BoardStore';
import { useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

function Board() {
  const [board, getBoard] = useBoardStore((state) => [
    state.board,
    state.getBoard
  ]);

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  console.log(board);
  return (
    <h1>HELLO</h1>
    // <DragDropContext>
    //     <Droppable droppableId="board" direction="horizontal" type="column">
    //         {(provided) => (
    //             <div>
    //                 {/* rendering all the columns */}
    //             </div>
    //         )}
    //     </Droppable>

    // </DragDropContext>
  )
}

export default Board