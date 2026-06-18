import { Card } from './Card';
import { IProduct } from '../types';
import { IEvents } from './base/Events';

export class CardCatalog extends Card<IProduct> {
    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
    }
}