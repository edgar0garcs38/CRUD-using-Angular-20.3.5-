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

  getPosts(): Observable<Post[]>{
    return this.http.get<Post[]>(this.apiURL + '/posts');
  }
  createPosts(data: Post): Observable<Post>{
    return this.http.post<Post>(this.apiURL + '/posts', data);
  }
  findPost(id: string): Observable<Post>{
    return this.http.get<Post>(this.apiURL + '/posts/' + id);
  }
  updatePosts(id:string, data: Post): Observable<Post>{
    return this.http.put<Post>(this.apiURL + '/posts/' + id, data);
  }
  // Use CommentPayload and return Observable<Post>

  commentPosts(postId: string | number, payload: { comment: string }) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch<Post>(`${this.apiURL}/posts/${postId}`, payload, { headers });
  }
  deletePost(id: number): Observable<any>{
    return this.http.delete<any>(this.apiURL + '/posts/' + id);
  }
}
