import { Component } from './base/Component';
import { IProduct } from '../types';
import { categoryMap } from '../utils/constants';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/Events';

export abstract class Card<T extends IProduct> extends Component<T> {
    protected _id: string = '';
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected categoryElement?: HTMLElement | null = null;;
    protected imageElement?: HTMLImageElement | null = null;;
    
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', container);
        this.categoryElement = container.querySelector('.card__category');
        this.imageElement = container.querySelector('.card__image');
        container.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this._id) {
                this.events.emit('card:select', { id: this._id });
            }
        });
    }

    set id(value: string) {
        this._id = value;
        this.container.setAttribute('data-id', value);
    }

    get id(): string {
        return this._id;
    }

    set title(value: string) {
        this.setText(this.titleElement, value);
    }

    set price(value: number | null) {
        this.setText(this.priceElement, value !== null ? `${value} синапсов` : 'Бесценно');
    }

    set category(value: string) {
        if (this.categoryElement) {
            this.setText(this.categoryElement, value);
            const categoryClass = categoryMap[value];
            if (categoryClass) {
                this.categoryElement.className = `card__category ${categoryClass}`;
            }
        }
    }

    set image(value: string) {
        if (this.imageElement) {
            this.setImage(this.imageElement, value, this.title);
        }
    }

    protected setText(element: HTMLElement, value: string): void {
        if (element) {
            element.textContent = value;
        }
    }
}