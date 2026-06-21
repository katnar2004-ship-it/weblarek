import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export class Header extends Component<{}> {
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
        this.counterElement.textContent = String(value);
    }
}