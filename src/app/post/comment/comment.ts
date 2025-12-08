// src/app/post/comment/comment.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostService } from '../post-service';
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
  success = '';

  imageUrl: string | null = null;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    if (!this.id) {
      this.error = 'Identificador de publicación no válido.';
      return;
    }

    this.postService.findPost(this.id).subscribe({
      next: (post: Post) => {
        this.title = post.title;
        this.body = post.body;
        this.comment = post.comment || '';
        this.imageUrl = post.imageUrl || null;
      },
      error: () => {
        this.error = 'No se pudo cargar la publicación.';
      }
    });
  }

  submit(): void {
    this.error = '';
    this.success = '';

    if (!this.comment.trim()) {
      this.error = 'El comentario no puede estar vacío.';
      return;
    }

    this.postService.commentPosts(this.id, { comment: this.comment }).subscribe({
      next: () => {
        this.success = 'Comentario guardado correctamente.';
        setTimeout(() => {
          this.router.navigate(['/post']);
        }, 1200);
      },
      error: (err) => {
        console.error('Error al guardar el comentario:', err);
        this.error = 'No se pudo guardar el comentario.';
      }
    });
  }
}
