// post-service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from './post';

export interface CommentPayload {
  comment: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiURL = "http://localhost:8000/api";
  
  constructor(private http: HttpClient) { }

  // ✅ Get all posts
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiURL}/posts`);
  }

  // ✅ Create post (supports FormData for image upload)
  createPosts(data: FormData | Post): Observable<Post> {
    return this.http.post<Post>(`${this.apiURL}/posts`, data);
  }

  // ✅ Find single post
  findPost(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiURL}/posts/${id}`);
  }

  // ✅ Update post (supports FormData for image replacement)
  updatePosts(id: string, data: FormData | Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiURL}/posts/${id}`, data);
  }

  // ✅ Add/Edit comment only (JSON payload)
  commentPosts(postId: string | number, payload: CommentPayload): Observable<Post> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch<Post>(`${this.apiURL}/posts/${postId}`, payload, { headers });
  }

  // ✅ Delete post
  deletePost(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/posts/${id}`);
  }
}
