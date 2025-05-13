import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { routes } from '../app.routes';
import { CommonModule } from '@angular/common';
import { BlogComponent } from "../blog/blog.component";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-blog-details',
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.css'
})
export class BlogDetailsComponent implements OnInit {
  topicId: number = 0;
  topicDetails: any = {};
  categoryNames: { [key: number]: string } = {};

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.topicId = +this.route.snapshot.paramMap.get('id')!;
    
    this.fetchTopicDetails(this.topicId);
  }
  fetchCategoryNameById(id: number) {
    if (this.categoryNames[id]) return;

    fetch(`https://localhost:7094/api/Categories/${id}`)
      .then(res => res.json())
      .then(data => {
        this.categoryNames[id] = data.categoryName;
      });
  }
  fetchTopicDetails(topicId: number) {
    fetch(`https://localhost:7094/api/Topics/${topicId}`)
      .then(res => res.json())
      .then(data => {
        this.topicDetails = data;
        if (data && data.categoryId) {
          this.fetchCategoryNameById(data.categoryId);  
        }
      })
      .catch(error => console.error('Error fetching topic details:', error));
  }
  
}
