import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TextStorageService } from '../../core/services/text-storage-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-item',
  imports: [ReactiveFormsModule],
  templateUrl: './create-item.html',
  styleUrl: './create-item.scss',
})
export class CreateItem {
  private textStorage = inject(TextStorageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form = inject(FormBuilder).group({
    content: [''],
  });

  create() {
    const content: string = this.form.controls.content.value ?? '';
    const id = crypto.randomUUID();
    this.textStorage.create({ id, content });
    this.router.navigate([`view/${id}`]);
  }
}
