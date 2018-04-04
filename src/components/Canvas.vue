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
    export default {
      name: 'canvasDraw',
      props: ['row', 'clearCanvas', 'draw'],
      mounted () {
        this.maxAutomata = this.canvasWidth/this.cellularWidth;
        this.canvas = this.$refs.canvas;
        this.context = this.canvas.getContext('2d');
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      },
      watch: {
        clearCanvas: function (newVal) {
          console.log("CLEARIN " + newVal);
          if(newVal) {
            this.context.fillStyle = "#FFFFFF";
            this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.context.fillStyle = "#000000";
          }
        },
        draw: function() {
          let rowArr = this.row;
          let y = 0;
          let sx = 0, sy = y, swidth = this.canvasWidth, sheight = this.canvasHeight-this.cellularWidth;
          this.context.drawImage(this.canvas, sx, sy, swidth, sheight, sx, sy+this.cellularWidth, swidth, sheight);
          this.context.fillStyle = "#FFFFFF";
          this.context.fillRect(0, 0, swidth, this.cellularWidth);
          this.context.fillStyle = "#000000";
          for(let i = 0; i < rowArr.length; i++) {
            if(parseInt(rowArr[i]) === 1) {
              this.context.fillRect(i*this.cellularWidth,y,this.cellularWidth,this.cellularWidth);
            }
          }
        },
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
          timer: 50,
          startY: 0,
        }
      }
    }
</script>

<style scoped>
  canvas {
    border: 1px solid black;
  }
</style>
