import * as React from "react";
import { observer } from "mobx-react";
import { observable, computed, action } from "mobx";
import './styles.scss';
import { MyElement, MyElement2 } from "./Observers";

export type TestVal = {
    value: boolean;
}

export class Store {

    @observable public arr: TestVal[] = [
        { value: true }, { value: true }, { value: true }, { value: true },
    ];

    @action public changeX = () => {
        this.arr[2].value = !this.arr[2].value;
    }



    public add = () => this.arr.push({ value: false });
}

@observer
export class App extends React.Component {

    private store = new Store();

    @observable private x: string = "5";

    render() { return <div className='container'>

            <MyElement values={this.store.arr} />

            {this.store.arr.map((value, index) => <div key={index}>{value.value ? 'да' : 'нет'}</div>)}

            {this.store.arr.map((value, index) => <MyElement2 key={index} singleVal={value} />)}
            
            <button onClick={this.store.changeX}>Click me to change</button>
            <button onClick={this.store.add}>Click to push</button>
        </div>
    }
}


