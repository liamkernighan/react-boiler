import * as React from "react";
import { observer } from "mobx-react";
import { TreeTable } from "./TreeTable/TreeTable";

@observer
export class App extends React.Component<{}> {

    render() {
        return <div className='container'>
            <TreeTable />
        </div>
    }
}
