export interface IValidationErrors {
    payment?: string;
    address?: string;
    email?: string;
    phone?: string;
}

export interface IValidationResult {
    isValid: boolean;
    errors: IValidationErrors;
}

export class FormValidator {
    static validateOrder(payment: string | null, address: string): IValidationResult {
        const errors: IValidationErrors = {};

        if (!payment) {
            errors.payment = "Не выбран способ оплаты";
        }
        if (!address || address.trim() === '') {
            errors.address = "Необходимо указать адрес";
        }
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    static validateContacts(email: string, phone: string): IValidationResult {
        const errors: IValidationErrors = {};

        if (!email || email.trim() === '') {
            errors.email = "Введите email";
        } else if (!this.isValidEmail(email)) {
            errors.email = "Неверный формат email (example@mail.com)";
        }
        if (!phone || phone.trim() === '') {
            errors.phone = "Введите номер телефона";
        } else if (!this.isValidPhone(phone)) {
            errors.phone = "Введите корректный номер телефона +7(9";
        }
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    static isValidPhone(phone: string): boolean {
        const digitsOnly = phone.replace(/\D/g, '');
        return digitsOnly.length >= 11;
    }

    static validateAll(data: {
        payment: string | null;
        address: string;
        email: string;
        phone: string;
    }): IValidationResult {
        const orderResult = this.validateOrder(data.payment, data.address);
        const contactsResult = this.validateContacts(data.email, data.phone);

        const errors: IValidationErrors = {
            ...orderResult.errors,
            ...contactsResult.errors
        };

        return {
            isValid: orderResult.isValid && contactsResult.isValid,
            errors
        };
    }
}