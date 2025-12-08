import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PostService } from '../post-service';
import { Post } from '../post';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './create.html',
  styleUrls: ['./create.css']
})
export class Create {

  title = '';
  body = '';
  comment = '';
  error = '';
  success = '';          // mensaje de éxito

  selectedFile: File | null = null;

  constructor(
    private postService: PostService,
    private router: Router
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    this.selectedFile = file || null;
  }

  submit() {
    // limpiamos mensajes anteriores
    this.error = '';
    this.success = '';

    if (!this.title || !this.body) {
      this.error = 'El título y el contenido son obligatorios.';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('body', this.body);

    if (this.comment) {
      formData.append('comment', this.comment);
    }

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.postService.createPosts(formData as any as Post).subscribe({
      next: () => {
        this.success = 'Publicación creada correctamente.';
        // Espera un poco y vuelve al listado de posts
        setTimeout(() => {
          this.router.navigate(['/post']);
        }, 1500);
      },
      error: err => {
        console.error('Error al crear la publicación:', err);
        this.error = 'No se pudo crear la publicación. Inténtalo nuevamente.';
      }
    });
  }
}
