import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostService } from '../post-service';
import { Post } from '../post';

@Component({
  selector: 'app-show',
  imports: [RouterModule, FormsModule],
  templateUrl: './show.html',
  styleUrl: './show.css'
})
export class Show {

  id = '';
  title = '';
  body = '';
  comment = '';
  constructor(private postService: PostService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['postId'];
    this.postService.findPost(this.id).subscribe((post: Post) => {
      this.title = post.title;
      this.body = post.body;
      this.comment = post.comment || ''; 
    });
  }

}
