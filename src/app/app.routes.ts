import { Routes } from '@angular/router';
import { List } from './list/list';
import { CreateItem } from './create-item/create-item';
import { EditItem } from './edit-item/edit-item';
import { ViewItem } from './view-item/view-item';

export const routes: Routes = [
  {
    path: 'create',
    component: CreateItem,
  },
  {
    path: 'edit/:id',
    component: EditItem,
  },
  {
    path: 'view/:id',
    component: ViewItem,
  },
  {
    path: '',
    component: List,
  },
];
