import * as React from "react";
import { Table, Button } from "antd";
import { ColumnProps } from "antd/lib/table";
import { observer } from "mobx-react";
import { observable, action, computed } from "mobx";


interface IColumn {
    key: number;
    name: string;
    age: number;
    address: string;
}

interface EditableStringProps extends EditableCellProps<string> {
}

interface EditableCellProps<TValue> {
    editor: { editingIndex: number | null };
    index: number;
    initialValue: TValue;    
}


abstract class EditableCellBase<TValue, TProps extends EditableCellProps<TValue>> extends React.Component<TProps> {

    @observable
    value: TValue;

    @action
    setValue(e: React.ChangeEvent<HTMLInputElement>) {
        this.value = e.target.value as unknown as TValue;
    }

    @computed
    get isEditing() {
        return this.props.index === this.props.editor.editingIndex;
    }

    constructor(props: TProps) {
        super(props);
        this.value = props.initialValue;
    }

    abstract render() : JSX.Element

}

@observer
class EditableString extends EditableCellBase<string, EditableStringProps> {

    render() {
        return (this.isEditing ? <input type='text' value={this.value} onChange={(e) => this.setValue(e)} />
            : <div>{this.props.initialValue}</div>       
        ); 
    }
}

interface EditableNumberProps extends EditableCellProps<number> {
}

@observer
class EditableNumber extends EditableCellBase<number, EditableNumberProps> {
    render() {
        return (this.isEditing ? <input type='number' value={this.value as number} onChange={(e) => this.setValue(e)} />
            : <div>{this.props.initialValue}</div>
        ); 
    }
}

interface EditorProps extends EditableCellProps<boolean> {
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
}

@observer
class Editor extends EditableCellBase<boolean, EditorProps> {
    
    render()
    {
        return this.isEditing ?
            <>
            <Button onClick={() => this.props.onSave() } >Сохранить</Button> <Button onClick = {() => this.props.onCancel()}>Отменить</Button>
            </>
            : this.props.editor.editingIndex === null ?
            <Button onClick={() => this.props.onEdit() }>Редактировать</Button>
            : <></>
    }
}

@observer
export class EditableAntTable extends React.Component<{}> {

    @observable
    editingIndex: number | null = null;

    @action
    private setEditingIndex = (i: number) =>  {
        this.editingIndex = i;
    }

    @action
    private save = (i: number, name: string, age: number) => {
        this.dataSource[i].name = name;
        this.dataSource[i].age = age;
        this.setEditingIndex(null);
    }

    @observable
    private dataSource = [{
        key: 1,
        name: 'Mike',
        age: 32,
        address: '10 Downing Street'
    }, {
        key: 2,
        name: 'John',
        age: 42,
        address: '10 Downing Street'
    }];
    
    render() {




        const columns: ColumnProps<IColumn>[] = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, _, index) => <EditableString index={index} editor={this} key={index} initialValue={text}/>
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            render: (text, _, index) => <EditableNumber index={index} editor={this} key={index} initialValue={text} />
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Редактировать',
            key: 'edit',
            render: (text, _, index) => {

               const editor = <Editor index={index} editor={this} key={index} initialValue={text} onEdit={() => this.setEditingIndex(index)} onSave={() => this.setEditingIndex(null)} onCancel={() => this.setEditingIndex(null)}
               />;


               return editor;
            }
        },
    ];

        return <Table dataSource={this.dataSource} columns={columns} />

    }
}