import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export abstract class Form<T> extends Component<T> {
    protected form: HTMLFormElement;
    protected submitButton: HTMLButtonElement;
    protected errorsContainer: HTMLElement;
    protected _data: T = {} as T;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.form = container as HTMLFormElement;
        this.submitButton = ensureElement<HTMLButtonElement>('.button[type="submit"]', container);
        this.errorsContainer = ensureElement<HTMLElement>('.form__errors', container);
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            events.emit(`${this.form.name}:submit`, this._data as object);
        });
    }

    setData(data: Partial<T>): void {
        this._data = { ...this._data, ...data };
        this.disableSubmit(!this.validate());
        this.events.emit(`${this.form.name}:change`, this._data as object);
    }

    getData(): T {
        return this._data;
    }

    abstract validate(): boolean;

    setErrors(errors: Partial<Record<keyof T, string>>): void {
        const errorMessages = Object.values(errors).filter(Boolean);
        this.setText(this.errorsContainer, errorMessages.join(', ') || '');
    }

    clear(): void {
        this.form.reset();
        this._data = {} as T;
        this.setText(this.errorsContainer, '');
        this.disableSubmit(true);
    }

    disableSubmit(disabled: boolean): void {
        if (this.submitButton) {
            this.submitButton.disabled = disabled;
        }
    }

    protected onInputChange(field: keyof T, value: string): void {
        this.setData({ [field]: value } as Partial<T>);
    }

    protected setText(element: HTMLElement, value: string): void {
        if (element) {
            element.textContent = value;
        }
    }
}