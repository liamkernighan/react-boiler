import * as React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Square2 } from './Square2';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Knight from './Knight';

export type SquareProps = {
    isKnightHere: boolean;
    isBlack: boolean;
}


@observer
export class Board extends React.Component<{}> {

    @observable private knightPosition: [number, number];
    @action private setKnightPosition = (x: number, y: number) => {

        // remove old knight if necessary
        if (this.knightPosition !== undefined) {
            const oldX = this.knightPosition[0];
            const oldY = this.knightPosition[1];

            if (oldX === x && oldY === y) {
                return;
            }

            this.squares[this.xyToAbs(oldX, oldY)].isKnightHere = false;
        }


        this.knightPosition = [x, y];
        this.squares[this.xyToAbs(x, y)].isKnightHere = true;
    }


    private xyToAbs = (x: number, y: number) => x + y * 8;
    private absToXy = (i: number) => {
        const x = i % 8;
        const y = Math.floor(i / 8);
        return {x: x, y: y};
    }

    private isBlack = (x: number, y: number) => (x + y) % 2 === 1;
    private isKnightHere = (x: number, y: number) => this.knightPosition[0] === x && this.knightPosition[1] === y;

    @observable private squares: SquareProps[] = [];

    constructor(props: {}) {
        super(props);
        
        const squares: SquareProps[] = [];
        for (let i = 0; i < 64; i++) {
            const coords = this.absToXy(i);    
            const black = this.isBlack(coords.x, coords.y);
            squares.push({ isBlack: black, isKnightHere: false });
        }

        this.squares = squares;
        this.setKnightPosition(0, 0);
    }

    public renderSquare(index: number) {
        const coords = this.absToXy(index);
        return <div key={index} style={{ width: '12.5%', height: '12.5%' }}>
            <Square2 changeKnight={() => this.setKnightPosition(coords.x, coords.y)} key={index} sqProps={this.squares[index]}/>
        </div>
    }

    render() {
        return <DragDropContextProvider backend={HTML5Backend}>
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexWrap: 'wrap',
        }}>
            {this.squares.map((square, i) => this.renderSquare(i))}
        </div>
        </DragDropContextProvider>
    }
}