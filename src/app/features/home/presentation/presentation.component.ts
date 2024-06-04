import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as AOS from 'aos';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.sass']
})
export class PresentationComponent implements AfterViewInit {
  @ViewChild('presentation', { static: true }) presentationElement!: ElementRef;
  @ViewChild('profilePhoto', { static: true }) profilePhotoElement!: ElementRef;
  @ViewChild('textContent', { static: true }) textContentElement!: ElementRef;

  constructor(private scrollService: ScrollService) { }

  goToFrontend(): void {
    this.scrollService.scrollPosition('frontend',2000);
  }

  ngAfterViewInit() {
    AOS.init({
      duration: 1200,
      once: false,
      mirror: true
    });
  }
}
