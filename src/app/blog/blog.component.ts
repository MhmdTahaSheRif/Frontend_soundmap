import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  categories: any[] = [];
  allTopics: any[] = [];
  filteredTopics: any[] = [];
  selectedCategoryId: number | null = null;
  categoryNames: { [key: number]: string } = {};

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchAllTopics();
  }

  fetchCategoryNameById(id: number) {
    if (this.categoryNames[id]) return;

    fetch(`https://localhost:7094/api/Categories/${id}`)
      .then(res => res.json())
      .then(data => {
        this.categoryNames[id] = data.categoryName;
      });
  }

  fetchCategories() {
    fetch('https://localhost:7094/api/Categories/GetAllCategories')
      .then(res => res.json())
      .then(data => this.categories = data);
  }

  fetchAllTopics() {
    fetch('https://localhost:7094/api/Topics/GetAllTopics')
      .then(res => res.json())
      .then(data => {
        this.allTopics = data;
        this.filteredTopics = data;

        for (const topic of data) {
          this.fetchCategoryNameById(topic.categoryId);
        }
      });
  }

  goToTopicDetails(topicId: number) {
    this.router.navigate(['/topics', topicId]);
  }

  filterByCategory(categoryId: number) {
    this.selectedCategoryId = categoryId;
    this.filteredTopics = this.allTopics.filter(t => t.categoryId === categoryId);
  }

  showAll() {
    this.selectedCategoryId = null;
    this.filteredTopics = this.allTopics;
  }
}