import { AbstractControl } from '@angular/forms';

function checkErrors(item: AbstractControl, validation: boolean ): object | null {
    if (item.errors && validation) {
        return {...item.errors, noMatch: validation};
    }
    if (item.errors && !validation) {
        return {...item.errors};
    }
    if (!item.errors && validation) {
            return {noMatch: validation};
        }
    if (!item.errors && !validation) {
            return null;
        }
    }

export const passwordmatcher = (control: AbstractControl): {[key: string]: boolean} | null => {
    const password: AbstractControl = control.get('password');
    const confirm: AbstractControl = control.get('passwordConfirm');

    if (password.value === confirm.value) {
        confirm.setErrors(checkErrors(confirm, false));
        return null;
    } else {
        confirm.setErrors(checkErrors(confirm, true));
        return { noMatch: true };
    }

};

export interface RegisterObj {
    email: string;
    username: string;
    password: string;
    passwordConfirm: string;
    language: string;
}
export interface Data {
    signup: boolean;
    message: string;
}
