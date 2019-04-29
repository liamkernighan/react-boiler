import * as React from "react";
import { observable, action, computed } from "mobx";
import { observer } from "mobx-react";


@observer
export class Sticky extends React.Component {

    constructor() {
        super({});
        this.stickyRef = React.createRef();
        this.serializedStyle = JSON.stringify({});
    }

    private stickyRef: React.RefObject<HTMLElement>;

    private initialOffset: number;
    private getInitialOffset = () => {
        this.initialOffset = this.stickyRef.current.getBoundingClientRect().top;
    }

    private stickyStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        width: '100%',
    }

    @observable
    private serializedStyle: string;

    @computed
    private get style(): React.CSSProperties {
        return JSON.parse(this.serializedStyle);
    }

    @action
    private setStyle = (value: React.CSSProperties) => this.serializedStyle = JSON.stringify(value);

    public componentDidMount = () => {
        this.getInitialOffset();
        window.addEventListener('scroll', this.handleScrollWithTimeout);
    }

    public componentWillUnmount = () => {
        window.removeEventListener('scroll', this.handleScrollWithTimeout);
    }

    private handleScrollWithTimeout = (event: UIEvent) => {
        setTimeout(() => {
            this.handleScroll(event);
        }, 0);
    } 

    private handleScroll = (event: UIEvent) => {

        if (this.initialOffset <= window.scrollY) {
            this.setStyle(this.stickyStyle);
        }
        else {
            this.setStyle({});
        }
    }

    private applyStickyToRender = (child: React.ReactChild) => {
        return React.cloneElement(child as React.ReactElement<any>, {ref: this.stickyRef, style: this.style});
    }

    public render() {
        return <>
            {React.Children.map(this.props.children, child => this.applyStickyToRender(child))}
        </>
    }
}
