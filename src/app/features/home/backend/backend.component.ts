import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import * as AOS from 'aos';
import { annotate } from 'rough-notation'; // Importa Rough Notation
import { Chart, registerables } from 'chart.js';

declare var VANTA: any;

@Component({
  selector: 'app-backend',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.sass']
})
export class BackendComponent implements AfterViewInit, OnDestroy {
  @ViewChild('vantaNet', { static: true }) vantaNet!: ElementRef;
  @ViewChild('backendTitle') backendTitle!: ElementRef; 
  @ViewChild('skillsRadarChart', { static: false }) skillsRadarChart!: ElementRef;
  @ViewChild('skillsRadarChart2', { static: false }) skillsRadarChart2!: ElementRef;
  vantaEffect: any;
  annotation: any; 

  constructor() {
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
    AOS.init({
      duration: 1200,
      once: false,
      mirror: true
    });

    this.vantaEffect = VANTA.DOTS({
      el: '#vanta-bgg',
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      backgroundAlpha: 0,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00
    });

    // Configurar Rough Notation, pero no mostrar todavía
    const titleElement = this.backendTitle.nativeElement;
    this.annotation = annotate(titleElement, {
      type: 'box',
      color: '#ff3333',
      animationDuration: 1000,
      strokeWidth: 2,
      padding: [0, 2],
      multiline: true,
      iterations: 2
    });

    // Escuchar el evento de scroll
    window.addEventListener('scroll', this.checkScroll, true);

    // Llamar a renderChart para inicializar el gráfico
    this.renderChart();
    this.renderChart2();
  }

  ngOnDestroy() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
    window.removeEventListener('scroll', this.checkScroll, true); // Limpiar el evento
  }

  checkScroll = () => {
    const titleElement = this.backendTitle.nativeElement;
    const rect = titleElement.getBoundingClientRect();
    const isVisible = (rect.top >= 0 && rect.bottom <= window.innerHeight);

    if (isVisible) {
      this.annotation.show();
      window.removeEventListener('scroll', this.checkScroll, true); // Remover el evento después de mostrar la anotación
    }
  }

  renderChart() {
    const ctx = this.skillsRadarChart.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: [
          'C#', 'Python', 'JavaScript',
          '.NET Core / .NET FWK', 'MVC', 'WebForms / WinForms',
          'API REST', 'Azure Serverless'
        ],
        datasets: [{
          label: 'Nivel de Competencia',
          data: [
            9, 8, 7, // Lenguajes de Programación
            9, 8, 7, // Frameworks y Librerías
            8, 8 // Herramientas y Tecnologías
          ],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(255, 99, 132, 1)', // Fondo de los puntos
          pointBorderColor: '#fff', // Borde de los puntos
          pointHoverBackgroundColor: '#fff', // Fondo de los puntos al pasar el mouse
          pointHoverBorderColor: 'rgba(255, 99, 132, 1)' // Borde de los puntos al pasar el mouse
       
        }]
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            angleLines: {
              color: 'rgba(255, 255, 255, 0.5)' // Líneas de los ángulos más visibles
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.5)' // Líneas de la cuadrícula más visibles
            },
            pointLabels: {
              color: '#fff', // Color de las etiquetas de los puntos
              font: {
                size: 14 // Tamaño de fuente de las etiquetas de los puntos
              }
            },
            ticks: {
              backdropColor: 'rgba(0, 0, 0, 0.5)', // Fondo de los ticks
              color: '#fff', // Color de los ticks
              maxTicksLimit: 5,
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#fff', // Color de las etiquetas de la leyenda
              font: {
                size: 14 // Tamaño de fuente de la leyenda
              }
            }
          }
        }
      }
    });
  }

  renderChart2() {
    const ctx = this.skillsRadarChart2.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: [
          'SQL', 'NoSQL', 'EF / ADO',
          'Reporting Services', 'SOLID', 'DDD', 'TDD', 'Agile'
        ],
        datasets: [{
          label: 'Nivel de Competencia',
          data: [
            9, 6, 9, // Bases de Datos
            6, 8, 7, 6, 9 // Principios y Metodologías
          ],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)', // Fondo de los puntos
          pointBorderColor: '#fff', // Borde de los puntos
          pointHoverBackgroundColor: '#fff', // Fondo de los puntos al pasar el mouse
          pointHoverBorderColor: 'rgba(54, 162, 235, 1)' // Borde de los puntos al pasar el mouse
        }]
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            angleLines: {
              color: 'rgba(255, 255, 255, 0.5)' // Líneas de los ángulos más visibles
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.5)' // Líneas de la cuadrícula más visibles
            },
            pointLabels: {
              color: '#fff', // Color de las etiquetas de los puntos
              font: {
                size: 14 // Tamaño de fuente de las etiquetas de los puntos
              }
            },
            ticks: {
              backdropColor: 'rgba(0, 0, 0, 0.5)', // Fondo de los ticks
              color: '#fff', // Color de los ticks
              maxTicksLimit: 5,
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#fff', // Color de las etiquetas de la leyenda
              font: {
                size: 14 // Tamaño de fuente de la leyenda
              }
            }
          }
        }
      }
    });
  }
}
