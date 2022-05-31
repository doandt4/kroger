import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { menuItems } from "src/app/globals";
@Component({
  selector: "app-administrator",
  templateUrl: "./administrator.component.html",
  styleUrls: ["./administrator.component.scss"],
})
export class AdministratorComponent implements OnInit {
  isOpenStoreMenu: boolean = false;
  menuItems: any = menuItems;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  lengthChildStoreMenu(id: number) {
    return this.menuItems.filter((itemMenu: any) => itemMenu.parentId == id)
      .length;
  }

  openSubMenu(itemLink: any) {
    menuItems.map((item: any) => {
      if (item.id === itemLink.id) {
        item.isOpened = !item.isOpened;
      }
    });
  }
}
