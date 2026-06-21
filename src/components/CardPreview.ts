import { Card } from './Card';
import { IProduct } from '../types';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';
import { categoryMap } from '../utils/constants';

export class CardPreview extends Card<IProduct> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected descriptionElement: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
        this.button = ensureElement<HTMLButtonElement>('.card__button', container);
        
        this.button.addEventListener('click', (e) => {
            e.stopPropagation();
            events.emit('card:add-to-basket');
        });
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        const categoryClass = categoryMap[value];
        if (categoryClass) {
            this.categoryElement.className = `card__category ${categoryClass}`;
        }
    }

    set image(value: string) {
        this.imageElement.src = value;
        this.imageElement.alt = this.title;
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set buttonText(value: string) {
        this.button.textContent = value;
    }

    disableButton(disabled: boolean): void {
        this.button.disabled = disabled;
    }
}