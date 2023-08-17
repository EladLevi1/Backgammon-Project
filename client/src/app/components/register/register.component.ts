import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import User from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  users : User[] = [];

  user : User = new User();

  imagePreview: string | ArrayBuffer | null = null;  // This will hold the URL for the image preview
  isImageSelected: boolean = false;  // Flag to check if an image has been selected
  
  constructor(private userService: UserService, private router: Router) {}
  
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

  
  // onImageSelected(event: any, imageInput : NgModel): void {
  //   const file = event.target.files[0];

  //   if (file && file.type.startsWith('image')) {  // Ensure the selected file is an image
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         if (e.target && typeof e.target.result === 'string') {
  //             this.imagePreview = e.target.result;  // Set the preview URL
  //         }
  //     };
  //       reader.readAsDataURL(file);
        
  //       this.isImageSelected = true;  // Set the flag to true as an image has been selected
  //   } else {
  //       this.imagePreview = null;  // Reset the preview URL
  //       this.isImageSelected = false;  // Reset the flag as no image is selected

  //       imageInput.control.setErrors({ 'file': true });
  //   }
  // }

  // onImageSelected(event: any, imageInput: NgModel): void {
  //   const file = event.target.files[0];
    
  //   if (file && file.type.startsWith('image')) {  // Ensure the selected file is an image
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         const image = new Image();
  //         image.src = e.target?.result as string;
  //         image.onload = () => {
  //           const canvas = document.createElement('canvas');
  //           const maxSize = 500;  // This can be your desired size
  //           let width = image.width;
  //           let height = image.height;
  
  //           if (width > height) {
  //               if (width > maxSize) {
  //                   height *= maxSize / width;
  //                   width = maxSize;
  //               }
  //           } else {
  //               if (height > maxSize) {
  //                   width *= maxSize / height;
  //                   height = maxSize;
  //               }
  //           }
            
  //           canvas.width = width;
  //           canvas.height = height;
  
  //           const ctx = canvas.getContext('2d');
  //           ctx?.drawImage(image, 0, 0, width, height);
  
  //           const dataUrl = canvas.toDataURL('image/jpeg', 0.8);  // This uses JPEG with 80% quality. You can adjust as needed
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

  async onSubmit(registrationForm : NgForm) {
    if (registrationForm.valid) {

      const formData = registrationForm.value;

      const tempUser = new User(
        "1",
        formData.email,
        formData.password,
        formData.nickname,
        // this.imagePreview as string
        "https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
        );
  
      this.userService.postUser(tempUser).subscribe((u) => {
        this.user = u as User;
  
        this.userService.loginUser(formData.email, formData.password).subscribe(
          (data: any) => {
            this.userService.storeToken(data.token);
            this.router.navigate(['']);
          },
          (error) => {
            alert(error.error);
          }
        );
      });
    } else {
      alert('Invalid registration form!')
    }
  }
}
