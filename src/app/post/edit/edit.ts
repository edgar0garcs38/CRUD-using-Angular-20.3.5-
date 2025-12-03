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

  constructor(
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || ''; // ✅ use 'id'
    if (this.id) {
      this.postService.findPost(this.id).subscribe((post: Post) => {
        this.title = post.title;
        this.body = post.body;
        this.comment = post.comment || ''; 
      });
    } else {
      this.error = "Invalid post ID.";
    }
  }


  submit() {
    if (!this.title || !this.body || !this.comment) {
      this.error = "All fields are required!";
      return;
    }

    // ✅ no manual id, MongoDB handles _id
    const input: Partial<Post> = {
      title: this.title,
      body: this.body,
      comment: this.comment 
    };

    this.postService.updatePosts(this.id, input as Post).subscribe({
      next: () => {
        alert("Post updated successfully!");
        this.router.navigate(['/post']); // ✅ plural to match index route
      },
      error: err => {
        console.error('Error updating post:', err);
        this.error = "Failed to update post.";
      }
    });
  }
}
