import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PostService } from '../post-service';
import { Post } from '../post';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-show',
  standalone: true,
  imports: [RouterModule, FormsModule, NgIf],
  templateUrl: './show.html',
  styleUrls: ['./show.css']
})
export class Show {

  id = '';
  title = '';
  body = '';
  comment = '';
  imageUrl: string | null = null; // ✅ new field

  constructor(private postService: PostService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['postId'];
    this.postService.findPost(this.id).subscribe((post: Post) => {
      this.title = post.title;
      this.body = post.body;
      this.comment = post.comment || '';

      // ✅ if backend returns image info
      if ((post as any).imageUrl) {
        this.imageUrl = (post as any).imageUrl;
      }
    });
  }
}
