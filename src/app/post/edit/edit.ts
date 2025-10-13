import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostService } from '../post-service';
import { Post } from '../post';

@Component({
  selector: 'app-edit',
  imports: [RouterModule, FormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css'
})
export class Edit {

  id = '';
  title = '';
  body = '';
  error = '';

  constructor(private postService: PostService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['postId'];
    this.postService.findPost(this.id).subscribe((post: Post) => {
      this.title = post.title;
      this.body = post.body;
    });
  }

  submit(){
    if(!this.title || !this.body){
      this.error = "All fields are required!";
      return;
    }

    const input = {
      title: this.title,
      body: this.body,
      id: 1
    };

    this.postService.updatePosts(this.id, input).subscribe();

    alert("Post updated successfully!");
    
    this.router.navigate(['/post']);
  }

}
