import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: any;
  btnDisabled = false;
  newCategory = '';
  constructor(private data: DataService, private rest: RestApiService) {}

  ngOnInit() {
    this.loadCategories();
  }

  async loadCategories() {
    try {
      const data = await this.rest.get('http://localhost:4000/api/categories');
      data['success']
        ? (this.categories = data['categories'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  async addCategory() {
    this.btnDisabled = true;
    try {
      const data = await this.rest.post(
        'http://localhost:4000/api/categories',
        {
          category: this.newCategory
        }
      );
      data['success']
        ? this.data.success(data['message'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }
}
