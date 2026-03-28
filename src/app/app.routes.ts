import { Routes } from '@angular/router';
import { List } from './list/list';
import { Item } from './item/item';

export const routes: Routes = [
  {
    path: ':id',
    component: Item
  },
  {
    path: '',
    component: List
  },
];
