import { Component } from '@angular/core';
import { ShoppingListPage } from "../shopping-list/shopping-list";
import { RecipesPage } from "../recipes/recipes";
import { IonicPage} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  slPage:any = 'ShoppingListPage';
  recipesPage:any = 'RecipesPage';
}
