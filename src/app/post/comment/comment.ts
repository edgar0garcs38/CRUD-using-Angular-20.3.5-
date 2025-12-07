import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostService, CommentPayload } from '../post-service';
import { Post } from '../post';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [RouterModule, FormsModule, NgIf],
  templateUrl: './comment.html',
  styleUrls: ['./comment.css']
})
export class Comment {

  id = '';
  title = '';
  body = '';
  comment = '';
  error = '';
  imageUrl: string | null = null; // ✅ new field

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
        this.comment = (post as any).comment || '';

        // ✅ if backend returns image info
        if ((post as any).imageUrl) {
          this.imageUrl = (post as any).imageUrl;
        }
      },
      error: (err) => {
        console.error('Error loading post', err);
        this.error = 'Failed to load post';
      }
    });
  }

  submit() {
    this.error = '';
    if (!this.comment || !this.comment.trim()) {
      this.error = "All fields are required!";
      return;
    }

    const payload: CommentPayload = { comment: this.comment.trim() };

    this.postService.commentPosts(this.id, payload).subscribe({
      next: (updatedPost) => {
        alert("Post updated successfully!");
        this.router.navigate(['/post']);
      },
      error: (err) => {
        console.error('PATCH error response:', err);
        this.error = err?.error?.message ?? 'Failed to update comment (server error)';
      }
    });
  }
}
