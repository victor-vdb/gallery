import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'mediaSize'})
export class MediaSize implements PipeTransform {
transform(url: string, width: string, height: string): string {
    return url + '=w' + width + '-h' + height;
  }
}