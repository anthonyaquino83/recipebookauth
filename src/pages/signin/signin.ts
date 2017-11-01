import { Component } from '@angular/core';
import { IonicPage, LoadingController, AlertController } from 'ionic-angular';
import { NgForm} from "@angular/forms";
import { AuthService } from "../../services/auth";

@IonicPage()
@Component({
	selector: 'page-signin',
	templateUrl: 'signin.html',
})
export class SigninPage {
	constructor(private authService: AuthService, private loadingCtrl: LoadingController, private alertCtrl: AlertController){}

	onSignin(form: NgForm){
		console.log(form.value);
		const loading = this.loadingCtrl.create({
			content: "Signing you in..."
		})
		this.authService.signin(form.value.email, form.value.password)
			.then(data => {
				console.log(data)
				loading.dismiss();
			})
			.catch(error => {
				console.log('catch', error)
				loading.dismiss();
				const alert = this.alertCtrl.create({
					title: "Signin failed...",
					message: error.message,
					buttons: ['Ok']
				})
				alert.present();
			})
	}
}
