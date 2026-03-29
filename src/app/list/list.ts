import { Component, DOCUMENT, inject, OnInit } from '@angular/core';
import { ItemEntity } from '../../core';
import { RouterLink } from '@angular/router';
import { TextStorageService } from '../../core/services/text-storage.service';

import { SafeHtmlPipe } from '../../core/pipes/safe-html.pipe';

@Component({
  selector: 'app-list',
  imports: [RouterLink, SafeHtmlPipe],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List implements OnInit {
  private textStorage = inject(TextStorageService);

  items: ItemEntity[] = [];

  ngOnInit() {
    this.items = this.textStorage.getAll();
  }
}
