import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  public isUserAuthenticated: boolean;
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.authChanged.subscribe((res) => {
      this.isUserAuthenticated = res;
    });
  }

  public logout = () => {
    this.authService.logout();
    this.router.navigate(['/']);
  };
}
