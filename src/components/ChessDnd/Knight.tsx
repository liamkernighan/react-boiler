import * as React from 'react';
import { DragSource, DragSourceCollector, DragSourceConnector, DragSourceMonitor, ConnectDragSource, ConnectDragPreview } from 'react-dnd'


class Knight extends React.Component<KnightProps> {
    public componentDidMount() {

    }

    public render() {
        const { connectDragSource, isDragging } = this.props;
        return connectDragSource(
            <span style={{
                fontSize: '5rem',
                opacity: isDragging ? 0.5 : 1,
                fontWeight: 'bold',
                cursor: 'move'

            }}>♘</span>   
        );
    }
}

enum ItemTypes { Knight = 'Knight' }

const knightSource = {
    beginDrag() {
        return {};
    }
}

export interface KnightProps {
    connectDragSource: ConnectDragSource,
    connectDragPreview: ConnectDragPreview,
    isDragging?: boolean,
}

const collect: DragSourceCollector<KnightProps> = (connect: DragSourceConnector, monitor: DragSourceMonitor) => {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),
    }
}

export default DragSource(ItemTypes.Knight, knightSource, collect)(Knight)


