import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
declare var $: any;

@Component({
    selector: 'edit-delete-cell-renderer',
    template: `
    <span class="mr-1">
        <a [routerLink]="[params.editUrl, id]"> 
            <i class="la la-edit fs-4 me-1 cursor-pointer"></i>
        </a>
    </span>
    <span class="mr-1">
        <a (click)="btnDeleteClicked(2)"> 
            <i class="la la-trash fs-4 me-1 cursor-pointer"></i>
        </a>
    </span>`,
})
export class EditDeleteCellRenderer implements ICellRendererAngularComp {
    params: any;
    canEdit: false;
    canDelete: false;
    canView: false;
    id: 0;

    refresh(params: any): boolean {
        return true;
    }

    agInit(params: any): void {
        this.params = params;

        if (params.data) {
            if (params.data.canEdit) {
                this.canEdit = params.data.canEdit;
            }

            if (params.data.canDelete) {
                this.canDelete = params.data.canDelete;
            }

            if (params.data.canView) {
                this.canView = params.data.canView;
            }

            if (params.data.id) {
                this.id = params.data.id;
            }
        }
    }

    btnDeleteClicked(arg) {
        this.params.context
            .componentParent
            .delete(this.params.data.id);
    }
}