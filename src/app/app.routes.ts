import { Routes } from '@angular/router';
import { List } from './list/list';
import { Item, ViewMode } from './item/item';

export const routes: Routes = [
  {
    path: 'edit',
    component: Item,
    data: { mode: ViewMode.CREATE },
  },
  {
    path: 'edit/:id',
    component: Item,
    data: { mode: ViewMode.EDIT },
  },
  {
    path: ':id',
    component: Item,
    data: { mode: ViewMode.VIEW },
  },
  {
    path: '',
    component: List,
  },
];
