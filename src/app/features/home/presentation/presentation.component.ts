import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as AOS from 'aos';
@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.sass']
})
export class PresentationComponent implements AfterViewInit {
  @ViewChild('presentation', { static: true }) presentationElement!: ElementRef;
  @ViewChild('profilePhoto', { static: true }) profilePhotoElement!: ElementRef;
  @ViewChild('textContent', { static: true }) textContentElement!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    AOS.init({
      duration: 1200,
      once: false,
      mirror: true
    });
  }
}
