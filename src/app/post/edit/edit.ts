import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostService } from '../post-service';
import { Post } from '../post';

@Component({
  selector: 'app-edit',
  standalone: true, // Angular 20 style
  imports: [RouterModule, FormsModule],
  templateUrl: './edit.html',
  styleUrls: ['./edit.css']
})
export class Edit {

  id = '';
  title = '';
  body = '';
  error = '';
  comment = '';
  selectedFile: File | null = null; // ✅ new field

  constructor(
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.postService.findPost(this.id).subscribe((post: Post) => {
        this.title = post.title;
        this.body = post.body;
        this.comment = post.comment || '';
        // ⚠️ If you want to show existing image preview, you can store post.imageUrl here
      });
    } else {
      this.error = "Invalid post ID.";
    }
  }

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

    this.postService.updatePosts(this.id, formData).subscribe({
      next: () => {
        alert("Post updated successfully!");
        this.router.navigate(['/post']);
      },
      error: err => {
        console.error('Error updating post:', err);
        this.error = "Failed to update post.";
      }
    });
  }
}
