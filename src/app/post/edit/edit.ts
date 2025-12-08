// src/app/post/edit/edit.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostService } from '../post-service';
import { Post } from '../post';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './edit.html',
  styleUrls: ['./edit.css']
})
export class Edit {

  id = '';
  title = '';
  body = '';
  comment = '';

  error = '';
  success = '';

  selectedFile: File | null = null;

  constructor(
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute
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
      },
      error: () => {
        this.error = 'No se pudo cargar la publicación.';
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files && event.target.files[0];
    this.selectedFile = file ?? null;
  }

  submit() {
    this.error = '';
    this.success = '';

    if (!this.title || !this.body) {
      this.error = 'El título y el contenido son obligatorios.';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('body', this.body);
    formData.append('comment', this.comment);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.postService.updatePosts(this.id, formData).subscribe({
      next: () => {
        this.success = 'Publicación actualizada correctamente.';
        setTimeout(() => {
          this.router.navigate(['/post']);
        }, 1200);
      },
      error: (err) => {
        console.error('Error al actualizar la publicación:', err);
        this.error = 'No se pudo actualizar la publicación.';
      }
    });
  }
}
