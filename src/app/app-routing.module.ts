import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: 'pages', loadChildren: () => import('./components/page/page.module').then(m => m.PageModule) },
  { path: 'home', loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule) },
  { path: 'products', loadChildren: () => import('./components/products/products.module').then(m => m.ProductsModule) },
  { path: 'productslist', loadChildren: () => import('./components/productslist/productslist.module').then(m => m.ProductslistModule) },
  { path: 'details', loadChildren: () => import('./components/details/details.module').then(m => m.DetailsModule) },
  { path: 'mycart', loadChildren: () => import('./components/mycart/mycart.module').then(m => m.MycartModule) },
  { path: 'itemhistory', loadChildren: () => import('./components/itemhistory/itemhistory.module').then(m => m.ItemhistoryModule) },
  { path: 'profile', loadChildren: () => import('./components/profile/profile.module').then(m => m.ProfileModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
