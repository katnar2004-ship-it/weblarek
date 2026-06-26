import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export abstract class Form<T extends object> extends Component<T> {
    protected form: HTMLFormElement;
    protected submitButton: HTMLButtonElement;
    protected errorsContainer: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.form = container as HTMLFormElement;
        this.submitButton = ensureElement<HTMLButtonElement>('.button[type="submit"]', container);
        this.errorsContainer = ensureElement<HTMLElement>('.form__errors', container);
    
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            events.emit(`${this.form.name}:submit`);
        });
    }

    setErrors(errors: Record<string, string>): void {
        const errorMessages = Object.values(errors).filter(Boolean);
        this.errorsContainer.textContent = errorMessages.join(', ') || '';
    }

    disableSubmit(disabled: boolean): void {
        this.submitButton.disabled = disabled;
    }
}