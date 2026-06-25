import { Form } from './Form';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export interface IContactsData {
    email: string;
    phone: string;
}

export class FormContacts extends Form<IContactsData> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);

        this.emailInput.addEventListener('input', () => {
            this.events.emit('contacts:email-change', {
                email: this.emailInput.value
            });
        });
        
        this.phoneInput.addEventListener('input', () => {
            this.events.emit('contacts:phone-change', {
                phone: this.phoneInput.value
            });
        });
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }
}