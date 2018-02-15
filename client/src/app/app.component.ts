import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  searchTerm = '';
  isCollapse = true;

  get token() {
    return localStorage.getItem('token');
  }

  collapse() {
    this.isCollapse = true;
  }

  closeDropdown(dropdown) {
    dropdown.close();
  }

  logout() {}

  search() {}
}
