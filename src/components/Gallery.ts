import { Component } from './base/Component';

export class Gallery extends Component<{ catalog: HTMLElement[] }> {
    constructor(container: HTMLElement) {
        super(container);
    }
    
    setCatalog(items: HTMLElement[]): void {
        this.container.replaceChildren(...items);
    }
}