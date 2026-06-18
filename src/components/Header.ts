import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export interface IHeaderData {
    counter: number;
}

export class Header extends Component<IHeaderData> {
    protected basketButton: HTMLButtonElement;
    protected counterElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.basketButton);
        
        this.basketButton.addEventListener('click', () => {
            events.emit('header:basket-click');
        });
    }

    setCounter(value: number): void {
        this.setText(this.counterElement, String(value));
    }

    protected setText(element: HTMLElement, value: string): void {
        if (element) {
            element.textContent = value;
        }
    }
}