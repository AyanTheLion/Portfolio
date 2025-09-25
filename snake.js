    (() => {
      const canvas = document.getElementById('game');
      const ctx = canvas.getContext('2d');
      const startBtn = document.getElementById('startBtn');
      const pauseBtn = document.getElementById('pauseBtn');
      const resetBtn = document.getElementById('resetBtn');
      const gridSelect = document.getElementById('gridSelect');
      const skinSelect = document.getElementById('skinSelect');
      const scoreEl = document.getElementById('score');
      const highEl = document.getElementById('high');
      const levelEl = document.getElementById('level');
      const statusEl = document.getElementById('status');
      const saveBtn = document.getElementById('saveBtn');
      const clearBtn = document.getElementById('clearBtn');
      const soundBtn = document.getElementById('soundBtn');
      const soundStatus = document.getElementById('soundStatus');
      const menuOverlay = document.getElementById('menuOverlay');
      const playBtn = document.getElementById('playBtn');
      const gameContainer = document.getElementById('gameContainer');

      let grid, cols, rows, snake, dir, nextDir, apple, score, high, running, paused, tickRate, timer, level, skin, soundOn;

      function initState(){
        grid = parseInt(gridSelect.value,10);
        cols = Math.floor(canvas.width / grid);
        rows = Math.floor(canvas.height / grid);
        snake = [{x:Math.floor(cols/2), y:Math.floor(rows/2)}];
        dir = {x:1,y:0}; nextDir = null;
        apple = null; placeApple();
        score = 0;
        high = Number(localStorage.getItem('snakeHigh') || 0);
        highEl.textContent = high;
        running = false; paused = false;
        tickRate = 120;
        timer = null;
        level = 1;
        skin = skinSelect.value;
        soundOn = true;
        scoreEl.textContent = score; levelEl.textContent = level;
        statusEl.textContent = 'Ready';
      }

      function playSound(freq,duration=100){
        if(!soundOn) return;
        const ctxAudio = new (window.AudioContext||window.webkitAudioContext)();
        const osc = ctxAudio.createOscillator();
        const gain = ctxAudio.createGain();
        osc.frequency.value = freq;
        osc.connect(gain); gain.connect(ctxAudio.destination);
        osc.start();
        setTimeout(()=>{osc.stop(); ctxAudio.close();}, duration);
      }

      function resetGame(){
        initState();
        render();
        clearInterval(timer);
      }

      function placeApple(){
        while(true){
          const x = Math.floor(Math.random()*cols);
          const y = Math.floor(Math.random()*rows);
          if(!snake.some(s => s.x===x && s.y===y)){
            apple = {x,y}; return;
          }
        }
      }

      function step(){
        if(!running || paused) return;
        if(nextDir && !(nextDir.x===-dir.x && nextDir.y===-dir.y)) dir = nextDir;
        nextDir = null;

        const head = {x: snake[0].x+dir.x, y: snake[0].y+dir.y};
        head.x = (head.x+cols)%cols; head.y=(head.y+rows)%rows;

        if(snake.some(p=>p.x===head.x && p.y===head.y)){
          running=false; statusEl.textContent='Game Over'; clearInterval(timer);
          if(score>high){high=score;highEl.textContent=high;}
          playSound(200,300);
          return;
        }

        snake.unshift(head);
        if(apple && head.x===apple.x && head.y===apple.y){
          score++; scoreEl.textContent=score; placeApple();
          if(score%5===0){ level++; levelEl.textContent=level; tickRate=Math.max(40,tickRate-10);}
          clearInterval(timer); timer=setInterval(step,tickRate);
          playSound(600,150);
        } else { snake.pop(); }
        render();
      }

      function render(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.save(); ctx.globalAlpha=0.06;
        for(let x=0;x<=cols;x++){ ctx.fillRect(x*grid,0,1,canvas.height); }
        for(let y=0;y<=rows;y++){ ctx.fillRect(0,y*grid,canvas.width,1); }
        ctx.restore();

        if(apple){ drawCell(apple.x,apple.y,'apple'); }
        for(let i=snake.length-1;i>=0;i--){ drawCell(snake[i].x,snake[i].y,'snake',i); }
      }

      function drawCell(x,y,type,index=0){
        if(type==='apple'){
          if(skin==='emoji'){ ctx.font=`${grid}px serif`; ctx.fillText('🍎',x*grid,y*grid+grid); return; }
          ctx.fillStyle='#ff6b6b'; ctx.beginPath(); ctx.arc(x*grid+grid/2,y*grid+grid/2,grid/2.4,0,Math.PI*2); ctx.fill();
        }
        if(type==='snake'){
          if(skin==='classic'){ ctx.fillStyle='limegreen'; }
          if(skin==='neon'){ ctx.fillStyle=`hsl(${(index*15)%360} 100% 50%)`; }
          if(skin==='rainbow'){ ctx.fillStyle=`hsl(${(Date.now()/20+index*20)%360} 80% 50%)`; }
          if(skin==='emoji'){ ctx.font=`${grid}px serif`; ctx.fillText('🟩',x*grid,y*grid+grid); return; }
          ctx.fillRect(x*grid+1,y*grid+1,grid-2,grid-2);
        }
      }

      // Controls
      window.addEventListener('keydown', e => {
        if(['ArrowUp','w','W'].includes(e.key)) nextDir={x:0,y:-1};
        if(['ArrowDown','s','S'].includes(e.key)) nextDir={x:0,y:1};
        if(['ArrowLeft','a','A'].includes(e.key)) nextDir={x:-1,y:0};
        if(['ArrowRight','d','D'].includes(e.key)) nextDir={x:1,y:0};
        if(e.key===' '){togglePause();}
      });

      startBtn.addEventListener('click',()=>{ if(running) return; running=true; paused=false; statusEl.textContent='Playing'; timer=setInterval(step,tickRate);});
      pauseBtn.addEventListener('click',togglePause);
      resetBtn.addEventListener('click',resetGame);
      gridSelect.addEventListener('change',resetGame);
      skinSelect.addEventListener('change',()=>{skin=skinSelect.value; render();});
      soundBtn.addEventListener('click',()=>{soundOn=!soundOn;soundBtn.textContent=soundOn?'🔊 Sound On':'🔇 Sound Off';});

      saveBtn.addEventListener('click',()=>{localStorage.setItem('snakeHigh',String(high));statusEl.textContent='High score saved';});
      clearBtn.addEventListener('click',()=>{localStorage.removeItem('snakeHigh');high=0;highEl.textContent=0;statusEl.textContent='High score cleared';});

      function togglePause(){ if(!running) return; paused=!paused; statusEl.textContent=paused?'Paused':'Playing'; }

      // Touch
      let touchStart=null;
      canvas.addEventListener('touchstart',e=>{const t=e.changedTouches[0];touchStart={x:t.clientX,y:t.clientY};},{passive:true});
      canvas.addEventListener('touchend',e=>{const t=e.changedTouches[0];if(!touchStart) return;const dx=t.clientX-touchStart.x;const dy=t.clientY-touchStart.y;if(Math.abs(dx)>Math.abs(dy)) nextDir=dx>0?{x:1,y:0}:{x:-1,y:0}; else nextDir=dy>0?{x:0,y:1}:{x:0,y:-1};},{passive:true});

      function fitCanvas(){ const maxW=Math.min(window.innerWidth*0.6,760); const scale=Math.min(maxW/canvas.width,1.35); canvas.style.width=Math.round(canvas.width*scale)+'px'; canvas.style.height=Math.round(canvas.height*scale)+'px'; }
      window.addEventListener('resize',fitCanvas);

      function idleAnim(){ if(!running){ render(); if(apple) drawCell(apple.x,apple.y,'apple'); } requestAnimationFrame(idleAnim);}

      playBtn.addEventListener('click',()=>{
        menuOverlay.style.display='none';
        gameContainer.style.display='block';
        initState();
        render();
        fitCanvas();
        requestAnimationFrame(idleAnim);
      });
    })();