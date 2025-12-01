import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PostService } from '../post-service';
import { Post } from '../post';

@Component({
  selector: 'app-create',
  standalone: true, // Angular 20 style
  imports: [RouterModule, FormsModule],
  templateUrl: './create.html',
  styleUrls: ['./create.css']
})
export class Create {

  title = '';
  body = '';
  error = '';

  constructor(private postService: PostService, private router: Router) {}

  submit() {
    if (!this.title || !this.body) {
      this.error = "All fields are required!";
      return;
    }

    // ✅ Only send title and body, MongoDB will create _id
    const input: Partial<Post> = {
      title: this.title,
      body: this.body
    };

    this.postService.createPosts(input as Post).subscribe({
      next: () => {
        alert("Post created successfully!");
        this.router.navigate(['/post']); // ✅ match your index route
      },
      error: err => {
        console.error('Error creating post:', err);
        this.error = "Failed to create post.";
      }
    });
  }
}
