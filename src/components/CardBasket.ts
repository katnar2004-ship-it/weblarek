import { Component } from './base/Component';
import { IProduct } from '../types';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export interface ICardBasketData extends IProduct {
    index: number;
}

export class CardBasket extends Component<ICardBasketData> {
    protected _id: string = '';
    protected indexElement: HTMLElement;
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        
        this.deleteButton.addEventListener('click', () => {
            events.emit('card:remove-from-basket', { id: this._id });
        });
    }

    set id(value: string) {
        this._id = value;
    }

    get id(): string {
        return this._id;
    }

    set index(value: number) {
        this.setText(this.indexElement, String(value));
    }

    set title(value: string) {
        this.setText(this.titleElement, value);
    }

    set price(value: number | null) {
        this.setText(this.priceElement, value !== null ? `${value} синапсов` : 'Бесценно');
    }

    protected setText(element: HTMLElement, value: string): void {
        if (element) {
            element.textContent = value;
        }
    }
}