import { Component, inject, OnInit } from '@angular/core';
import { TextStorageService } from '../../core/services/text-storage-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ItemEntity } from '../../core';

@Component({
  selector: 'app-edit-item',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-item.html',
  styleUrl: './edit-item.scss',
})
export class EditItem implements OnInit {
  private textStorage = inject(TextStorageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  id: string = this.route.snapshot.params['id'];

  form = inject(FormBuilder).group({
    content: [''],
  });

  update() {
    const content: string = this.form.controls.content.value ?? '';
    this.textStorage.update({ id: this.id, content });
    this.router.navigate([`view/${this.id}`]);
  }

  remove() {
    this.textStorage.remove(this.id);
    this.router.navigate(['/']);
  }

  ngOnInit() {
    this.form.controls.content.setValue((this.textStorage.get(this.id) as ItemEntity).content);
  }
}
