import * as React from "react";
import { Table, Button } from "react-bootstrap";
import { observable, action, computed } from "mobx";
import { observer } from "mobx-react";
import { EditableString, Editor, EditableDropdown, EditableNumber } from "./EditableCell";

interface IParentRow {
    index: number;
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
export class BootstrapTable extends React.Component<{}> {

    constructor(props: {}) {
        super(props);

        // Инициализируем вызовы с бэков здесь.
    }

    private static rowCount = 5;

    @computed
    private get validationErrors(): string[] {
        const errors = [];

        if (this.editingRow.name.trim() === '') {
            errors.push(`Необходимо указать имя`);
        }

        if (this.editingRow.age <= 0) {
            errors.push(`Необходимо указать возраст`);
        }

        if (this.editingRow.messages.length === 0) {
            errors.push(`Заполните хотя бы одно сообщение`);
        }

        this.editingRow.messages.forEach((value, index) => {
            const rowNum = index + 1;
            if (value.subject.trim() === '') {
                errors.push(`Не указана тема в строке ${rowNum}`)
            }

            if (value.body.trim() === '') {
                errors.push(`Не указано содержимое в строке ${rowNum}`)
            }
        });

        return errors;
    }

    //#region Observables
    @observable
    private expandedRows: Set<number> = new Set<number>();

    @observable
    editingRow: IParentRow | null = null;

    @observable
    private dataSource: IParentRow[] = [{
        index: 1,
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
        index: 2,
        name: 'John',
        age: 42,
        occupation: 'developer',
        messages: [],
    }];

    //#endregion

    //#region Actions    

    @action
    clearEditingRow = () => {
        this.dataSource = this.dataSource.filter(r => r.index > 0);
        this.editingRow = null;
    }

    @action
    initEditingRow = (index: number) => {
        this.editingRow = {
            index: index,
            age: this.dataSource[index].age,
            name: this.dataSource[index].name,
            occupation: this.dataSource[index].occupation,
            messages: this.dataSource[index].messages.map((r) => Object.assign({}, r)),
        }
        this.expandedRows.add(index);
    }

