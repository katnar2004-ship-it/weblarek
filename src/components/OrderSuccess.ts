import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export interface ISuccessData {
    total: number;
}

export class OrderSuccess extends Component<ISuccessData> {
    protected closeButton: HTMLButtonElement;
    protected totalElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
        this.totalElement = ensureElement<HTMLElement>('.order-success__description', container);
        
        this.closeButton.addEventListener('click', () => {
            events.emit('success:close');
        });
    }

    setTotal(value: number): void {
        this.setText(this.totalElement, `Списано ${value} синапсов`);
    }

    protected setText(element: HTMLElement, value: string): void {
        if (element) {
            element.textContent = value;
        }
    }
}