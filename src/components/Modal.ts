import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export class Modal extends Component<{}> {
    protected closeButton: HTMLButtonElement;
    protected contentContainer: HTMLElement;

    private _onEscape: (e: KeyboardEvent) => void;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.contentContainer = ensureElement<HTMLElement>('.modal__content', container);
        
        this.closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.close();
            }
        });
        
        this._onEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                this.close();
            }
        };
    }

    open(): void {
        this.container.classList.add('modal_active');
        document.addEventListener('keydown', this._onEscape);
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.clearContent();
        document.removeEventListener('keydown', this._onEscape);
    }

    setContent(content: HTMLElement): void {
        this.clearContent();
        this.contentContainer.appendChild(content);
    }

    clearContent(): void {
        this.contentContainer.innerHTML = '';
    }
}