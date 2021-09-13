import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    getJWToken: any;

    constructor(private router: Router) { 
    }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.getJWToken = localStorage.getItem("JWTokens");
        console.log(this.getJWToken)
                  if(this.getJWToken !== null){
                    return true;
                  }
                  else{
                    this.router.navigate(['/login'])
                    return false;   
                  }
    }
}