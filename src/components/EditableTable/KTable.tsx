import { observer } from 'mobx-react';
import { observable } from 'mobx';
import * as React from 'react';
import { Table, Button } from 'antd';

type ExampleEntity = {
    strField: string;
    numField: number;
}

// этот тип я уже описывал в ГИС
type PickByType<T, TPropertyType> =
    { [P in keyof T]: T[P] extends TPropertyType ? P : never }[keyof T];

type StringEditorProps<T> = {
    item: T,
    index: number,
    editor: { editingIndex: number },
    fieldName: PickByType<T, string>
}

@observer
class StringEditor<T> extends React.Component<StringEditorProps<T>> {
    render() {
        //вот тут тайпскрипту немного не хватает силы понять, что там всегда стринг, однако там всегда он, и на этапе комплияции это гарантировано
        const fieldValue = this.props.item[this.props.fieldName] as unknown as string;
        return this.props.index === this.props.editor.editingIndex
            ? <input type='text' value={fieldValue} onChange={(ev) => this.props.item[this.props.fieldName] = ev.target.value as any} />
            : fieldValue;
    }
}

@observer
export class KTable extends React.Component<{}> {
    constructor(props: {}) {
        super(props);
        this.data = [
            {
                strField: '1',
                numField: 1
            },
            {
                strField: '2',
                numField: 2
            },
            {
                strField: '3',
                numField: 3
            },
            {
                strField: '4',
                numField: 5
            },
        ]
    }

    @observable
    private data: ExampleEntity[];

    @observable
    public editingIndex: number | undefined = undefined;

    render() {
        return <Table
            dataSource={this.data}
            columns= {[
                {
                    title: 'Строка',
                    key: 'strField',
                    dataIndex: 'strField',
                    render: (_, record, index) => <StringEditor
                        item={record}
                        index={index}
                        editor={this}
                        fieldName='strField' /> //попробуй написать здесь не strField, а numField — не скомпилится
                },
                {
                    title: 'Редактировать',
                    key: 'edit',
                    render: (_, __, index) => <Button onClick={() => this.editingIndex = index} />
                }
            ]}
        />
    }
}