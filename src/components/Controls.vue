<template>
  <div class="controls d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
    <h1 class="h2">Dashboard</h1>
    <div class="btn-toolbar mb-2 mb-md-0">
      <div class="btn-group mr-2">
        <label>Poroznianie: </label>
        <button class="btn btn-sm btn-outline-secondary" :class="{ active: !isDiffer }" v-on:click="noDiffer">BRAK</button>
        <button class="btn btn-sm btn-outline-secondary" :class="{ active: isDiffer }" v-on:click="differ">POROZNIJ</button>
      </div>
      <div class="mr-2">
        <label for="speed">Predkosc: </label>
        <input type=range id="speed" min=0 max=950 step=50 v-model="speed" v-on:change="speedChange">
      </div>
      <div class="btn-group mr-2">
        <button class="btn btn-sm btn-outline-secondary" v-on:click="play">PLAY</button>
        <button class="btn btn-sm btn-outline-secondary" v-on:click="pause">PAUSE</button>
        <button class="btn btn-sm btn-outline-secondary" v-on:click="reset">RESET</button>
      </div>
    </div>
  </div>
</template>

<script>
  import EventBus from '../EventBus';

  export default {
    name: 'Controls',
    data () {
      return {
        speed: 0,
        isDiffer: false
      }
    },
    methods: {
      play: function (event) {
        if (event) {
          EventBus.$emit('PLAY');
        }
      },
      pause: function (event) {
        if (event) {
          EventBus.$emit('PAUSE');
        }
      },
      reset: function (event) {
        if (event) {
          EventBus.$emit('RESET');
        }
      },
      speedChange: function (event) {
        if (event) {
          EventBus.$emit('SPEED', this.speed);
        }
      },
      noDiffer: function (event) {
        if (event) {
          this.isDiffer = false;
          EventBus.$emit('TYPE', false);
        }
      },
      differ: function (event) {
        if (event) {
          this.isDiffer = true;
          EventBus.$emit('TYPE', true);
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .btn:focus, .btn:active:focus, .btn.active:focus {
    outline: 0 none;
    box-shadow: none;
    background-color: #333333;
    color: #999999;
  }
  input, label {
    margin-right: 10px;
  }
</style>
