import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';

export class Gallery extends Component<{ catalog: HTMLElement[] }> {
    protected container: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.container = container.classList.contains('gallery') 
            ? container 
            : ensureElement<HTMLElement>('.gallery', container);
    }

    setCatalog(items: HTMLElement[]): void {
        this.container.innerHTML = '';
        items.forEach(item => {
            this.container.appendChild(item);
        });
    }
}