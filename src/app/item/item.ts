import { Component, DOCUMENT, ElementRef, inject, Renderer2, ViewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

enum Color {
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
}

@Component({
  selector: 'app-item',
  imports: [NgTemplateOutlet],
  templateUrl: './item.html',
  styleUrl: './item.scss',
})
export class Item {
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);

  @ViewChild('content') contentView!: ElementRef<HTMLParagraphElement>;

  readonly colors: Color[] = [Color.RED, Color.GREEN, Color.BLUE];
  private selection: Selection | null = null;
  private selectedColor: Color = Color.RED;

  showTooltip() {
    this.selection = this.document.getSelection();
  }

  annotate() {
    const selection = this.selection;
    if (selection) {
      const wrapper = this.renderer.createElement('span');
      this.renderer.addClass(wrapper, 'content__annotation');
      this.renderer.addClass(wrapper, `content__annotation--${this.selectedColor}`);

      const selectedRange = selection.getRangeAt(0);
      selectedRange.surroundContents(wrapper);
    }
  }

  underline() {
    const selection = this.selection;
    if (selection) {
      const wrapper = this.renderer.createElement('span');
      this.renderer.addClass(wrapper, 'content__underline');
      this.renderer.addClass(wrapper, `content__underline--${this.selectedColor}`);
      const selectedRange = selection.getRangeAt(0);
      selectedRange.surroundContents(wrapper);
    }
  }

  setColor(color: Color) {
    this.selectedColor = color;
  }
}
