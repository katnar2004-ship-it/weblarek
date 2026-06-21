import { Card } from './Card';
import { IProduct } from '../types';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export interface ICardBasketData extends IProduct {
    index: number;
}

export class CardBasket extends Card<IProduct> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        
        this.deleteButton.addEventListener('click', () => {
            const id = this.container.dataset.id;
            if (id) {
                this.events.emit('card:remove-from-basket', { id });
            }
        });
    }

    set index(value: number) {
        this.indexElement.textContent = value.toString();
    }

}