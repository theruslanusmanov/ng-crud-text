import { Injectable } from '@angular/core';
import { ItemEntity } from '../models';

const STORAGE_ITEMS_KEY = 'items';

export interface TextStorage {
  create(item: ItemEntity): void;
  get(id: string): ItemEntity | undefined;
  getAll(): ItemEntity[];
  update(item: ItemEntity): void;
  remove(id: string): void;
}

@Injectable({
  providedIn: 'root',
})
export class TextStorageService implements TextStorage {
  create(item: ItemEntity) {
    const items = localStorage.getItem(STORAGE_ITEMS_KEY);
    if (items) {
      const parsedItems = (JSON.parse(items) as ItemEntity[]) ?? [];
      localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify([item, ...parsedItems]));
    } else {
      localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify([item]));
    }
  }

  get(id: string): ItemEntity | undefined {
    const items = localStorage.getItem(STORAGE_ITEMS_KEY) ?? '';
    if (!items) {
      return undefined;
    }
    const parsedItems = JSON.parse(items) as ItemEntity[];
    return parsedItems.find((item) => item.id === id);
  }

  getAll(): ItemEntity[] {
    const items = localStorage.getItem(STORAGE_ITEMS_KEY);
    return items ? (JSON.parse(items) as ItemEntity[]) : [];
  }

  update(item: ItemEntity) {
    const items = localStorage.getItem(STORAGE_ITEMS_KEY) ?? '';
    const parsedItems = JSON.parse(items) as ItemEntity[];
    const foundItemIndex = parsedItems.findIndex((item) => item.id === item.id);
    if (foundItemIndex !== -1) {
      parsedItems.splice(foundItemIndex, 1, item);
    }
    localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(parsedItems));
  }

  remove(id: string) {
    const items = localStorage.getItem(STORAGE_ITEMS_KEY) ?? '';
    const parsedItems = JSON.parse(items) as ItemEntity[];
    const foundItemIndex = parsedItems.findIndex((item) => item.id === id);
    if (foundItemIndex !== -1) {
      parsedItems.splice(foundItemIndex, 1);
    }
    localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(parsedItems));
  }
}
