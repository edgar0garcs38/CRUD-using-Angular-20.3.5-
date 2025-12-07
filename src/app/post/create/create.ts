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
  comment = '';
  selectedFile: File | null = null; // ✅ new field

  constructor(private postService: PostService, private router: Router) {}

  // ✅ handle file selection
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  submit() {
    if (!this.title || !this.body || !this.comment) {
      this.error = "All fields are required!";
      return;
    }

    // ✅ Use FormData to send text + optional file
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('body', this.body);
    formData.append('comment', this.comment);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.postService.createPosts(formData).subscribe({
      next: () => {
        alert("Post created successfully!");
        this.router.navigate(['/post']);
      },
      error: err => {
        console.error('Error creating post:', err);
        this.error = "Failed to create post.";
      }
    });
  }
}
