import * as React from 'react';


export class TreeTable extends React.Component<{}> {

    public render = () => <div className='flex-table'>
        <div className='flex-row'>
            <span className='cell'>Склад</span>
            <span className='cell'>Номенклатура</span>
            <span className='cell'>Цвет</span>
        </div>
        <div className='flex-row'>
            <span className='cell'>Дата</span>
            <span className='cell'>Остаток</span>
        </div>
    </div>
}