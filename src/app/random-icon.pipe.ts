import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'randomIcon',
  pure: true // Make it a pure pipe
})
export class RandomIconPipe implements PipeTransform {
  private icons = ['historical', 'environmental', 'musical', 'cultural', 'modern'];
  
  // Make the parameter optional with a default value of null
  transform(value: any = null): string {
    // If no value is provided or value is null, return a random icon
    if (value === null || value === undefined) {
      return this.icons[Math.floor(Math.random() * this.icons.length)];
    }
    
    // Use the input value to create a deterministic "random" selection
    let seed = 0;
    if (typeof value === 'string') {
      // Create a simple hash from the string
      for (let i = 0; i < value.length; i++) {
        seed += value.charCodeAt(i);
      }
    } else if (typeof value === 'number') {
      seed = value;
    } else {
      // For objects or other types, use their string representation
      seed = JSON.stringify(value).length;
    }
    
    // Use the seed to select an icon
    const index = seed % this.icons.length;
    return this.icons[index];
  }
}
