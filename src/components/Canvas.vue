<template>
  <div class="canvas">
      <canvas
      ref="canvas"
      :width="canvasWidth"
      :height="canvasHeight"
    ></canvas>
  </div>
</template>

<script>
  import EventBus from '../EventBus';

    export default {
      name: 'canvasDraw',
      props: ['type'],
      mounted () {
        EventBus.$on('PLAY', this.played);
        EventBus.$on('PAUSE', this.paused);
        EventBus.$on('RESET', this.cleared);
        EventBus.$on('NEW_CONFIG', this.saved);
        EventBus.$on('SET_RULES', this.savedRand);
        EventBus.$on('SET_DIFFER', this.savedDiffer);

        this.rules = this.dec2bin(this.nameNumber).padStart(8, '0').split("").reverse().map(value => parseInt(value));
        this.maxAutomata = this.canvasWidth/this.cellularWidth;
        this.canvas = this.$refs.canvas;
        this.context = this.canvas.getContext('2d');
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
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
        cleared(clearStart = true) {
          console.log('RESET');
          if(clearStart)
            this.startRow = null;
          this.differRow = null;
          this.canPlay = false;
          this.rewind = false;
          this.baseDraw();
        },
        saved(config) {
            this.rules = this
              .dec2bin(config.nameNumber)
              .padStart(8, '0')
              .split("")
              .reverse()
              .map(value => parseInt(value));
          if(config.startNum)
            this.configStart = config.startNum.padStart((this.canvasWidth/this.cellularWidth)/2, '0').padEnd((this.canvasWidth/this.cellularWidth), '0');
          this.cleared(false);
        },
        savedRand(newRow) {
          if(this.type === 'RAND') {
            console.log('DRAW RAND: ' + newRow);
            setTimeout(this.drawRow, this.timer, newRow);
          }
        },
        savedDiffer(newRow) {
          if(this.type === 'DIFFER') {
            console.log('DRAW DIFFER: ' + newRow);
            if(this.differRow === null) {
              this.differRow = newRow;
            }
            else {
              let arr = '';
              for(let i = 0; i < newRow.length; i++) {
                if(this.differRow[i] === newRow[i])
                  arr += '0';
                else
                  arr += '1';
              }
              this.differRow = null;
              this.timeout = setTimeout(this.drawRow, this.timer, arr);
            }
          }
        },
        baseDraw() {
          if(this.startRow === null) {
            this.context.fillStyle = "#FFFFFF";
            this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.context.fillStyle = "#000000";
            if(this.type === 'NORM') {
              let rowArr = this.configStart;
              rowArr = this.fillArr(rowArr);
              setTimeout(this.drawRow, this.timer, rowArr);
            }
          }
          else if(this.type === 'DIFFER')
            return;
          else {
            setTimeout(this.drawRow, this.timer, this.startRow);
          }
        },

        drawRow(rowArr) {
          if(!this.canPlay) {
            this.startY = y;
            this.startRow = rowArr;
            this.differRow = null;
            clearTimeout(this.timeout);
            return;
          }
          let y = 0;
          let sx = 0, sy = y, swidth = this.canvasWidth, sheight = this.canvasHeight-this.cellularWidth;
          this.context.drawImage(this.canvas, sx, sy, swidth, sheight, sx, sy+this.cellularWidth, swidth, sheight);
          this.context.fillStyle = "#FFFFFF";
          this.context.fillRect(0, 0, swidth, this.cellularWidth);
          this.context.fillStyle = "#000000";
          this.rewind = true;
          for(let i = 0; i < rowArr.length; i++) {
            if(parseInt(rowArr[i]) === 1) {
              this.context.fillRect(i*this.cellularWidth,y,this.cellularWidth,this.cellularWidth);
            }
          }
          rowArr = this.calculateNextRow(rowArr);
          if(this.type !== 'DIFFER') {
            EventBus.$emit('SET_DIFFER', rowArr);
            this.timeout = setTimeout(this.drawRow, this.timer, rowArr);
          }

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
        fillArr(arr) {
          if(arr === null) {
            arr = "";
            for(let i = 0; i < (this.canvasWidth/this.cellularWidth); i++)
              arr+=this.dec2bin(this.randomByte());
          }
          let randArr = arr.split(''), randInd = Math.floor(Math.random()*arr.length);
          randArr[randInd] === '0' ? randArr[randInd] = 1 : randArr[randInd] = 0;
          EventBus.$emit('SET_RULES', randArr.join(''));
          return arr;
        }
      },

      data () {
        return {
          canvas: {},
          context: {},
          canvasHeight: 330,
          canvasWidth: 330,
          cellularWidth: 3,
          name: "ok",
          maxAutomata: 0,
          baseAutomata: [],
          nameNumber: 112,
          rules: "",
          timeout: null,
          canPlay: false,
          timer: 50,
          startY: 0,
          startRow: null,
          differRow: null,
          configStart: null,
          rewind: false
        }
      }
    }
</script>

<style scoped>
  canvas {
    border: 1px solid black;
  }
</style>
