import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  content: any;
  query: string;
  page = 1;

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private activedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activedRoute.params.subscribe(res => {
      this.query = res['query'];
      this.page = 1;
      this.getProducts();
    });
  }

  get lower() {
    return 1 + this.content.hitsPerPage * this.content.page;
  }

  get upper() {
    return Math.min(
      this.content.hitsPerPage * (this.content.page * 1),
      this.content.nbHits
    );
  }

  async getProducts() {
    try {
      const data = await this.rest.get(
        `http://localhost:4000/api/search?query=${this.query}&page=${this.page -
          1}`
      );
      data['success']
        ? (this.content = data['content'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }
}
