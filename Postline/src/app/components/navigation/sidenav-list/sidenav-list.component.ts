import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css'],
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();
  public isUserAuthenticated: boolean;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.authService.authChanged.subscribe((res) => {
      this.isUserAuthenticated = res;
    });
  }
  ngOnInit() {
    this.authService.authChanged.subscribe((res) => {
      this.isUserAuthenticated = res;
    });
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  };

  public logout = () => {
    this.onSidenavClose();
    this.authService.logout();

    if (this.authService.isExternalAuth) this.authService.signOutExternal();

    this.router.navigate(['/']);
  };
}
