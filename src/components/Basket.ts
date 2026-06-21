import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export interface IBasketData {
    items: HTMLElement[];
    price: number;
}

export class Basket extends Component<IBasketData> {
    protected listContainer: HTMLElement;
    protected orderButton: HTMLButtonElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.listContainer = ensureElement<HTMLElement>('.basket__list', container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', container);
        this.priceElement = ensureElement<HTMLElement>('.basket__price', container);
        
        this.orderButton.addEventListener('click', () => {
            events.emit('basket:order');
        });
    }

    setItems(items: HTMLElement[]): void {
        this.listContainer.replaceChildren(...items);
    }

    setPrice(value: number): void {
        this.priceElement.textContent = `${value} синапсов`;
    }

    setButtonState(disabled: boolean): void {
        this.orderButton.disabled = disabled;
    }
}