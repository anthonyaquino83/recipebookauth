import { Component } from '@angular/core';
import { IonicPage, LoadingController, AlertController, PopoverController, NavController } from "ionic-angular";

import { Recipe } from "../../models/recipe";
import { RecipesService } from "../../services/recipes";
import { RecipePage } from "../recipe/recipe";
import { AuthService } from "../../services/auth";

@IonicPage()
@Component({
    selector: 'page-recipes',
    templateUrl: 'recipes.html'
})
export class RecipesPage {
    recipes: Recipe[];

    constructor (private navCtrl: NavController, private recipesService: RecipesService, 
        public loadingCtrl: LoadingController, 
        public alertCtrl: AlertController,
        private popoverCtrl:PopoverController,
        private authService: AuthService) {}

    ionViewWillEnter() {
    this.recipes = this.recipesService.getRecipes();
    }

    onNewRecipe() {
    this.navCtrl.push('EditRecipePage', {mode: 'New'});
    }

    onLoadRecipe(recipe: Recipe, index: number) {
    this.navCtrl.push(RecipePage, {recipe: recipe, index: index});
    }

    onShowOptions(event: MouseEvent){
        const popover = this.popoverCtrl.create('DatabaseOptionsPage');
        const loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        popover.present({ev: event});
        popover.onDidDismiss(
            data => {
                if (!data){
                    return;
                }
                if (data.action == 'load'){
                    loading.present();
                    this.authService.getActiveUser().getToken()
                        .then(
                            (token: string) => {
                                this.recipesService.fetchList(token)
                                    .subscribe(
                                        (list: Recipe[]) => {
                                            loading.dismiss();
                                            console.log('Success!');
                                            if(list)   {
                                                this.recipes = list;
                                            }else{
                                                this.recipes = [];
                                            }
                                        },
                                        error => { 
                                            loading.dismiss();
                                            console.log('aki', error)
                                            this.handleError(error.json().error);
                                        }
                                    );
                            }
                        );
                }else if(data.action == 'store'){
                    loading.present();
                    this.authService.getActiveUser().getToken()
                        .then(
                            (token: string) => {
                                this.recipesService.storeList(token)
                                    .subscribe(
                                        () => {
                                            loading.dismiss(),
                                            console.log('Success!')
                                        },
                                        error => { 
                                            loading.dismiss();
                                            console.log(error);
                                            this.handleError(error.json().error);
                                        }
                                    );
                            }
                        );
                }

            }
        );

    }

    private loadItems() {
        this.recipes = this.recipesService.getRecipes();
    }

    private handleError(errorMessage: string) {
        const alert = this.alertCtrl.create({
            title: 'An error occurred!',
            message: errorMessage,
            buttons: ['Ok']
        });   
        alert.present();
    }

}
