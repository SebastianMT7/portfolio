import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  animations: [
    fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation()
  ]
})
export class ContactComponent {
  currentLanguage: string = 'en';
  http = inject(HttpClient);
  showPopup = false;
  mailTest = false;


  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang(this.currentLanguage);
  }  

  contactData = {
    name: "",
    email: "",
    message: "",
    checkbox: false,
  }

  sendMail() {
    this.showPopup = true;
    setTimeout(() => {
      this.showPopup = false;
    }, 5000);
  }

  post = {
    endPoint: 'https://sebastian-torney.de/sendMail.php',
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: {
        'Content-Type': 'text/plain',
        responseType: 'text',
      },
    },
  };

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid && !this.mailTest) {
      this.http.post(this.post.endPoint, this.post.body(this.contactData))
        .subscribe({
          next: (response) => {
            this.showPopup = true;
            ngForm.resetForm();
            setTimeout((): void => {
              this.showPopup = false;
            }, 5000);

          },
          error: (error) => {
            console.error(error);
          },
          complete: () => console.info('send post complete'),
        });
    } else if (ngForm.submitted && ngForm.form.valid && this.mailTest) {
      this.contactData.email = '';
      this.showPopup = true;
      ngForm.resetForm();
      console.log('send post complete')
      setTimeout((): void => {
        this.showPopup = false;
      }, 5000);
    }
  }
}


