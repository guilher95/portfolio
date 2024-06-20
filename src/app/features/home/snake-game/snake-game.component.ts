import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface FoodItem {
  x: number;
  y: number;
  imgSrc: string; // La ruta al logo del lenguaje de programación
}

@Component({
  selector: 'app-snake-game',
  templateUrl: './snake-game.component.html',
  styleUrls: ['./snake-game.component.sass']
})
export class SnakeGameComponent implements OnInit, OnDestroy {
  private cvUrl = 'https://raw.githubusercontent.com/guilher95/cv/main/MyResume.pdf';
  dx = 10;  // Cantidad de movimiento en x
  dy = 0;   // Cantidad de movimiento en y
  snake = [{ x: 200, y: 200 }]; // La serpiente comienza en el centro
  context!: CanvasRenderingContext2D;
  gameInterval?: number;  // Variable para gestionar el intervalo de juego
  isDownloadButtonVisible: boolean = false;
  countdownTimer?: number;  // Para controlar el temporizador de la cuenta atrás
  remainingTime: number = 120; // Tiempo restante en segundos
  displayTime: string = '02:00'; // Tiempo formateado para mostrar
  touchStartX: number = 0;
  touchStartY: number = 0;
  keySequence: string = ''
  hasPausedForDownload: boolean = false; // Nueva variable para rastrear si el juego ha sido pausado para la descarga

