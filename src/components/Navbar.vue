<template>
    <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
      <a class="navbar-brand col-sm-8 col-md-4 mr-0" href="#">Automaty komorkowe - pierwszy projekt</a>
      <div class="nav col-md-3">
          <span class="nav-item" v-for="link in links">
            <a class="nav-link" v-bind:href="link.href" target="_blank">{{ link.txt }}</a>
          </span>
        </div>
    </nav>
</template>

<script>
  export default {
    name: 'Navbar',
    data () {
      return {
          links: [
            {
                href: 'https://github.com/Vakme/cellularAutomata',
                txt: 'Github'
            },
            {
              href: '#',
              txt: 'Sprawozdanie'
            }
          ]
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .navbar-brand {
    padding-top: .75rem;
    padding-bottom: .75rem;
    font-size: 1rem;
    background-color: rgba(0, 0, 0, .25);
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, .25);
  }
  a, a:hover {
    color: whitesmoke;
  }
</style>
