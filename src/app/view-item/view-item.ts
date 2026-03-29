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
  WritableSignal,
} from '@angular/core';
import { TextStorageService } from '../../core/services/text-storage-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ItemEntity } from '../../core';
import { fromEvent } from 'rxjs';
import { NgTemplateOutlet } from '@angular/common';

enum Color {
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
}

@Component({
  selector: 'app-view-item',
  imports: [NgTemplateOutlet],
  templateUrl: './view-item.html',
  styleUrl: './view-item.scss',
})
export class ViewItem implements OnInit, AfterViewInit {
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);
  private textStorage = inject(TextStorageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  form = inject(FormBuilder).group({
    content: [''],
  });
  item: WritableSignal<ItemEntity | undefined> = signal(undefined);

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
      this.annotationLeft.set(event.pageX);
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

  edit(id: string) {
    this.router.navigate([`/edit/${id}`]);
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.item.set(this.textStorage.get(id));
  }

  ngAfterViewInit() {
    this.listenAnnotations();
    this.listenSelectionChange();
  }
}
