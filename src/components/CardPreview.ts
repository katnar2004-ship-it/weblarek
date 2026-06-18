import { Card } from './Card';
import { IProduct } from '../types';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export class CardPreview extends Card<IProduct> {
    protected descriptionElement: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
        this.button = ensureElement<HTMLButtonElement>('.card__button', container);
        
        this.button.addEventListener('click', () => {
            events.emit('card:add-to-basket', { id: this.id });
        });
    }

    set description(value: string) {
        this.setText(this.descriptionElement, value);
    }

    set buttonText(value: string) {
        this.setText(this.button, value);
    }

    disableButton(disabled: boolean): void {
        if (this.button) {
            this.button.disabled = disabled;
        }
    }
}