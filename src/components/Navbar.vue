<template>
    <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
      <a class="navbar-brand col-sm-8 col-md-4 mr-0" href="#">Automaty komórkowe - pierwszy projekt</a>
      <ul class="navbar-nav col-md-1 px-3" v-for="link in links">
        <li class="nav-item text-nowrap">
          <a class="nav-link" v-bind:href="link.href">{{ link.txt }}</a>
        </li>
      </ul>
    </nav>
</template>

<script>
  export default {
    name: 'Navbar',
    data () {
      return {
          links: [
            {
                href: '#',
                txt: 'Github'
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
</style>
