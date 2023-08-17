import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Profile from 'src/app/models/profile.model';
import User from 'src/app/models/user.model';
import { ProfileService } from 'src/app/services/profile-service/profile.service';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  users : User[] = [];

  imagePaths: string[] = [
    '/assets/images/icons/icon1.png',
    '/assets/images/icons/icon2.png',
    '/assets/images/icons/icon3.png',
    '/assets/images/icons/icon4.png',
    '/assets/images/icons/icon5.png',
    '/assets/images/icons/icon6.png',
    '/assets/images/icons/icon7.png',
    '/assets/images/icons/icon8.png',
    '/assets/images/icons/icon9.png',
    '/assets/images/icons/icon10.png',
    '/assets/images/icons/icon11.png',
    '/assets/images/icons/icon12.png',
    '/assets/images/icons/icon13.png',
    '/assets/images/icons/icon14.png',
    '/assets/images/icons/icon15.png',
    '/assets/images/icons/icon16.png',
    '/assets/images/icons/icon17.png',
    '/assets/images/icons/icon18.png',
    '/assets/images/icons/icon19.png',
    '/assets/images/icons/icon20.png',
  ];

  imagePreview: string = "";
  isImageSelected: boolean = false;
  showIconGrid: boolean = false;
  
  constructor(private userService: UserService, private profileService: ProfileService ,private router: Router) {}
  
  ngOnInit() {
    this.userService.getUsers().subscribe(
      (users) => {
        this.users = users as User[];
      },
      (error) => {
        console.log(error.error);
      }
    );
  }

  toggleIconGrid() {
    this.showIconGrid = !this.showIconGrid;
  }

  onImageSelected(imagePath: string) {
    this.imagePreview = imagePath;
    this.isImageSelected = true;
    this.showIconGrid = false;
  }
  
  removeImage() {
    this.imagePreview = "";
    this.isImageSelected = false;
    this.showIconGrid = false;
  }
  

  // onImageSelected(event: any, imageInput: NgModel): void {
  //   const file = event.target.files[0];
  
  //   if (file && file.type.startsWith('image')) {
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         const image = new Image();
  //         image.src = e.target?.result as string;
  //         image.onload = () => {
  //           const canvas = document.createElement('canvas');
  //           const ctx = canvas.getContext('2d');
  
  //           const targetDim = 200; // Target dimensions
  //           canvas.width = targetDim;
  //           canvas.height = targetDim;
  
  //           // Calculate the position to draw the image on canvas to ensure it's centered
  //           let dx = 0;
  //           let dy = 0;
  //           let dWidth = targetDim;
  //           let dHeight = targetDim;
  //           const imgAspectRatio = image.width / image.height;
  
  //           if (imgAspectRatio > 1) { // Width is greater than height
  //               dHeight = targetDim / imgAspectRatio;
  //               dy = (targetDim - dHeight) / 2;
  //           } else if (imgAspectRatio < 1) { // Height is greater than width
  //               dWidth = targetDim * imgAspectRatio;
  //               dx = (targetDim - dWidth) / 2;
  //           }
  
  //           ctx?.drawImage(image, dx, dy, dWidth, dHeight);
  
  //           const dataUrl = canvas.toDataURL('image/jpeg', 0.8);  // Use JPEG with 80% quality
  //           this.imagePreview = dataUrl;
  
  //           this.isImageSelected = true;  // Set the flag to true as an image has been selected
  //         };
  //       };
  //       reader.readAsDataURL(file);
  //   } else {
  //       this.imagePreview = null;  // Reset the preview URL
  //       this.isImageSelected = false;  // Reset the flag as no image is selected
  //       imageInput.control.setErrors({ 'file': true });
  //   }
  // }  

  // removeImage(): void {
  //   this.imagePreview = null;  // Reset the preview URL
  //   this.isImageSelected = false;  // Reset the flag as no image is selected

  //   // Optional: You can also reset the file input, but this will require a reference to the element
  //   const fileInput: any = document.getElementById('signupImage');
  //   if (fileInput) {
  //       fileInput.value = '';  // Clear the file input
  //   }
  // }

  async onSubmit(registrationForm: NgForm) {
    if (registrationForm.valid) {
      const formData = registrationForm.value;
  
      const tempUser: User = new User(
        "1",
        formData.email,
        formData.password
      )
  
      this.userService.postUser(tempUser).subscribe((createdUser) => {
        const tempProfile = new Profile(
          "1",
          formData.nickname,
          this.imagePreview,
          createdUser as User,
          []
        )

        this.profileService.postProfile(tempProfile).subscribe(
          () => {
            this.userService.loginUser(formData.email, formData.password).subscribe(
              (data: any) => {
                this.userService.storeToken(data.token);
                this.router.navigate(['']);
              },
              (error) => {
                alert(error.error);
              }
            );
          },
          (error) => {
            alert('Error creating profile: ' + error);
          }
        );
      });
    } else {
      alert('Invalid registration form!');
    }
  }
  
}
