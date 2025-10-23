window.addEventListener('DOMContentLoaded', () => {
  let noise;
  class Mesh extends createjs.Shape {

    constructor() {
      super();
      this._time = 0;
      this._flame = 0;
      noise = new Processing().noise;
      this._maxLines = 10;
      this._maxVertex = 10;
      this._stageW = window.innerWidth;
      this._stageH = innerHeight;
      this.on('tick', this.handleTick, this);
    }

    handleTick(event) {
      this._time += 0.8;
      this.graphics.clear();
      this.drawMesh();
    }

    drawMesh() {
      this._flame++;
      const vertexArr = [];
      const distance = 20;
      for (let i = 0; i <= this._stageH * this._stageW / distance; i++) {
        const noiseNum = noise(i * 0.2, this._time + 0.08);
        vertexArr[i] = Math.abs(noiseNum);
      }
      let p0x = 1;
      let p0y = 1;
      let i = 0;

      for (let y = 0; y <= this._stageH / distance; y++) {
        for (let x = 0; x <= this._stageW / distance; x++) {
          let p0c = `rgba(0,0,255,${vertexArr[i] - 0.2})`;
          if (this._flame > i * 0.008) {
            this.graphics
              .beginFill(p0c)
              .drawRect(p0x * x * distance - 1, p0y * y * distance - 1, 2, 2)
              .endFill();
            this.graphics
              .setStrokeStyle(0.5)
              .beginStroke(p0c)
              .moveTo(p0x * x * distance, p0y * y * distance)
              .lineTo(p0x * x * distance + distance, p0y * y * distance)
              .endStroke();
          }
          i++;
        }
      }
    }
  }


  class WaveShape extends createjs.Shape {
    constructor(maxLines = 10, maxVertex = 5, type = 'random') {
      super();
      this._time = 0;
      noise = new Processing().noise;
      this._maxLines = maxLines;
      this._maxVertex = maxVertex;
      this._type = type;
      this._stageW = window.innerWidth * 1.2;
      this._stageH = 600;

      this.on('tick', this.handleTick, this);
      if (type === 'random') {
        const _r = Math.random();
        if (_r > 0.86) {
          this.setType('flat');
        } else if (_r > 0.74) {
          this.setType('nois');
        } else if (_r > 0.60) {
          this.setType('stop');
        } else if (_r > 0.50) {
          this.setType('point');
        }
      } else {
        this.setType(type);
      }
    }

    setType(type) {
      this._type = type;
      if (type === 'noise') {
        this._maxVertex += 10;
      }
      if (type === 'stop') {
        this._maxVertex = 3;
        this._maxLines = 5;
      }
      if (type === 'point') {
        this._maxVertex = 200;
        this._maxLines = 10;
      }
    }

    handleTick(event) {
      this._time += 0.0005;
      this.graphics.clear();
      if (event.timeStamp % (Math.random() * 100000) > Math.random() * 1000 - 300) {
        let _max = this._maxLines * Math.random() + 60;
        if (this._type === 'stop') {
          _max = this._maxLines;
        }
        let _h = 3;
        if (this._type === 'nois') {
          _h = 8;
        }
        if (this._type === 'point') {
          _h = 6;
        }
        for (let i = 0; i < _max; i++) {
          this.drawWave(this._maxVertex, i * 0.1, _h);
        }
      }
    }

    drawWave(vertexNum, timeOffset, _h = 3) {
      const vertexArr = [];
      for (let i = 0; i <= vertexNum; i++) {
        const noiseNum = noise(i * 0.2, this._time + timeOffset) - 0.5;
        vertexArr[i] = (noiseNum * this._stageH * _h);
      }
      const points = [];
      points.push({ x: -200, y: this._stageH });
      let _r = 0.99;
      if (this._type === 'nois') {
        _r = 0.9;
      }
      for (let i = 0; i <= vertexNum + 1; i++) {
        let _x = (this._stageW * (i / vertexNum));
        let _y = vertexArr[i] + this._stageH;
        if (this._type !== 'point') {
          let _s = Math.random();
          if (_s > _r) {
            _x = _s * this._stageW;
          }
        }
        points.push({ x: _x, y: _y });
      }
      points.push({ x: this._stageW + 200, y: vertexArr[vertexArr.length] + this._stageH });
      this.graphics.endStroke();
      for (let i = 0; i < points.length; i++) {
        const p0x = points[i - 0].x;
        const p0y = points[i - 0].y;
        let p0x_ = p0x;
        let p0y_ = p0y;
        let p0z_ = 1;
        let p0c_ = "rgba(0,0,255,0.3)";
        if (Math.random() > 0.9) {
          p0y_ = p0y + Math.random() * 80 - 40;
          p0c_ = `rgba(0,0,255,${Math.random()})`;
        }
        if (this._type === 'stop') {
          p0c_ = `rgba(0,0,${Math.random() * 255},${Math.random()})`;
        }
        if (this._type === 'point') {
          p0c_ = "rgba(0,0,255,0.6)";
        }
        if (i > 0) {
          const p1x = points[i - 1].x;
          const p1y = points[i - 1].y;
          if (this._type === 'flat') {
            this.graphics
              .setStrokeStyle(0.5)
              .beginStroke(`rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},${Math.random()})`)
              .moveTo(p1x, p0y)
              .lineTo(p0x, p0y)
              .endStroke();
          } else if (this._type !== 'point') {
            this.graphics
              .setStrokeStyle(0.5)
              .beginStroke(p0c_)
              .moveTo(p1x, p1y)
              .lineTo(p0x, p0y)
              .endStroke();
          }
        }
        if (this._type !== 'flat') {
          this.graphics
            .beginFill(p0c_)
            .drawRect(p0x_, p0y_, p0z_, p0z_)
            .endFill();
        }
      }
    }
  }


  class opening {
    constructor() {
      this.stageCalcInside = new createjs.Stage('canvasWave');
      const mesh = new Mesh();
      this.stageCalcInside.addChild(mesh);
      createjs.Ticker.timingMode = createjs.Ticker.RAF;
      createjs.Ticker.on('tick', this.handleTick, this);
      this.stageCalcInside.canvas.width = innerWidth;
      this.stageCalcInside.canvas.height = 600;
    }
    handleTick() {
      this.stageCalcInside.update();
    }
  }

  class Main {
    constructor(first = false) {
      this.stageCalcInside = new createjs.Stage('canvasWave');
      let maxVertex = 14 * Math.random();
      let type = 'random';
      if (first) {
        type = 'flat';
      }
      const waveShape = new WaveShape(20 * Math.random() + 1, maxVertex, type);
      this.stageCalcInside.addChild(waveShape);
      createjs.Ticker.timingMode = createjs.Ticker.RAF;
      createjs.Ticker.on('tick', this.handleTick, this);
      this.stageCalcInside.canvas.width = innerWidth;
      this.stageCalcInside.canvas.height = innerHeight;
    }
    handleTick() {
      this.stageCalcInside.update();
    }
  }

  if (window.matchMedia('(min-width: 768px)').matches) {
    // let openingAnimation = new opening();
    let rootAnimation;
    let count = 0;
    setTimeout(() => {
      // delete openingAnimation
      setTimeout(() => {
        rootAnimation = new Main(true);
        setTimeout(() => {
          setInterval(() => {
            count++
            if (count == 14) {
              delete rootAnimation;
              new Main('point');
            }
            if (count < 14) {
              if (Math.random() > 0.5) {
                delete rootAnimation;
                setTimeout(() => {
                  rootAnimation = new Main();
                }, 80);
              }
            }
          }, 2000);
        }, 2000);
      }, 800);
    }, 300);
  }

  axios.get("https://seh2nzv724rdglm23pba7e4tny0kdgle.lambda-url.ap-northeast-3.on.aws/").then(response => {
    const contributionCalendar = response.data.data.user.contributionsCollection.contributionCalendar.weeks;
    const lastFiveWeeks = contributionCalendar.slice(contributionCalendar.length - 6, contributionCalendar.length - 1);
    const lastFiveWeeksTotal = lastFiveWeeks.reduce((acc, cur) => acc + cur.contributionDays.reduce((acc, cur) => acc + cur.contributionCount, 0), 0);
    document.getElementById("contributionCount").innerHTML = lastFiveWeeksTotal;
    document.getElementById("contributionRate").innerHTML = Math.round((lastFiveWeeksTotal / 400) * 100) + "%";
    for (let i = 0; i < lastFiveWeeksTotal; i++) {
      document.getElementById("contributionBox").innerHTML += '<div class="contribution"></div>';
    }
  })
});
