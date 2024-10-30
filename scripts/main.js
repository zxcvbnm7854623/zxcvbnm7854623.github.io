// 设置画布
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成随机数的函数
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

// 生成随机颜色值的函数
function randomColor() {
  const color = 'rgb(' +
                random(0, 255) + ',' +
                random(0, 255) + ',' +
                random(0, 255) + ')';
  return color;
}

// 定义 Ball 构造器
function Ball(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}

// 定义彩球绘制函数
Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// 定义彩球更新函数
Ball.prototype.update = function() {
  if ((this.x + this.size) >= width || (this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }
  if ((this.y + this.size) >= height || (this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }
  this.x += this.velX;
  this.y += this.velY;
};

// 定义碰撞检测函数
Ball.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    if (this !== balls[j]) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = randomColor();
      }
    }
  }
};

// 定义恶魔圈构造器
function DemonCircle(x, y, size) {
  this.x = x;
  this.y = y;
  this.size = size;
}

// 定义恶魔圈绘制函数
DemonCircle.prototype.draw = function() {
  // 绘制白色光环
  ctx.beginPath();
  ctx.fillStyle = 'white'; // 完全的白色
  ctx.arc(this.x, this.y, this.size + 5, 0, 2 * Math.PI); // 白光环的半径大于恶魔球
  ctx.fill();
  
  // 绘制黑色恶魔球
  ctx.beginPath();
  ctx.fillStyle = 'black'; // 恶魔球的颜色
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// 定义恶魔圈移动函数
DemonCircle.prototype.move = function(x, y) {
  this.x = x;
  this.y = y;
};

// 定义碰撞检测恶魔圈与球的碰撞
DemonCircle.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    const dx = this.x - balls[j].x;
    const dy = this.y - balls[j].y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.size + balls[j].size) {
      balls.splice(j, 1); // 从数组中移除被捕获的弹球
      break; // 确保只移除一个弹球
    }
  }
};

// 定义一个数组，生成并保存所有的球
let balls = [];
while (balls.length < 25) {
  const size = random(10, 20);
  let ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomColor(),
    size
  );
  balls.push(ball);
}

// 创建恶魔圈，设定更小的半径
const demonCircle = new DemonCircle(width / 2, height / 2, 10); // 更小的恶魔球半径

// 定义一个循环来不停地播放
function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }

  demonCircle.draw();
  demonCircle.collisionDetect();

  // 绘制剩余球的数量
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText('还剩几个球: ' + balls.length, 20, 30);

  requestAnimationFrame(loop);
}

// 监听鼠标移动事件来控制恶魔圈
canvas.addEventListener('mousemove', function(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  demonCircle.move(mouseX, mouseY);
});

// 启动循环
loop();
