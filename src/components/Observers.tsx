import { observer, PropTypes } from "mobx-react";
import { TestVal } from "./App";
import * as React from 'react';

export const MyElement = observer((props: { values: TestVal[] }) => <>
    {props.values.map((val, ind) => 
        <div key={ind}>{val.value ? 'yupp' : 'nope'}</div>    
    )}
</>);

export const MyElement2 = observer((props: { singleVal: TestVal }) => <div>{props.singleVal.value ? 'はい' : 'いいえ'}</div>)