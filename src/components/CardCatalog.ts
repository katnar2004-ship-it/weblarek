import { Card } from './Card';
import { IProduct } from '../types';
import { IEvents } from './base/Events';
import { categoryMap } from '../utils/constants';
import { ensureElement } from '../utils/utils';

export class CardCatalog extends Card<IProduct> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, events: IEvents, actions?: { onClick?: (event: MouseEvent) => void }) {
        super(container, events);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
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
}