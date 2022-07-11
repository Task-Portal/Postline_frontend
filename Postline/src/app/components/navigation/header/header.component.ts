import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();

  public isUserAuthenticated: boolean;
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.authService.authChanged.subscribe((res) => {
      this.isUserAuthenticated = res;
    });
  }

  ngOnInit(): void {
    this.authService.authChanged.subscribe((res) => {
      this.isUserAuthenticated = res;
    });
  }

  public logout = () => {
    this.authService.logout();

    if (this.authService.isExternalAuth) this.authService.signOutExternal();

    this.router.navigate(['/']);
  };

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };
}
