import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'moneyFormat',
})
export class MoneyFormatPipe implements PipeTransform {
    transform(value: number): any {
        if (value == null || value == undefined) {
            return '';
        }
        let stringValue = `${value}`;
        stringValue = stringValue
            .split(' ')
            .join('')
            .split('.')
            .join('');
        stringValue = stringValue.split(',').join('');
        const list = stringValue.split(',');
        const prefix = list[0].charAt(0) === '-' ? '-' : '';
        let num = prefix ? list[0].slice(1) : list[0];
        let result = '';
        while (num.length > 3) {
            result = `,${num.slice(-3)}${result}`;
            num = num.slice(0, num.length - 3);
        }
        if (num) {
            result = num + result;
        }
        return result;
    }
}
