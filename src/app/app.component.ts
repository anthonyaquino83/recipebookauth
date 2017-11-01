import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from "../services/auth";
import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'TabsPage';
  signinPage:any = 'SigninPage';
  signupPage:any = 'SignupPage';
  isAuthenticated = false;
  @ViewChild('nav') nav: NavController;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private menuCtrl: MenuController, private authService: AuthService) {
    //get the apikey and authdomain from firebase !!!
    firebase.initializeApp({
      apiKey: "99999999999",
      authDomain: "xxxxxxxxxxx.firebaseapp.com",
    });

    firebase.auth().onAuthStateChanged(user => {
        if(user){
            this.isAuthenticated = true;
            this.rootPage = 'TabsPage';
        }else{
          console.log('else');
            this.isAuthenticated = false;
            this.rootPage = 'SigninPage';
        }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  onLoad(page: any){
    console.log('onLoad');
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

  onLogout(){
      console.log('onLogout');
      this.authService.logout();
      this.menuCtrl.close();
      this.nav.setRoot('SigninPage');
  }

}

