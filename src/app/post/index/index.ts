import { Component } from '@angular/core';
import { PostService } from '../post-service';
import { Post } from '../post';
import { RouterModule } from "@angular/router";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './index.html',
  styleUrls: ['./index.css']
})
export class Index {

  // Lista de publicaciones
  posts: Post[] = [];

  // Estados para el modal de eliminación
  mostrarModalEliminar = false;
  postAEliminar: Post | null = null;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.cargarPosts();
  }

  // Carga todas las publicaciones
  cargarPosts() {
    this.postService.getPosts().subscribe((data: Post[]) => {
      this.posts = data;
    });
  }

  // Abre el modal y guarda el post que se quiere eliminar
  confirmarEliminar(post: Post) {
    this.postAEliminar = post;
    this.mostrarModalEliminar = true;
  }

  // Cierra el modal sin eliminar
  cancelarEliminar() {
    this.mostrarModalEliminar = false;
    this.postAEliminar = null;
  }

  // Elimina definitivamente la publicación
  eliminarConfirmado() {
    if (!this.postAEliminar?._id) {
      return;
    }

    const id = this.postAEliminar._id;

    this.postService.deletePost(id).subscribe({
      next: () => {
        // Quitamos el post de la lista sin recargar todo
        this.posts = this.posts.filter(p => p._id !== id);
        this.mostrarModalEliminar = false;
        this.postAEliminar = null;
      },
      error: () => {
        // Aquí podrías mostrar un mensaje de error si quieres
        this.mostrarModalEliminar = false;
      }
    });
  }
}
