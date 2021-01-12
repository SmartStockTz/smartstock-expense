import {Component, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {FileBrowserDialogComponent, UserService} from '@smartstocktz/core-libs';

@Component({
  selector: 'smartstock-stock-downloadable',
  template: `
    <div style="display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; padding: 8px">
      <div *ngFor="let file of files; let i =index"
           style="display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center">
        <mat-card style="height: 50px; margin: 5px; display: flex; flex-direction: row; align-items: center">
          <span style="max-width: 200px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
            {{file.name}}
          </span>
          <span style="width: 10px"></span>
          <button mat-icon-button style="display: inline-block" (click)="removeFile($event, i)">
            <mat-icon color="warn">delete</mat-icon>
          </button>
        </mat-card>
      </div>
      <mat-card (click)="chooseFile($event)" matRipple style="width: 120px; height: 50px; margin: 5px">
        <mat-icon>attachment</mat-icon>
        <span>Add File</span>
      </mat-card>
    </div>
  `,
})
export class DownloadableComponent implements OnInit {
  @Input() files: { name: string, type: string, url: File }[] = [];
  @Input() uploadFileFormControl: FormControl = new FormControl([]);

  constructor(private readonly dialog: MatDialog,
              private readonly userService: UserService) {
  }

  ngOnInit(): void {
  }

  removeFile($event: MouseEvent, i: number): void {
    $event.preventDefault();
    this.files.splice(i, 1);
  }

  async chooseFile($event: MouseEvent): Promise<void> {
    $event.preventDefault();
    this.dialog.open(FileBrowserDialogComponent, {
      closeOnNavigation: false,
      disableClose: false,
      data: {
        shop: await this.userService.getCurrentShop()
      }
    }).afterClosed().subscribe(file => {
      if (file && file.url) {
        if (this.files.length === 0) {
          this.files.push({
            name: file.suffix,
            type: file.suffix,
            url: file.url,
          });
        } else {
          this.files = this.files.filter(value => file.url !== value.url);
          this.files.push({
            name: file.suffix,
            type: file.suffix,
            url: file.url,
          });
        }
        this.uploadFileFormControl.setValue(this.files);
      }
    });
  }
}
