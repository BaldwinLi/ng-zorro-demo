import { Component } from '@angular/core';

@Component({
  selector: 'app-menu-component',
  templateUrl: './menu.component.html',
  styleUrls: ['../../../assets/css/custom.css']
})
export class MenuComponent {
//   title = 'app';
  private isCollapsed: Boolean = false;

  private toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
