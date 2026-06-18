import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export class Modal extends Component<{}> {
    protected modalContainer: HTMLElement;
    protected closeButton: HTMLButtonElement;
    protected contentContainer: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.modalContainer = ensureElement<HTMLElement>('.modal__container', container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.contentContainer = ensureElement<HTMLElement>('.modal__content', container);
        
        this.closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.close();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    open(): void {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.clearContent();
        this.events.emit('modal:close');
    }

    setContent(content: HTMLElement): void {
        this.clearContent();
        this.contentContainer.appendChild(content);
    }

    clearContent(): void {
        this.contentContainer.innerHTML = '';
    }

    isOpen(): boolean {
        return this.container.classList.contains('modal_active');
    }

    render(): HTMLElement {
        return this.container;
    }
}