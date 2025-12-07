import { Component } from '@angular/core';
import { PostService } from '../post-service';
import { Post } from '../post';
import { RouterModule } from "@angular/router";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-index',
  standalone: true,          // ✅ Angular 20 style
  imports: [RouterModule, NgIf],
  templateUrl: './index.html',
  styleUrls: ['./index.css']
})
export class Index {

  posts: Post[] = [];

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  deletePost(id: string) {   // ✅ use string, not number
    if (confirm("Are you sure you want to delete this post?")) {
      this.postService.deletePost(id).subscribe(() => {
        this.loadPosts();
      });
    }
  }

  loadPosts() {
    this.postService.getPosts().subscribe((data: Post[]) => {
      this.posts = data;
    });
  }
}
