import * as React from "react";
import { Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import { observer } from "mobx-react";
import { observable, action, computed } from "mobx";
import { DropdownButton, MenuItem, Button, ButtonToolbar, OverlayTrigger, Popover } from "react-bootstrap";


interface CategoryTableProps {
}

@observer
class CategoryTable extends React.Component<CategoryTableProps> {

    render() {        
        return <Button>Добавить категорию</Button>
    }
}