    @action
    private toggleRow(index: number) {
        if (this.expandedRows.has(index)) {
            this.expandedRows.delete(index);
        }
        else {
            this.expandedRows.add(index);
        }
        // ???: Не понимаю, почему 
        this.dataSource = this.dataSource.slice();
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

    @action
    private setName = (value: string) => {
        if (this.editingRow) {
            this.editingRow.name = value;
        }
    }

    @action
    private setOccupation = (value: string) => {
        if (!this.editingRow) throw 'Cannot modify while editing mode is off';
        this.editingRow.occupation = value;
    }

    //#endregion

    //#region Helpers, render conditions, event handlers

    private addDerivedButtonOnClick = (parentIndex: number) => {
        return () => {
            if (this.editingRow) {
                this.editingRow.messages.push({ key: this.editingRow.messages.length, parentKey: parentIndex, body: '', subject: '' });
            }
        }
    };

    private getShowValidationErrorsCondition = (index: number) =>
        this.editingRow && this.editingRow.index === index
        && this.validationErrors.length > 0

    private disableAddParentButtonCondition = (index: number) => !(this.editingRow && this.editingRow.index === index)

    private getIsEditing = (index: number) => this.editingRow && this.editingRow.index === index;

    private getCurrentDerivedRows = (index: number) =>
        this.editingRow && this.editingRow.index === index ?
        this.editingRow.messages :
        this.dataSource[index].messages

    //#endregion

    //#region Parent table rows render

    private getExpandToggleRow = (index: number) =>
        <td onClick={() => this.toggleRow(index)}><b>{this.expandedRows.has(index) ? '-' : '+'}</b></td>

    private getNameRow = (index: number) =>
        <EditableString
            isEditing={() => this.getIsEditing(index)}
            getStoredValue={() => this.dataSource[index].name}
            getEditingValue={() => this.editingRow && this.editingRow.name}
            setValueForEditingRow={this.setName}
        />

    private getAgeRow = (index: number) =>
        <EditableNumber
            isEditing={() => this.getIsEditing(index)}
            getStoredValue={() => this.dataSource[index].age}
            getEditingValue={() => this.editingRow && this.editingRow.age}
            setValueForEditingRow={(value) => {
                if (this.editingRow) {
                    this.editingRow.age = value
                }
            }}
        />


    private get occupationSelectList() {
        const occupationSelectList = new Map<string, string>();
        occupationSelectList.set('lawyer', 'Lawyer');
        occupationSelectList.set('developer', 'Software Developer');
        return occupationSelectList;
    }

    private getOccupationRow = (index: number) => <EditableDropdown
        isEditing={() => this.getIsEditing(index)}
        getStoredValue={() => this.dataSource[index].occupation}
        getEditingValue={() => this.editingRow && this.editingRow.occupation}
        setValueForEditingRow={this.setOccupation}
        id='occupationDropdown'
        selectList={this.occupationSelectList}
    />

    private getEditorRow = (index: number) =>
        <Editor
            isEditing={() => this.getIsEditing(index)}
            hide={() => this.editingRow && this.editingRow.index !== index}
            onEdit={() => this.initEditingRow(index)}
            onSave={() => this.save(index)}
            onCancel={() => this.clearEditingRow()}
            setValueForEditingRow={() => null}
            getEditingValue={() => null}
            getStoredValue={() => null}
            validationPassed={() => this.editingRow && this.editingRow.index === index && this.validationErrors.length === 0}
        />

        //#endregion

    //#region Derived table rows render
    private getDerivedSubjectRow = (parentIndex: number, derivedIndex: number) =>
        <EditableString
            isEditing={() => this.getIsEditing(parentIndex)}
            getStoredValue={() => this.dataSource[parentIndex].messages[derivedIndex].subject}
            getEditingValue={() => this.editingRow && this.editingRow.messages[derivedIndex].subject}
            setValueForEditingRow={(value) => {
                if (this.editingRow && this.editingRow.messages) {
                    this.editingRow.messages[derivedIndex].subject = value;
                }
            }}
        />
    
    private getDerivedBodyRow = (parentIndex: number, derivedIndex: number) =>
        <EditableString
            isEditing={() => this.getIsEditing(parentIndex)}
            getStoredValue={() => this.dataSource[parentIndex].messages[derivedIndex].body}
            getEditingValue={() => this.editingRow && this.editingRow.messages[derivedIndex].body}
            setValueForEditingRow={(value) => {
                if (this.editingRow && this.editingRow.messages) {
                    this.editingRow.messages[derivedIndex].body = value;
                }
            }}
        />

    private getDerivedActionButtonsRow = (parentIndex:number, derivedIndex: number) =>
        <Button disabled={!(this.editingRow && this.editingRow.index === parentIndex)}
            onClick={() => {
                if (this.editingRow) {
                    this.editingRow.messages = this.editingRow.messages.filter((_, idx) => idx !== derivedIndex);
                }
            }}>Удалить
        </Button>

    //#endregion

    render() {

        return <React.Fragment>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>+/-</th>
                        <th>Имя</th>
                        <th>Возраст</th>
                        <th>Профессия</th>
                        <th>Редактировать</th>
                    </tr>
                </thead>
                <tbody>
                {this.dataSource.map((_, parentIndex) => {

                    const messages = this.getCurrentDerivedRows(parentIndex);

                    return <React.Fragment key={parentIndex}>

                        <tr key={`${parentIndex}_parent`}>
                            {this.getExpandToggleRow(parentIndex)}
                            <td>{this.getNameRow(parentIndex)}</td>
                            <td>{this.getAgeRow(parentIndex)}</td>
                            <td>{this.getOccupationRow(parentIndex)}</td>
                            <td>{this.getEditorRow(parentIndex)}</td>
                        </tr>

                        {this.expandedRows.has(parentIndex) &&
                        <tr>
                            <td colSpan={BootstrapTable.rowCount}>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Subject</th>
                                            <th>Body</th>
                                            <th>Удалить</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {messages.map((_, derivedIndex) =>
                                        <tr key={`${parentIndex}_${derivedIndex}_derived`}>
                                            <td>{derivedIndex + 1}</td>
                                            <td>{this.getDerivedSubjectRow(parentIndex, derivedIndex)}</td>
                                            <td>{this.getDerivedBodyRow(parentIndex, derivedIndex)}</td>
                                            <td>{this.getDerivedActionButtonsRow(parentIndex, derivedIndex)}</td>
                                        </tr>)}
                                    </tbody>
                                </Table>

                                <Button disabled={this.disableAddParentButtonCondition(parentIndex)} onClick={this.addDerivedButtonOnClick(parentIndex)}>Добавить категорию</Button>
                            </td>
                        </tr>}

                        {this.getShowValidationErrorsCondition(parentIndex) &&
                            <tr>
                                <td colSpan={BootstrapTable.rowCount}>
                                    <div className='alert alert-info'>
                                        {this.validationErrors.map(value => <p>{value}</p>)}
                                    </div>
                                </td>
                            </tr>
                        }
                    </React.Fragment>
                })}
                </tbody>
            </Table>
        </React.Fragment>
    }
}