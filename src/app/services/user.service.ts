import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'firebase';
import { Observable } from 'rxjs';

import { switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: Observable<User>;
  constructor(public angularFireAuth: AngularFireAuth, private angularFirestore: AngularFirestore, public router: Router) { 
  }

  getCurrentUser():string {
    let userId = '';
    this.angularFireAuth.auth.onAuthStateChanged(user => {
      if(user) {
        userId = user.uid;
      }
    });
    return userId;
  }

  // register a particular user with a given email and password in firebase
  registerUser(email, password) {
    this.angularFireAuth.auth
    .createUserWithEmailAndPassword(email, password)
    .then(res => {
      console.log("User Registered!");
      this.router.navigate(['todos']);
    }).catch(err => {
      console.log("Something went worng!", err);
    });
  }

  // login to the firebase with the user credentials
  loginUser(email, password) {
    this.angularFireAuth.auth
    .signInWithEmailAndPassword(email, password)
    .then(res => {
      console.log("Success login");
      this.angularFireAuth.auth.onAuthStateChanged(function(user) {
        if(user)
          // this.userId = user.uid;
          console.log(user.email);
      })
        this.router.navigate(['todos']);
      }).catch(err => {
        console.log("Something went wrong", err);
      });
    }

    // sign out the user
  signOut() {
    this.angularFireAuth.auth.signOut().then(res => {
      alert("SignOut");
      // how to redirect here
      this.router.navigate(['login'])
    }).catch(err => {
      alert("Error occured");
    })
  }

  getTodos() {
    
  }

  // delete a particular todo
  deleteTodo(data) {
    this.angularFirestore.collection('todos').doc(data).delete();
    // .then(res => {
    //   alert("Todo deleted");
    // }).catch(err => {
    //   alert("Sorry! Error occured!")
    // });
  }

  updateTodo(id, todo:string) {
    this.angularFirestore.collection('todos').doc(id).update({ todo: todo });
  }
}
