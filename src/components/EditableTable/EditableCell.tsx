import * as React from "react";

import { observer } from "mobx-react";
import { observable, action, computed } from "mobx";
import { DropdownButton, MenuItem, Button, ButtonToolbar, OverlayTrigger, Popover } from "react-bootstrap";


interface EditableCellProps<TValue> {
    setValueForEditingRow: (value: TValue) => void;
    getStoredValue: () => TValue;
    getEditingValue: () => TValue;
    isEditing: () => boolean;
}

abstract class EditableCellBase<TValue, TProps extends EditableCellProps<TValue>> extends React.Component<TProps> {

    @action
    setEditingValueFromInput(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value as unknown as TValue;
        this.setEditingValue(value);
    }

    @action
    setEditingValue(value: TValue) {
        this.props.setValueForEditingRow(value);
    }

    @computed
    get storedValue() {
        return this.props.getStoredValue();
    }

    @computed
    get editingValue() {
        return this.props.getEditingValue()
    }

    @computed
    get currentValue() {
        return this.isEditing ? this.editingValue : this.storedValue;
    }

    @computed
    get isEditing() {
        return this.props.isEditing();
    }

    abstract render(): JSX.Element

}

interface EditableStringProps extends EditableCellProps<string> {
}

@observer
export class EditableString extends EditableCellBase<string, EditableStringProps> {

    render() {
        return (
            <div>
                {this.isEditing ? <input type='text' className='form-control' value={this.editingValue as string} onChange={(e) => this.setEditingValueFromInput(e)} />
                    : <div>{this.storedValue}</div>}
            </div>
        );
    }
}

interface EditableNumberProps extends EditableCellProps<number> {
}

@observer
export class EditableNumber extends EditableCellBase<number, EditableNumberProps> {
    render() {
        return (
            <div>
                {this.isEditing ? <input className='form-control' disabled={!this.isEditing} type='number' value={this.editingValue as number} onChange={(e) => this.setEditingValueFromInput(e)} />
                    : <div>{this.storedValue}</div>}
            </div>


        );
    }
}

interface EditorProps extends EditableCellProps<boolean> {
    hide: () => boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    validationPassed: () => boolean;
}

@observer
export class Editor extends EditableCellBase<boolean, EditorProps> {

    @computed
    private get hide() {
        return this.props.hide();
    }

    @computed
    private get validationPassed() {
        return this.props.validationPassed();
    }

    render() {
        return (
            <div>
                {this.isEditing ?
                    <>
                        <Button disabled={!this.validationPassed} onClick={() => this.props.onSave()} >Сохранить</Button> <Button onClick={() => this.props.onCancel()}>Отменить</Button>
                    </>
                : !this.hide ?
                        <Button onClick={() => this.props.onEdit()}>Редактировать</Button>
                : <></>}
            </div>
        )
    }
}

interface EditableDropdownProps extends EditableStringProps {
    selectList: Map<string, string>;
    id: string;
}

@observer
export class EditableDropdown extends EditableCellBase<string, EditableDropdownProps> {

    render() {

        return (
            <div>
                <DropdownButton
                    title={this.props.selectList.get(this.currentValue)}
                    id={this.props.id}
                    key={this.currentValue}
                    disabled={!this.isEditing}
                >
                    {Array.from(this.props.selectList, (value) =>
                        <MenuItem key={value[0]} eventKey={value[0]} onClick={() => this.setEditingValue(value[0])} >{value[1]}</MenuItem>
                    )}
                </DropdownButton>
            </div>
        )
    }
}