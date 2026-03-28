import { Component } from '@angular/core';
import { ListItemEntity } from '../../core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list',
  imports: [RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List {
  readonly items: ListItemEntity[] = [
    {
      id: '1',
      content: 'CONTENT 1',
    },
    {
      id: '2',
      content: 'CONTENT 2',
    },
    {
      id: '3',
      content: 'CONTENT 3',
    },
  ];
}
