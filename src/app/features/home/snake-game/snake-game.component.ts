import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

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
  dx = 10;  // Cantidad de movimiento en x
  dy = 0;   // Cantidad de movimiento en y
  snake = [{x: 200, y: 200}]; // La serpiente comienza en el centro
  context!: CanvasRenderingContext2D;
  gameInterval?: number;  // Variable para gestionar el intervalo de juego
  isDownloadButtonVisible: boolean = false;
  countdownTimer?: number;  // Para controlar el temporizador de la cuenta atrás
  remainingTime: number = 120; // Tiempo restante en segundos
  displayTime: string = '02:00'; // Tiempo formateado para mostrar

  // Define food usando la interfaz FoodItem
  food: FoodItem = {
    x: 50,
    y: 50,
    imgSrc: 'assets/snake/csharp.png' // Imagen inicial
  };
  imageCache: {[key: string]: HTMLImageElement} = {};  // Cache para las imágenes pre-cargadas

  constructor(private router: Router) {}

  ngOnInit(): void {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.context = canvas.getContext('2d')!;
    this.loadImages();
    this.drawInitial();  // Dibuja el estado inicial del juego
  }

  ngOnDestroy(): void {
    this.stopGame();  // Asegura que el intervalo se detiene cuando el componente se destruye
    if (this.countdownTimer) {
      clearTimeout(this.countdownTimer);  // Limpia el temporizador si la vista se destruye
      }
    }

    startGame() {
      if (!this.gameInterval) {
        this.gameInterval = window.setInterval(() => {
          this.moveSnake();
          this.checkCollision();
          this.checkFood();
          this.draw();
        }, 100);

        if (!this.countdownTimer) {
          this.countdownTimer = window.setInterval(() => {
            if (this.remainingTime > 0) {
              this.remainingTime--;
              this.formatDisplayTime();
            } else if (this.remainingTime === 0) {
              this.enableDownloadButton(); // Hace visible el botón de descarga
              clearInterval(this.countdownTimer); // Detiene el temporizador pero no el juego
              this.countdownTimer = undefined;
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

  DownloadCV(){
    const filePath = 'assets/GuilhermeNoguiera_CV_EN.pdf';
  fetch(filePath)
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'GuilhermeNoguiera_CV_EN.pdf'; // Puedes especificar el nombre del archivo
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    })
    .catch(e => console.error('Error al descargar el archivo: ', e));

  }
  enableDownloadButton() {
    if (this.remainingTime <= 0) {
      this.isDownloadButtonVisible = true;  // Hace visible el botón
    }
  }
  

  WelcomeHome(){
    this.router.navigate(['']);
  }

  formatDisplayTime() {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    this.displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  moveSnake() {
    let newHead = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
    this.snake.unshift(newHead); // Añade nueva cabeza
    if (!this.checkFood()) {
      this.snake.pop(); // Remueve el final de la serpiente si no come
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
    this.snake = [{x: 200, y: 200}];
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
  
    // Opcional: puede llamar a startGame() aquí si quieres que el juego se reinicie automáticamente
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
    this.snake = [{x: 200, y: 200}];
    this.dx = 10;
    this.dy = 0;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
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
    this.context.clearRect(0, 0, 400, 400);
    this.context.fillStyle = '#add8e6';
    this.context.fillRect(0, 0, 400, 400);

    // Asume que has cargado una imagen específica que quieres usar para toda la serpiente
    const snakeImage = this.imageCache['assets/snake/python.png'];  // Asegúrate de que esta imagen esté cargada en loadImages()

    // Dibuja cada parte de la serpiente
    this.snake.forEach(part => {
        if (snakeImage) {
            this.context.drawImage(snakeImage, part.x, part.y, 16, 16);  // Usa la misma imagen para la cabeza y el cuerpo
        } else {
            // Si no hay imagen, dibuja un bloque
            this.context.fillStyle = 'green';
            this.context.fillRect(part.x, part.y, 10, 10);
        }
    });

    // Dibuja la comida usando la imagen pre-cargada
    const foodImg = this.imageCache[this.food.imgSrc];
    if (foodImg) {
        this.context.drawImage(foodImg, this.food.x, this.food.y, 15, 15);  // Ajusta el tamaño si es necesario
    }
}
  drawInitial() {
    this.context.fillStyle = '#f0f0f0';
    this.context.fillRect(0, 0, 300, 300);
  }
}
