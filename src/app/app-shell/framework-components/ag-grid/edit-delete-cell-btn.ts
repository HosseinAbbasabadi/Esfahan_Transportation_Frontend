import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
declare var $: any;

@Component({
    selector: 'edit-delete-cell-renderer',
    template: `
    <span class="mr-1">
        <a [routerLink]="[params.editUrl, guid]" class="text-warning"> 
            <i class="fa fa-edit mx-1 cursor-pointer"></i>
        </a>
    </span>
    <span class="mr-1">
        <a (click)="btnDeleteClicked(2)" class="text-danger"> 
            <i class="fa fa-trash mx-1"></i>
        </a>
    </span>`,
})
export class EditDeleteCellRenderer implements ICellRendererAngularComp {
    params: any;
    canEdit: false;
    canDelete: false;
    canView: false;
    guid;

    refresh(params: any): boolean {
        return true;
    }

    agInit(params: any): void {
        this.params = params;

        if (params.data) {
            this.canEdit = params.data.canEdit;
            this.canDelete = params.data.canDelete;
            this.canView = params.data.canView;

            if (params.data.guid) {
                this.guid = params.data.guid;
            }
        }
    }

    btnDeleteClicked(arg) {
        this.params.context
            .componentParent
            .delete(this.params.data.guid);
    }
}