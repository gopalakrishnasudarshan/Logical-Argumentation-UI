import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ArgumentViewComponent } from './pages/argument-view/argument-view.component';
import { ArgumentViewArgsmeComponent } from './argument-view-argsme/argument-view-argsme.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  { path: 'topic/:topic', component: ArgumentViewComponent },

  { path: 'argument-view/args/:topic', component: ArgumentViewArgsmeComponent },
];
