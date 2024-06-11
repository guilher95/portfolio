import { Component, AfterViewInit, OnDestroy, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import * as AOS from 'aos';
import { annotate } from 'rough-notation'; // Importa Rough Notation

declare var VANTA: any;

@Component({
  selector: 'app-frontend',
  templateUrl: './frontend.component.html',
  styleUrls: ['./frontend.component.sass']
})
export class FrontendComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('timelineItem') timelineItems!: QueryList<ElementRef>;
  @ViewChild('frontendTitle') frontendTitle!: ElementRef; // Usa ViewChild para acceder al título
  @ViewChild('logosSlide') logosSlide!: ElementRef;
  vantaEffect: any;
  annotation: any; 

  constructor(private elRef: ElementRef) {}
  
  ngAfterViewInit() {
    AOS.init({
      duration: 1200,
      once: false,
      mirror: false
    });

    this.makeInfinite();

    this.vantaEffect = VANTA.BIRDS({
      el: '#vanta-bg',
      backgroundColor: 0x0f0f0f,
      backgroundAlpha: 0,
      color1: 0xff9900,
      color2: 0x0022ff,
      birdSize: 1.0,
      speedLimit: 4.00,
      separation: 20.00,
      alignment: 20.00,
      cohesion: 20.00
    });

     // Configurar Rough Notation, pero no mostrar todavía
     const titleElement = this.frontendTitle.nativeElement;
     this.annotation = annotate(titleElement, {
       type: 'box',
       color: '#ff3333',
       animationDuration:1000,
       strokeWidth: 2,
       padding: [0, 2],
       multiline: true,
       iterations: 2
     });
 
     // Escuchar el evento de scroll
     window.addEventListener('scroll', this.checkScroll, true);
  }

  ngOnDestroy() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  }

  checkScroll = () => {
    const titleElement = this.frontendTitle.nativeElement;
    const rect = titleElement.getBoundingClientRect();
    const isVisible = (rect.top >= 0 && rect.bottom <= window.innerHeight);

    if (isVisible) {
      this.annotation.show();
      window.removeEventListener('scroll', this.checkScroll, true); // Remover el evento después de mostrar la anotación
    }
  }

  
  makeInfinite() {
    const slide = this.logosSlide.nativeElement;
    const slider = this.elRef.nativeElement.querySelector('.logo-slider');
    const slideWidth = slide.offsetWidth;
    const cloneSlide = slide.cloneNode(true);

    // Añadir clon al slider
    slider.appendChild(cloneSlide);

    let animationDuration = 50; // Duración de la animación en segundos
    const totalWidth = slideWidth * 2;
    animationDuration = totalWidth / slideWidth * animationDuration;

    // Actualiza la duración de la animación en CSS
    slide.style.animationDuration = `${animationDuration}s`;
    cloneSlide.style.animationDuration = `${animationDuration}s`;
  }
}