  // Define food usando la interfaz FoodItem
  food: FoodItem = {
    x: 50,
    y: 50,
    imgSrc: 'assets/snake/csharp.png' // Imagen inicial
  };
  imageCache: { [key: string]: HTMLImageElement } = {};  // Cache para las imágenes pre-cargadas
  constructor(private router: Router, private http: HttpClient) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.adjustCanvasSize();
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const deltaX = touchEndX - this.touchStartX;
    const deltaY = touchEndY - this.touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // movimiento horizontal
      if (deltaX > 0 && this.dx === 0) {
        this.dx = 10;
        this.dy = 0;
      } else if (deltaX < 0 && this.dx === 0) {
        this.dx = -10;
        this.dy = 0;
      }
    } else {
      // movimiento vertical
      if (deltaY > 0 && this.dy === 0) {
        this.dy = 10;
        this.dx = 0;
      } else if (deltaY < 0 && this.dy === 0) {
        this.dy = -10;
        this.dx = 0;
      }
    }

    event.preventDefault();  // Evitar el desplazamiento de la pantalla
  }

  ngOnInit(): void {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.context = canvas.getContext('2d')!;

    this.adjustCanvasSize();
    this.loadImages();
    this.drawInitial();  // Dibuja el estado inicial del juego
  }

  ngOnDestroy(): void {
    this.stopGame();  // Asegura que el intervalo se detiene cuando el componente se destruye
    if (this.countdownTimer) {
      clearTimeout(this.countdownTimer);  // Limpia el temporizador si la vista se destruye
    }
  }

  adjustCanvasSize() {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    if (!canvas) return;

    const aspectRatio = 1; // Square canvas
    let newWidth = Math.min(window.innerWidth * 0.8, 800); // Use 80% of window width, up to 800px
    let newHeight = newWidth * aspectRatio; // Keep the canvas square

    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;
    canvas.width = newWidth;  // Adjust internal drawing dimensions
    canvas.height = newHeight;

    this.drawInitial(); // Redraw to adjust to new dimensions
  }

  startGame() {
    if (!this.gameInterval) {
      this.gameInterval = window.setInterval(() => {
        this.moveSnake();
        this.checkCollision();
        this.checkFood();
        this.draw();
      }, 100);

      if (!this.countdownTimer && !this.hasPausedForDownload) { // Solo inicia el temporizador si no se ha pausado para la descarga
        this.countdownTimer = window.setInterval(() => {
          if (this.remainingTime > 0) {
            this.remainingTime--;
            this.formatDisplayTime();
          } else if (this.remainingTime === 0) {
            this.enableDownloadButton(); // Hace visible el botón de descarga
            this.stopGame(); // Detiene el juego
            this.hasPausedForDownload = true; // Marca que el juego ha sido pausado para la descarga
          }
        }, 1000);
      }
    }
  }

  stopGame() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = undefined;
    }
    // Pausa el temporizador de la cuenta atrás sin reiniciar el tiempo
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = undefined;  // Solo detiene el temporizador, no reinicia el tiempo
    }
  }

  DownloadCV() {
    const urlWithTimestamp = `${this.cvUrl}?t=${new Date().getTime()}`;
    this.http.get(urlWithTimestamp, { responseType: 'blob' }).subscribe((data) => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'MyResume.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  enableDownloadButton() {
    if (this.remainingTime <= 0) {
      this.isDownloadButtonVisible = true;  // Hace visible el botón
    }
  }

  WelcomeHome() {
    this.router.navigate(['']);
  }

  formatDisplayTime() {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    this.displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  moveSnake() {
    // Asegura que solo se actualice la posición si se ha iniciado el movimiento
    if (this.dx !== 0 || this.dy !== 0) {
      let newHead = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
      this.snake.unshift(newHead); // Añade nueva cabeza
      if (!this.checkFood()) {
        this.snake.pop(); // Remueve el final de la serpiente si no come
      }
    }
  }

  checkCollision() {
    // Comprueba colisión con los bordes
    const head = this.snake[0];
    if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400) {
      this.resetGame(); // Llama a un método para reiniciar el juego
    }

    // Comprueba colisión consigo misma
    for (let i = 1; i < this.snake.length; i++) {
      if (this.snake[i].x === head.x && this.snake[i].y === head.y) {
        this.resetGame(); // Llama a un método para reiniciar el juego
      }
    }
  }

  resetGame() {
    // Reinicia la posición inicial de la serpiente
    this.snake = [{ x: 200, y: 200 }];
    this.dx = 10;
    this.dy = 0;

    // Detiene y limpia el intervalo de juego y reinicia el temporizador
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = undefined;
    }

    // Reinicia el contador de la cuenta atrás
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = undefined;
    }
    this.remainingTime = 120;  // Reinicia el tiempo a 2 minutos
    this.formatDisplayTime();  // Actualiza la visualización del tiempo

    // Deshabilita el botón de descarga hasta que el juego se reinicie
    this.isDownloadButtonVisible = false;

    this.hasPausedForDownload = false; // Reinicia la bandera de pausa para descarga
  }

  checkFood() {
    // Obtiene la posición de la cabeza de la serpiente
    const head = this.snake[0];

    // Comprueba si la cabeza de la serpiente está cerca de la comida
    if (Math.abs(head.x - this.food.x) < 16 && Math.abs(head.y - this.food.y) < 16) {
      this.randomizeFood(); // Cambia la posición de la comida
      return true; // La serpiente "come" la comida
    }
    return false;
  }

  randomizeFood() {
    const logos = [
      'assets/snake/csharp.png',
      'assets/snake/python.png',
      'assets/snake/js.png',
      'assets/snake/angular.png']; // Ejemplos de logos
    const randomIndex = Math.floor(Math.random() * logos.length);

    this.food.x = Math.floor(Math.random() * 38) * 10; // Asegura que la comida no se coloque fuera del canvas
    this.food.y = Math.floor(Math.random() * 38) * 10;
    this.food.imgSrc = logos[randomIndex]; // Asigna un nuevo logo aleatoriamente
  }

  resetSnake() {
    this.snake = [{ x: 200, y: 200 }];
    this.dx = 10;
    this.dy = 0;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key.toLowerCase(); // Convert to lowercase for case insensitive comparison
    const sequence = 'hello world';

    // Append the key to the sequence tracker
    this.keySequence += key;

    // Check if the sequence matches
    if (this.keySequence.includes(sequence)) {
      this.DownloadCV(); // Llama al método DownloadCV cuando la secuencia es detectada
      this.keySequence = ''; // Resetea la secuencia después de la detección
    } else if (!sequence.startsWith(this.keySequence)) {
      // Reset if the sequence does not match
      this.keySequence = '';
    }

    if (event.key === 'ArrowUp' && this.dy === 0) {
      this.dx = 0; this.dy = -10;
    } else if (event.key === 'ArrowDown' && this.dy === 0) {
      this.dx = 0; this.dy = 10;
    } else if (event.key === 'ArrowLeft' && this.dx === 0) {
      this.dx = -10; this.dy = 0;
    } else if (event.key === 'ArrowRight' && this.dx === 0) {
      this.dx = 10; this.dy = 0;
    }
  }

  // Método para pre-cargar todas las imágenes usadas en el juego
  loadImages(): void {
    const imagesToLoad = [
      'assets/snake/csharp.png',
      'assets/snake/python.png',
      'assets/snake/js.png',
      'assets/snake/angular.png'
    ];
    imagesToLoad.forEach(src => {
      const img = new Image();
      img.onload = () => {
        this.imageCache[src] = img;
        this.draw();  // Redibuja el juego una vez que la imagen esté cargada
      };
      img.src = src;
    });
  }

  draw(): void {
    const scaleFactor = this.context.canvas.width / 400; // Asumiendo que 400 era el tamaño original diseñado
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.context.fillStyle = '#add8e6';
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    // Escalar y dibujar cada parte de la serpiente
    this.snake.forEach(part => {
      const x = part.x * scaleFactor;
      const y = part.y * scaleFactor;
      const size = 16 * scaleFactor; // Asumiendo que 16 era el tamaño original de cada parte de la serpiente
      if (this.imageCache['assets/snake/python.png']) {
        this.context.drawImage(this.imageCache['assets/snake/python.png'], x, y, size, size);
      } else {
        this.context.fillStyle = 'green';
        this.context.fillRect(x, y, size, size);
      }
    });

    // Dibujar la comida
    const foodImg = this.imageCache[this.food.imgSrc];
    if (foodImg) {
      const foodSize = 15 * scaleFactor; // Asumiendo que 15 era el tamaño original de la comida
      this.context.drawImage(foodImg, this.food.x * scaleFactor, this.food.y * scaleFactor, foodSize, foodSize);
    }
  }

  drawInitial() {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.context.fillStyle = '#f0f0f0';
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
  }
}
