import { Pipe, PipeTransform } from '@angular/core';
import { DataModelService } from './model';

@Pipe({ name: 'lookup' })
export class LookupPipe implements PipeTransform {
    transform(id: string, lookup_type: string): string {
        if (!DataModelService[lookup_type] || !Array.isArray(DataModelService[lookup_type])) {
            console.error('lookup_type: ' + lookup_type + ' doesn\'t exist');
            return '';
        }
        for (const e of DataModelService[lookup_type]) {
            if (e.id === id) {
                return e.value;
            } else if (!id && e.id === false) {
                return e.value;
            }
        }
        return '';
    }
}
