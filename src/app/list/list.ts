import { Component, DOCUMENT, inject, OnInit } from '@angular/core';
import { ItemEntity } from '../../core';
import { RouterLink } from '@angular/router';

const items: ItemEntity[] = [
  {
    id: '1',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque doloremque perferendis soluta tenetur vel. Aliquid\n' +
      '  asperiores beatae cum dicta dolorum, ducimus eos excepturi labore laudantium maiores molestiae quaerat quos,\n' +
      '  ullam.',
    modificators: [
      {
        annotation: 'Annotation 1',
        underline: true,
        color: 'green',
        start: '0',
        end: '0',
      },
    ],
  },
];

const STORAGE_ITEMS_KEY = 'items';

@Component({
  selector: 'app-list',
  imports: [RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List implements OnInit {
  items: ItemEntity[] = [];
  private localStorage: Storage | undefined = inject(DOCUMENT)?.defaultView?.localStorage;

  loadItems(): ItemEntity[] {
    const items = this.localStorage?.getItem(STORAGE_ITEMS_KEY);
    return items ? (JSON.parse(items) as ItemEntity[]) : [];
  }

  ngOnInit() {
    this.localStorage?.clear();
    this.localStorage?.setItem(STORAGE_ITEMS_KEY, JSON.stringify(items));
    this.items = this.loadItems();
  }
}
