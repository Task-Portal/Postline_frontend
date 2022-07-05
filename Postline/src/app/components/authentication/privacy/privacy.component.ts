import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { userRoutes } from '../../../routes/userRoutes';
import { Claim } from '../../../interfaces/user/claim';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css'],
})
export class PrivacyComponent implements OnInit {
  public claims: Claim[] = [];
  constructor(private authService: AuthenticationService) {}
  ngOnInit(): void {
    this.getClaims();
  }
  public getClaims = () => {
    console.log(`Getting Claims.${Date.now()}`);
    this.authService.getClaims(userRoutes.getClaims).subscribe((res) => {
      this.claims = res as [];
    });
  };
}
