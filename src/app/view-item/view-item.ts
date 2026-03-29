import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import { TextStorageService } from '../../core/services/text-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemEntity } from '../../core';
import { fromEvent } from 'rxjs';
import { SafeHtmlPipe } from '../../core/pipes/safe-html.pipe';

enum Color {
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
}

@Component({
  selector: 'app-view-item',
  imports: [SafeHtmlPipe],
  templateUrl: './view-item.html',
  styleUrl: './view-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewItem implements OnInit, AfterViewInit {
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);
  private textStorage = inject(TextStorageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  item: WritableSignal<ItemEntity | undefined> = signal(undefined);

  @ViewChild('content', { read: ElementRef })
  contentView!: ElementRef<HTMLParagraphElement>;

  readonly colors: Color[] = [Color.RED, Color.GREEN, Color.BLUE];
  private selection: Selection | null = null;
  selectedColor: Color = Color.RED;

  annotation = signal('');
  annotationTop = signal(0);
  annotationLeft = signal(0);
  isShowAnnotation = signal(false);

  tooltipTop = signal(0);
  tooltipLeft = signal(0);
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
      let sign = prompt('Annotation');
      const wrapper = this.renderer.createElement('span');
      this.renderer.addClass(wrapper, 'content__annotation');
      this.renderer.addClass(wrapper, `content__annotation--${this.selectedColor}`);
      this.renderer.setAttribute(wrapper, 'data-annotation-text', sign || 'annotation');

      const selectedRange = selection.getRangeAt(0);
      const isSafeRange = selectedRange.startContainer === selectedRange.endContainer;
      if (isSafeRange) {
        selectedRange.surroundContents(wrapper);
      }
    }
    this.hideTooltip();
    this.item.set({
      id: this.item()!.id,
      content: this.contentView.nativeElement.innerHTML,
    });
    this.textStorage.update(this.item() as ItemEntity);
  }

  underline() {
    const selection = this.selection;
    if (selection) {
      const wrapper = this.renderer.createElement('span');
      this.renderer.addClass(wrapper, 'content__underline');
      this.renderer.addClass(wrapper, `content__underline--${this.selectedColor}`);
      const selectedRange = selection.getRangeAt(0);
      const isSafeRange = selectedRange.startContainer === selectedRange.endContainer;
      if (isSafeRange) {
        selectedRange.surroundContents(wrapper);
      }
    }
    this.hideTooltip();
    this.item.set({
      id: this.item()!.id,
      content: this.contentView.nativeElement.innerHTML,
    });
    this.textStorage.update(this.item() as ItemEntity);
  }

  setColor(color: Color) {
    this.selectedColor = color;
  }

  listenAnnotations() {
    fromEvent(this.contentView.nativeElement, 'mouseover').subscribe((event: any) => {
      if (this.selection?.isCollapsed) {
        this.annotation.set(event.target.getAttribute('data-annotation-text'));
        this.annotationTop.set(event.pageY);
        this.annotationLeft.set(event.pageX);
        this.isShowAnnotation.set(true);
      }
    });
    fromEvent(this.contentView.nativeElement, 'mouseout').subscribe((event: any) => {
      this.isShowAnnotation.set(false);
    });
  }

  listenSelectionChange() {
    fromEvent(this.contentView.nativeElement, 'mouseup').subscribe((event: any) => {
      if (!this.isShowTooltip()) {
        this.tooltipTop.set(event.pageY);
        this.tooltipLeft.set(event.pageX);
      }
      this.showTooltip();
    });
    fromEvent(this.document, 'click').subscribe((event: any) => {
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
