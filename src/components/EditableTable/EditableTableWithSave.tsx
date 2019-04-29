import * as React from "react";
import { Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import { observer, Observer } from "mobx-react";
import { observable, action, computed, _allowStateChanges } from "mobx";
import { DropdownButton, MenuItem, Button, ButtonToolbar, OverlayTrigger, Popover } from "react-bootstrap";
import { EditableString, EditableNumber, EditableDropdown, Editor }from "./EditableCell";

interface IParentRow {
    key: number;
    name: string;
    age: number;
    occupation: string;
    messages: IDerivedRow[];
}


interface IDerivedRow {
    parentKey: number;
    key: number;
    subject: string;
    body: string;
}


@observer
export class EditableTableWithSave extends React.Component<{}> {

    @observable
    editingRow: IParentRow | null = null;

    @action
    clearEditingRow = () => {
        this.dataSource = this.dataSource.filter(r => r.key > 0);
        this.editingRow = null;
    }

    @action
    initEditingRow = (index: number) => {
        this.editingRow = {
            key: index,
            age: this.dataSource[index].age,
            name: this.dataSource[index].name,
            occupation: this.dataSource[index].occupation,
            messages: this.dataSource[index].messages.map( (r) => Object.assign({}, r)),
        }
    }

    @action
    private save = (i: number) => {

        if (!this.editingRow) throw 'Unable to save while editing mode is off';
        
        alert('Calling api...');

        this.dataSource[i].name = this.editingRow.name;
        this.dataSource[i].age = this.editingRow.age;
        this.dataSource[i].occupation = this.editingRow.occupation;
        this.dataSource[i].messages = this.editingRow.messages.slice();
        this.clearEditingRow();
    }

    @observable
    private dataSource: IParentRow[] = [{
        key: 1,
        name: 'Mike',
        age: 32,
        occupation: 'lawyer',
        messages: [
            {
                parentKey: 1,
                key: 1,
                subject: 'Привет',
                body: 'Привет, как дела',
            },
            {
                parentKey: 1,
                key: 2,
                subject: 'Привет 2',
                body: 'Второе сообщение',
            },
        ],
    }, {
        key: 2,
        name: 'John',
        age: 42,
        occupation: 'developer',
        messages: [],
    }];

    @action
    private setName = (value: string) => {
        if (!this.editingRow) throw 'Cannot modify while editing mode is off';
        this.editingRow.name = value;
    }

    @action
    private setAge = (value: number) => {  
        if (!this.editingRow) throw 'Cannot modify while editing mode is off';
        this.editingRow.age = value;
    }

    @action
    private setOccupation = (value: string) => {
        if (!this.editingRow) throw 'Cannot modify while editing mode is off';
        this.editingRow.occupation = value;        
    }

    private get occupationSelectList() {
        const selectList = new Map<string, string>();    
        selectList.set('lawyer', 'Lawyer');
        selectList.set('developer', 'Software Developer');
        return selectList;
    }

    private get emptyRow(): IParentRow {
        return { key: 0, name: '', age: 0, occupation: '', messages: [] };
    }

    @action
    private addEmptyRow = () => {
        this.dataSource.push(this.emptyRow);
        this.initEditingRow(this.dataSource.length -1);
    }

    render() {

        //#region columnsDefinition
        const columns: ColumnProps<IParentRow>[] = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_, __, index) =>

            <EditableString
                isEditing={() => this.editingRow && this.editingRow.key === index}
                key={index}
                getStoredValue={() => this.dataSource[index].name }
                getEditingValue={() => this.editingRow && this.editingRow.name }
                setValueForEditingRow={this.setName}
            />
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            render: (_, __, index) =>

            <EditableNumber
                isEditing={() => this.editingRow && this.editingRow.key === index}
                key={index}
                getStoredValue={() => this.dataSource[index].age}
                getEditingValue={() => this.editingRow && this.editingRow.age}
                setValueForEditingRow={this.setAge}
            />
        },
        {
            title: 'Occupation',
            dataIndex: 'occupation',
            key: 'occupation',
            render: (_, __, index) =>

            <EditableDropdown
                isEditing={() => this.editingRow && this.editingRow.key === index}
                key={index}
                getStoredValue={() => this.dataSource[index].occupation }
                getEditingValue={() => this.editingRow && this.editingRow.occupation }
                setValueForEditingRow={this.setOccupation}
                id='occupationDropdown'
                selectList={this.occupationSelectList}
            />
        },
        {
            title: 'Редактировать',
            key: 'edit',
            render: (_, __, index) =>            

                <Editor
                    isEditing={() => this.editingRow && this.editingRow.key === index}
                    hide={() => this.editingRow && this.editingRow.key !== index}
                    key={index}
                    onEdit={() => this.initEditingRow(index)}
                    onSave={() => this.save(index)}
                    onCancel={() => this.clearEditingRow()}
                    setValueForEditingRow={() => null}
                    getEditingValue={() => null}
                    getStoredValue={() => null}
                    validationPassed={() => true}
                />
        },
        ];


        // Немного магии взаимодействия antd и mobx.
        // Если вычислять напрямую внутри Table, работать будет некорректно.
        // Вычисление должно просиходить именно в рендере с последующей их передачей в Table.
        // Если эти button-disabler'ы выше убрать, также не будет работать добавление новой строки. Надо будет писать dataSource={this.dataSource.slice()}
        const addParentButtonDisabled = this.editingRow !== null;
        const addDerivedButtonDisabled = (index: number) => {
            const enabled = this.editingRow && this.editingRow.key === index;
            return !enabled;
        }

        const addDerivedButtonOnClick = (parentIndex: number) => {
            return () => {
                if(this.editingRow) {
                    this.editingRow.messages.push({ key: this.editingRow.messages.length, parentKey: parentIndex, body: '', subject: '' });
                    this.dataSource = this.dataSource.slice();
                    this.dataSource.forEach(element => {
                        element.messages = element.messages.slice();
                    });
                }           
            }
        }

        // С констами выше работает и если передавать сам dataSource. Без них слайс обязателен. На всякий случай лучше пусть будет со слайсом.
        const source = this.dataSource.slice();

        //#endregion
        return <>
     
            <Table
                dataSource={source}
                columns={columns}
                
                expandedRowRender={(_, parentIndex) => {

                    const messages = this.editingRow && this.editingRow.key === parentIndex ? this.editingRow.messages :
                        this.dataSource[parentIndex].messages;

                    const derivedColumns: ColumnProps<IDerivedRow>[] = [
                        {
                            title: 'Subject',
                            dataIndex: 'subject',
                            key: 'subject',
                            render: (_, __, derivedIndex) =>
                            <EditableString
                                isEditing={() => this.editingRow && this.editingRow.key === parentIndex}
                                getStoredValue={() => this.dataSource[parentIndex].messages[derivedIndex].subject }
                                getEditingValue={() => this.editingRow && this.editingRow.messages[derivedIndex].subject}
                                setValueForEditingRow={(value) => {
                                    if (this.editingRow && this.editingRow.messages) {
                                        this.editingRow.messages[derivedIndex].subject = value;
                                    }
                                }}
                            />
                        },
                        {
                            title: 'Body',
                            dataIndex: 'body',
                            key: 'body',
                        },
                    ];

                    return <Table
                        dataSource={messages}
                        columns={derivedColumns}
                        footer={() => <Button
                            disabled={addDerivedButtonDisabled(parentIndex)}
                            onClick={addDerivedButtonOnClick(parentIndex)}
                        >Добавить категорию</Button>}
                        pagination={false}
                        // Заменить сообщение, если нет данных.
                    />
                }}
                footer={() =>
                    <Button onClick={() => this.addEmptyRow()} disabled={addParentButtonDisabled} >Добавить новый</Button>
                }
            />
        </>
    }
}