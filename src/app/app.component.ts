import { Component } from '@angular/core';

@Component({
  selector: 'ng-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  fruit!: string;

  fruitList = ['abacate', 'abacaxi', 'banana', 'maça'];

}
