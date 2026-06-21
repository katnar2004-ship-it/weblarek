import { Form } from './Form.ts';
import { TPayment } from '../types';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export interface IOrderData {
    payment: TPayment | null;
    address: string;
}

export class FormOrder extends Form<IOrderData> {
    protected addressInput: HTMLInputElement;
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        
        this.addressInput.addEventListener('input', () => {
            this.events.emit('order:address-change', {
                address: this.addressInput.value
            });
        });
        
        this.cardButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.cardButton.classList.add('button_alt-active');
            this.cashButton.classList.remove('button_alt-active');
            this.events.emit('order:payment-change', {
                payment: 'card' as TPayment
            });
        });
        
        this.cashButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.cashButton.classList.add('button_alt-active');
            this.cardButton.classList.remove('button_alt-active');
            this.events.emit('order:payment-change', {
                payment: 'cash' as TPayment
            });
        });
    }

    set payment(value: TPayment | null) {
        this.cardButton.classList.toggle('button_alt-active', value === 'card');
        this.cashButton.classList.toggle('button_alt-active', value === 'cash');
    }

    set address(value: string) {
        this.addressInput.value = value;
    }

    protected getFormData(): IOrderData {
        const activeButton = this.cardButton.classList.contains('button_alt-active')
            ? 'card'
            : this.cashButton.classList.contains('button_alt-active')
                ? 'cash'
                : null;

        return {
            payment: activeButton as TPayment | null,
            address: this.addressInput.value
        };
    }
}