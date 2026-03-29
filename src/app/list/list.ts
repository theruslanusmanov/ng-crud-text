import { Component, DOCUMENT, inject, OnInit } from '@angular/core';
import { ItemEntity } from '../../core';
import { RouterLink } from '@angular/router';
import { TextStorageService } from '../../core/services/text-storage-service';

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



@Component({
  selector: 'app-list',
  imports: [RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List implements OnInit {
  private textStorage = inject(TextStorageService)

  items: ItemEntity[] = [];

  ngOnInit() {
    this.items = this.textStorage.getAll();
  }
}
