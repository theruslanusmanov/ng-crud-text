import {
  AfterViewInit,
  Component,
  DOCUMENT,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { fromEvent } from 'rxjs';

enum Color {
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
}

export enum ViewMode {
  VIEW,
  CREATE,
  EDIT,
}

@Component({
  selector: 'app-item',
  imports: [NgTemplateOutlet],
  templateUrl: './item.html',
  styleUrl: './item.scss',
})
export class Item implements OnInit, AfterViewInit {
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);
  viewMode: ViewMode = inject(ActivatedRoute).snapshot.data['mode'];

  @ViewChild('content', { read: ElementRef })
  contentView!: ElementRef<HTMLParagraphElement>;

  readonly colors: Color[] = [Color.RED, Color.GREEN, Color.BLUE];
  private selection: Selection | null = null;
  private selectedColor: Color = Color.RED;

  annotation = signal('');
  annotationTop = signal(0);
  annotationLeft = signal(0);
  isShowAnnotation = signal(false);

  isShowTooltip = signal(false);

  showTooltip() {
    this.isShowTooltip.set(true);
    this.selection = this.document.getSelection();
  }

  hideTooltip() {
    this.isShowTooltip.set(false);
  }

  annotate() {
    const selection = this.selection;
    if (selection) {
      const wrapper = this.renderer.createElement('span');
      this.renderer.addClass(wrapper, 'content__annotation');
      this.renderer.addClass(wrapper, `content__annotation--${this.selectedColor}`);
      this.renderer.setAttribute(wrapper, 'data-annotation-text', 'ANNOTATION TEXT');

      const selectedRange = selection.getRangeAt(0);
      selectedRange.surroundContents(wrapper);
    }
    this.hideTooltip();
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
    this.hideTooltip();
  }

  setColor(color: Color) {
    this.selectedColor = color;
  }

  listenAnnotations() {
    fromEvent(this.contentView.nativeElement, 'mouseover').subscribe((event: any) => {
      this.annotation.set(event.target.getAttribute('data-annotation-text'));
      this.annotationTop.set(event.pageY);
      this.annotationLeft.set(event.pageX)
      this.isShowAnnotation.set(true);
    });
    fromEvent(this.contentView.nativeElement, 'mouseout').subscribe((event: any) => {
      this.isShowAnnotation.set(false);
    });
  }

  listenSelectionChange() {
    fromEvent(this.contentView.nativeElement, 'mouseup').subscribe((event: any) => {
      console.log(event);
      this.showTooltip();
    });
    fromEvent(this.document, 'click').subscribe((event: any) => {
      console.log(this.selection);
      if (this.selection?.isCollapsed) {
        this.hideTooltip();
      }
    });
  }

  ngOnInit() {
    console.log(this.viewMode);
  }

  ngAfterViewInit() {
    this.listenAnnotations();
    this.listenSelectionChange();
  }

  protected readonly ViewMode = ViewMode;
}
