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
              <canvas-draw type="NORM"></canvas-draw>
            </div>
            <div class="col-4">
              <canvas-draw type="RAND"></canvas-draw>
            </div>
            <div class="col-4">
              <canvas-draw type="DIFFER"></canvas-draw>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
  import Navbar from './components/Navbar'
  import Controls from './components/Controls'
  import Sidebar from './components/Sidebar'
  import Canvas from './components/Canvas'

export default {
  name: 'app',
  components: {
      'navbar': Navbar,
      'controls': Controls,
      'sidebar': Sidebar,
      'canvas-draw': Canvas
  },
  data () {
    return {
      msg: ''
    }
  }
}
</script>

<style lang="scss">
  body {
    font-size: .875rem;
  }


</style>
