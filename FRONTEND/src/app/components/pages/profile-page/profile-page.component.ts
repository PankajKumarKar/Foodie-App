import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit{

  user!:User;
  constructor(private userService:UserService){}
  ngOnInit(): void {

    this.userService.userObservable.subscribe((currentUser)=>{
      this.user=currentUser;
    })
    
  }

}
