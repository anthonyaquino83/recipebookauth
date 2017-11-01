import { Component } from '@angular/core';
import { IonicPage, LoadingController, AlertController } from 'ionic-angular';
import { NgForm} from "@angular/forms";
import { AuthService } from "../../services/auth";

@IonicPage()
@Component({
	selector: 'page-signup',
	templateUrl: 'signup.html',
})
export class SignupPage {
	constructor(private authService: AuthService, private loadingCtrl: LoadingController, private alertCtrl: AlertController){}

	onSignup(form: NgForm){
		console.log(form.value);
		const loading = this.loadingCtrl.create({
			content: "Signing you up..."
		})
		this.authService.signup(form.value.email, form.value.password)
			.then(data => {
				console.log(data)
				loading.dismiss();
			})
			.catch(error => {
				console.log(error)
				loading.dismiss();
				const alert = this.alertCtrl.create({
					title: "Signup failed...",
					message: error.message,
					buttons: ['Ok']
				})
				alert.present();
			})
	}

}
