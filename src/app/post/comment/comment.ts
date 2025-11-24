// comment.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostService, CommentPayload } from '../post-service';
import { Post } from '../post';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './comment.html',
  styleUrls: ['./comment.css']
})
export class Comment {

  id = '';
  title = '';
  body = '';
  comment = '';
  error = '';

  constructor(
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['postId'];
    this.postService.findPost(this.id).subscribe({
      next: (post: Post) => {
        this.title = post.title;
        this.body = post.body;
        // if your backend stores comments as a string property named 'comment'
        this.comment = (post as any).comment || '';
      },
      error: (err) => {
        console.error('Error loading post', err);
        this.error = 'Failed to load post';
      }
    });
  }

// comment.component.ts (only the submit method shown)
  submit(){
    this.error = '';
    if (!this.comment || !this.comment.trim()) {
      this.error = "All fields are required!";
      return;
    }

    const payload = { comment: this.comment.trim() };
    console.log('PATCH payload:', payload);

    this.postService.commentPosts(this.id, payload).subscribe({
      next: (updatedPost) => {
        console.log('Server response:', updatedPost);
        alert("Post updated successfully!");
        this.router.navigate(['/post']);
      },
      error: (err) => {
        console.error('PATCH error response:', err);
        // If server returns a message in err.error, show it:
        if (err?.error) {
          // try to give a helpful message:
          this.error = err.error.message ?? JSON.stringify(err.error);
        } else {
          this.error = 'Failed to update comment (server error)';
        }
      }
    });
  }

}
