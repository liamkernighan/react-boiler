import * as React from 'react';
import Knight from './Knight';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { SquareProps } from './Board';


type LocalProps = {
    sqProps: SquareProps;
    changeKnight: () => void;
}



@observer
export class Square2 extends React.Component<LocalProps> {

    render() {
        const { sqProps, changeKnight } = this.props;

        const stroke = sqProps.isBlack ? 'white' : 'black';
        return <div onClick={() => changeKnight()}
            style={{
                backgroundColor: sqProps.isBlack ? 'black' : 'white',
                color: stroke,
                width: '100%',
                height: '100%',
            }}
        >
            {sqProps.isKnightHere ? <Knight /> : null}
        </div>
    }

}