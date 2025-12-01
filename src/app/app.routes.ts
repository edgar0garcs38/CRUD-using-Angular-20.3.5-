import { Routes } from '@angular/router';
import { Index } from './post/index';
import { Create } from './post/create/create';
import { Edit } from './post/edit/edit';
import { Show } from './post/show/show';
import { Comment } from './post/comment/comment';

export const routes: Routes = [
    { path: "post", component: Index},
    { path: "posts/create", component: Create},
    { path: "posts/:postId/comment", component: Comment},
    { path: 'posts/:id/edit', component: Edit },
    { path: "posts/:postId", component: Show},
];
