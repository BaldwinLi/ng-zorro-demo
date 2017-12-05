import { Component } from '@angular/core';

@Component({
  selector: 'app-menu-component',
  templateUrl: './menu.component.html',
  styleUrls: ['../../../assets/css/custom.css']
})
export class MenuComponent {
  isCollapsed: Boolean = false;

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
