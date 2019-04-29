import { ConnectDropTarget, DropTarget } from "react-dnd";
import { canMoveKnight } from "./Functions";

interface CollectedProps {
    isOver: boolean;
    canDrop: boolean;
    connectDropTarget: ConnectDropTarget;
}

export interface BoardSquareProps {
    x: number;
    y: number;
    children: any;
}

const squareTarget = {
    canDrop(props: BoardSquareProps) {
        return true; // replace to canMoveKnight
    },

    DropTarget(props: BoardSquareProps) {
        // moveKnight(props.x, props.y);
    },
}