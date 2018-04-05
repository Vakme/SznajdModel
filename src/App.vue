<template>
  <div id="app">
    <navbar></navbar>
    <div class="container-fluid">
      <div class="row">
        <sidebar></sidebar>
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
          <controls></controls>
          <div class="row">
            <div class="col-4">
              <canvas-draw :row="rowArr" :clearCanvas="clearCanvas" :draw="draw"></canvas-draw>
            </div>
            <div class="col-4">
              <canvas-draw :row="randRowArr" :clearCanvas="clearCanvas" :draw="draw"></canvas-draw>
            </div>
            <div class="col-4">
              <canvas-draw :row="diffRowArr" :clearCanvas="clearCanvas" :draw="draw"></canvas-draw>
            </div>
            <div class="chart col-md-8">
              <line-chart :chart-data="chartData"
                          :hammingDist="hammingDist"
                          :options="chartOptions"
                          :height="200"
                          :width="600"></line-chart>
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
      canvasWidth: 330,
      cellularWidth: 3,
      maxAutomata: 0,
      baseAutomata: [],
      nameNumber: 90,
      rules: '',
      timeout: null,
      canPlay: false,
      timer: 50,
      startRow: null,
      configStart: null,
      rowArr: '',
      randRowArr: '',
      diffRowArr: '',
      hammingDist: []
    }
  },
  mounted () {
    EventBus.$on('PLAY', this.played);
    EventBus.$on('PAUSE', this.paused);
    EventBus.$on('RESET', this.cleared);
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
    cleared() {
      console.log('RESET');
      this.startRow = null;
      this.canPlay = false;
      this.clearCanvas = true;
      this.hammingDist = [];
      this.chartData = {
        labels: ''.padEnd(50, ' ').split(''),
        datasets: [{
          label: 'Odleglosc Hamminga',
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
      countDiff(orig, rand) {
            let arr = '';
            let hDist = 0;
            for(let i = 0; i < orig.length; i++) {
              if(orig[i] === rand[i])
                arr += '0';
              else {
                arr += '1';
                hDist++;
              }
            }
            if(this.hammingDist.length > 50)
              this.hammingDist.shift();
            this.hammingDist.push(hDist);
            this.chartData = {
              labels: ''.padEnd(50, ' ').split(''),
              datasets: [{
                label: 'Odleglosc Hamminga',
                data: this.hammingDist,
              }],
            };
            return arr;
      },
      baseDraw() {
        if(this.clearCanvas) {
            let row = this.fillArr();
            let randRow = this.randArr(row);
            setTimeout(this.drawRow, this.timer, row, randRow);
        }
        else {
          setTimeout(this.drawRow, this.timer);
        }
      },

      drawRow(baseRow = this.rowArr, randRow = this.randRowArr) {
        if(!this.canPlay) {
          this.startRow = baseRow;
          clearTimeout(this.timeout);
          return;
        }
        this.clearCanvas = false;
        if(baseRow !== this.rowArr && randRow !== this.randRowArr) {
          this.rowArr = baseRow;
          this.randRowArr = randRow;
        }
        else {
          this.rowArr = this.calculateNextRow(baseRow);
          this.randRowArr = this.calculateNextRow(randRow);
        }
        this.diffRowArr = this.countDiff(baseRow, randRow);
        this.draw = !this.draw;
        setTimeout(this.drawRow, this.timer);

      },
      randomByte() {
        return Math.random() < 0.5 ? 0 : 1;
      },
      dec2bin(dec){
        return (dec >>> 0).toString(2);
      },
      calculateNextRow(arr) {
        let rowToMatch = arr;
        let len = rowToMatch.length;
        let newRow = "";
        let ind = 0;
        let thisNum = "";
        rowToMatch.split("").forEach((value, index) => {
          if(index < this.maxAutomata) {
            if(index === 0)
              thisNum = rowToMatch[len-1] + rowToMatch[0] + rowToMatch[1];
            else if(index === len-1)
              thisNum = rowToMatch[len-2] + rowToMatch[len-1] + rowToMatch[0];
            else
              thisNum = rowToMatch[index-1] + rowToMatch[index] + rowToMatch[index + 1];
            ind = parseInt(thisNum, 2);
            newRow += this.rules[ind];
          }
        });
        return newRow;
      },
    fillArr() {
      if(this.configStart) return this.configStart;
        let arr = "";
        for(let i = 0; i < (this.canvasWidth/this.cellularWidth); i++)
          arr+=this.dec2bin(this.randomByte());
        return arr;
    },
    randArr(arr) {
      let randArr = arr.split(''), randInd = Math.floor(Math.random()*arr.length);
      randArr[randInd] === '0' ? randArr[randInd] = 1 : randArr[randInd] = 0;
      return randArr.join('');
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
  }


</style>
