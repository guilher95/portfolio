import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent {
  isNight = false;
  showInvitation = true;  // Mostrar la invitación al inicio
  showSnakeGame = false;  // No mostrar el juego de Snake al inicio
  showPresentation = true;

  sunStyle = {
    left: '5%',
    transform: 'translateX(0%)',
    background: '#ff0',
    boxShadow: '0 0 50px #ff0'
  };

  constructor(private router: Router) {}

  startSnakeGame() {
    this.router.navigate(['/snake-game']);
  }

  declineInvitation() {
    this.showInvitation = false;
    // Aquí podrías redirigir al usuario o simplemente no hacer nada
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPosition = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollPercentage = scrollPosition / maxScroll;

    // Move the sun horizontally
    const startPosition = 5; // Valor inicial del sol en porcentaje
    const endPosition = 95; // Valor final del sol en porcentaje
    const leftValue = startPosition + (endPosition - startPosition) * scrollPercentage;
    this.sunStyle.left = `${leftValue}%`;
    this.sunStyle.transform = `translateX(-${leftValue}%)`;

    // Change sun to moon smoothly
    const startColor = [255, 255, 0]; // Amarillo
    const endColor = [255, 255, 255]; // Blanco
    const currentColor = startColor.map((start, index) => {
      const end = endColor[index];
      return Math.round(start + (end - start) * scrollPercentage);
    });

    this.sunStyle.background = `rgb(${currentColor.join(',')})`;
    this.sunStyle.boxShadow = `0 0 50px rgb(${currentColor.join(',')})`;

    // Transition to night
    this.isNight = scrollPercentage > 0.5;

    // Condición para ocultar la presentación después de cierto scroll
    // if (scrollPercentage > 0.1) {
    //   this.showPresentation = false;
    // } else {
    //   this.showPresentation = true;
    // }
  }
}
