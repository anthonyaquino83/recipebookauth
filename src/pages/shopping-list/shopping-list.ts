import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";

import { ShoppingListService } from "../../services/shopping-list";
import { Ingredient } from "../../models/ingredient";
import { IonicPage, LoadingController, AlertController, PopoverController} from 'ionic-angular';
import { AuthService } from "../../services/auth";

@IonicPage()
@Component({
    selector: 'page-shopping-list',
    templateUrl: 'shopping-list.html'
})
export class ShoppingListPage {
    listItems: Ingredient[];

    constructor(private slService: ShoppingListService, public loadingCtrl: LoadingController, 
        public alertCtrl: AlertController,
        private popoverCtrl:PopoverController, private authService: AuthService) {}

    ionViewWillEnter() {
        this.loadItems();
    }

    onAddItem(form: NgForm) {
        this.slService.addItem(form.value.ingredientName, form.value.amount);
        form.reset();
        this.loadItems();
    }

    onCheckItem(index: number) {
        this.slService.removeItem(index);
        this.loadItems();
    }

    onShowOptions(event: MouseEvent){
        const popover = this.popoverCtrl.create('DatabaseOptionsPage');
        const loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        popover.present({ev: event});
        popover.onDidDismiss(
            data => {
                // console.log('a');
                if (!data){
                    // console.log('b');
                    return;
                }
                if (data.action == 'load'){
                    // console.log('c');
                    loading.present();
                    this.authService.getActiveUser().getToken()
                        .then(
                            (token: string) => {
                            console.log('d');
                                this.slService.fetchList(token)
                                    .subscribe(
                                        (list: Ingredient[]) => {
                                            loading.dismiss();
                                            console.log('Success!', list);
                                            if(list)   {
                                                this.listItems = list;
                                            }else{
                                                this.listItems = [];
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
                                this.slService.storeList(token)
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
        this.listItems = this.slService.getItems();
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
