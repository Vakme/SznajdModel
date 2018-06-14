<template>
  <div id="app">
    <navbar></navbar>
    <div class="container-fluid">
      <div class="row">
        <!--<sidebar></sidebar>-->
        <main role="main" class="col-md-12 ml-sm-auto col-lg-12 pt-3 px-4">
          <controls></controls>
          <div class="row">
            <div class="col-12 text-center">
              <canvas-draw
                :row="rowArr"
                :clearCanvas="clearCanvas"
                :draw="draw"
                :chosenIndex="index"
                :canvasHeight="cellularWidth"></canvas-draw>
              <canvas-draw
                :row="rowArr"
                :clearCanvas="clearCanvas"
                :draw="draw"
                :chosenIndex="index"
                :canvasHeight="canvasHeight"></canvas-draw>
            </div>
            <div class="chart col-md-12">
              <line-chart :chart-data="chartData"
                          :hammingDist="hammingDist"
                          :options="chartOptions"
                          :height="200"
                          :width="1000"></line-chart>
            </div>
          </div>
        </main>
      </div>
    </div>
    <vue-snotify></vue-snotify>
  </div>
</template>

<script>
  import Navbar from './components/Navbar'
  import Controls from './components/Controls'
  import Sidebar from './components/Sidebar'
  import Canvas from './components/Canvas'
  import Chart from './components/DistChart'
  import EventBus from './EventBus';

export default {
  name: 'app',
  components: {
      'navbar': Navbar,
      'controls': Controls,
      'sidebar': Sidebar,
      'canvas-draw': Canvas,
      'line-chart': Chart
  },
  data () {
    return {
      chartOptions: {
        responsive: false,
        maintainAspectRatio: true,
        animation: {
          duration: 50
          },
        xAxes: [{
          ticks: {
            max: 20,
            min: 10,
          }
        }]
        },
      chartData: null,
      draw: false,
      clearCanvas: true,
      canvasWidth: 990,
      canvasHeight: 270,
      cellularWidth: 10,
      maxAutomata: 0,
      baseAutomata: [],
      nameNumber: 90,
      rules: '',
      timeout: null,
      canPlay: false,
      timer: 500,
      startRow: null,
      configStart: null,
      rowArr: '',
      hammingDist: [],
      index: null,
      differ: false
    }
  },
  mounted () {
    EventBus.$on('PLAY', this.played);
    EventBus.$on('PAUSE', this.paused);
    EventBus.$on('RESET', this.cleared);
    EventBus.$on('SPEED', this.speedChanged);
    EventBus.$on('TYPE', this.typeChanged);
    EventBus.$on('NEW_CONFIG', this.saved);

    this.rules = this.dec2bin(this.nameNumber).padStart(8, '0').split("").reverse().map(value => parseInt(value));
    this.maxAutomata = this.canvasWidth/this.cellularWidth;
  },
  methods: {
    played() {
      console.log('PLAYED');
      if(!this.canPlay) {
        this.canPlay = true;
        this.baseDraw();
      }
    },
    paused() {
      console.log('PAUSED');
      if(this.canPlay)
        this.canPlay = false;
    },
    speedChanged(speed) {
      console.log('SPEED');
      this.timer = 1000 - speed;
    },
    typeChanged(differ) {
      this.differ = differ;
      this.cleared();
    },
    cleared() {
      console.log('RESET');
      this.startRow = null;
      this.canPlay = false;
      this.clearCanvas = true;
      this.hammingDist = [];
      this.chartData = {
        labels: ''.padEnd(50, ' ').split(''),
        datasets: [{
          label: 'Procent granatowej opinii',
          data: this.hammingDist,
        }],
      };
      this.baseDraw();
    },
    saved(config) {
        this.rules = this
          .dec2bin(config.nameNumber)
          .padStart(8, '0')
          .split("")
          .reverse()
          .map(value => parseInt(value));
        if(config.startNum) {
          this.configStart = config.startNum.padStart((this.canvasWidth/this.cellularWidth)/2, '0').padEnd((this.canvasWidth/this.cellularWidth), '0');
        }
        else {
          this.configStart = null;
        }

          this.cleared();
      },
      baseDraw() {
        if(this.clearCanvas) {
            let row = this.fillArr();
            setTimeout(this.drawRow, this.timer, row);
        }
        else {
          setTimeout(this.drawRow, this.timer);
        }
      },

    countSize(row) {
      let hDist = 0;
      for(let i = 0; i < row.length; i++) {
        if(row[i] === '1') {
          hDist++;
        }
      }
      if(this.hammingDist.length > 100)
        this.hammingDist.shift();
      this.hammingDist.push(hDist/row.length*100);
      this.chartData = {
        labels: ''.padEnd(100, ' ').split(''),
        datasets: [{
          label: 'Procent granatowej opinii',
          data: this.hammingDist
        }],
      };
    },
      drawRow(baseRow = this.rowArr) {
        if(!this.canPlay) {
          this.startRow = baseRow;
          clearTimeout(this.timeout);
          return;
        }
        this.clearCanvas = false;
        if(baseRow !== this.rowArr) {
          this.rowArr = baseRow;
        }
        else {
          this.rowArr = this.calculateNextRow(baseRow);
        }
        this.countSize(this.rowArr);
        this.draw = !this.draw;
        setTimeout(this.drawRow, this.timer);

      },
      randomByte() {
        return Math.random() < 0.5 ? 0 : 1;
      },
      dec2bin(dec){
        return (dec >>> 0).toString(2);
      },
      calculateNextRow(oldRow) {
        let a = 0;
        let b = 0;
        let arr = oldRow.split("");
        for(let i = 1; i < arr.length-1; i++) {
          if(arr[i]>1)
            arr[i] = arr[i] - 2;
        }
        let newRow = arr;
        let i = Math.floor((Math.random() * (arr.length-2)));
        this.index = i;
        if(arr[i] === arr[i+1]) {
            a = arr[i];
            newRow[i-1] = a;
            newRow[i+2] = a;
        }
        else if(this.differ) {
            a = arr[i+1];
            b = arr[i];
            newRow[i-1] = a;
            newRow[i+2] = b;
        }
        console.log('    ');
        console.log(arr.length);
        console.log(newRow.length);
        return newRow.join("");
      },
    fillArr() {
      if(this.configStart) return this.configStart;
        let arr = "";
        for(let i = 0; i < (this.canvasWidth/this.cellularWidth); i++)
          arr+=this.dec2bin(this.randomByte());
        return arr;
    }
  }
}
</script>

<style lang="scss">
  body {
    font-size: .875rem;
  }
  .chart {
    height: 200px;
    margin: auto;
    text-align: center;
    display: flex;
    justify-content: center;
  }


</style>
