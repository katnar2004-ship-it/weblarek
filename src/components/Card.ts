import { Component } from './base/Component';
import { IProduct } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/Events';

export abstract class Card<T extends IProduct> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', container);
    }
    
    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = value !== null ? `${value} синапсов` : 'Бесценно';
    }
}