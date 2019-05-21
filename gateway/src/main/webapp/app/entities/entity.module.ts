import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'blog',
        loadChildren: './consumer/blog/blog.module#BlogBlogModule'
      },
      {
        path: 'post',
        loadChildren: './consumer/post/post.module#BlogPostModule'
      },
      {
        path: 'tag',
        loadChildren: './consumer/tag/tag.module#BlogTagModule'
      },
      {
        path: 'product',
        loadChildren: './consumer/product/product.module#StoreProductModule'
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ],
  declarations: [],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GatewayEntityModule {}
