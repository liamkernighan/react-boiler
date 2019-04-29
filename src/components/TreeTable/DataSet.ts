
// Потом добавим класс, который будет её рендерить.
interface CellData {
    format?: string;
    value: string | number;
    ref?: string;
}

interface DataRow {
    children?: DataRow[];
    rowData: CellData[];
    expanded?: boolean;
}

interface HeadersData {
    children?: HeadersData[];
}

export class DataSet {

    public rows: DataRow[] = [
        {   
            children: [
                {
                    rowData: [
                        { value: '2018-03-25'}, { value: 3 },
                    ],
                },
                {
                    rowData: [
                        { value: '2018-03-26'}, { value: 6 },
                    ],
                },                
            ],
            rowData: [
                { value: 'Таганка' }, { value: 'iPhone 4S' }, { value: 'White' }
            ],
        },
        {
            children: [
                {
                    rowData: [
                        { value: '2018-03-25' }, { value: 4 },
                    ],
                },
                {
                    rowData: [
                        { value: '2018-03-26' }, { value: 8 },
                    ],
                },    
            ],
            rowData: [
                { value: 'Таганка' }, { value: 'iPhone 4S' }, { value: 'Black' }
            ],            
        }
    ];
}