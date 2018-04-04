<template>
  <nav class="col-md-2 d-none d-md-block bg-light sidebar">
    <div class="sidebar-sticky">
      <h3 class="sidebar-heading px-3 mb-3">
        Panel sterowania
      </h3>
        <fieldset class="form-group">
          <div class="form-check">
              <div class="form-group">
                <label for="automataStart">Numer startowy automatu</label>
                <input type="text" class="form-control" id="automataStart" aria-describedby="startHelp"
                       v-model="config.startNum">
                <small id="startHelp" class="form-text text-muted">Wprowadź ciąg 0 i 1, pusty generuje losowy ciąg</small>
              </div>
            <div class="form-group">
              <label for="automataName">Nazwa automatu</label>
              <input type="number" class="form-control" id="automataName" aria-describedby="nameHelp" value="0"
                     v-model="config.nameNumber" :disabled="!types.named" @change="handleNum">
              <small id="nameHelp" class="form-text text-muted">Wprowadź nazwę</small>
            </div>


            <div class="form-group">
              <div class="row">
                <div class="col-6" v-for="(rule, index) in rules">
                  <label for="'automataMask' + rule">
                    <table class="table table-sm table-bordered">
                      <tr>
                        <td v-for="num in rule.split('')">{{num}}</td>
                      </tr>
                    </table>
                  </label><br>
                  <input type="checkbox" id="'automataMask' + rule" :ref="'automataMask' + rule" aria-describedby="maskHelp" :value="index" v-model="config.maskNumber" :disabled="disableCheckbox('automataMask' + rule)" @change="handleCheck(rule)">
                </div>
              </div>
              <small id="maskHelp" class="form-text text-muted">Zaznacz maskę</small>
            </div>

              <div class="btn-group-vertical btn-group-toggle" data-toggle="buttons">
                <button class="btn btn-outline-secondary" v-bind:class="{ active: types.named }" v-on:click="types.named=saveType()">
                  Nazwa
                </button>
                <button class="btn btn-outline-secondary" v-bind:class="{ active: types.masked }" v-on:click="types.masked=saveType()">
                  Maska
                </button>
                <button class="btn btn-outline-secondary" v-bind:class="{ active: types.legal }" v-on:click="types.legal=saveType()">
                  Legalny
                </button>
                <button class="btn btn-outline-secondary" v-bind:class="{ active: types.voting }" v-on:click="types.voting=saveType()">
                  Głosujący
                </button>
              </div>
              <small id="typeHelp" class="form-text text-muted">Wybierz rodzaj konfiguracji automatu</small>
          </div>
        </fieldset>
      <div class="msg">{{ msg }}</div>
        <button class="btn btn-dark" v-on:click="save">Zapisz konfigurację</button>
    </div>
  </nav>
</template>

<script>
  import EventBus from '../EventBus'

  export default {
    name: 'Sidebar',
    data () {
      return {
        config: {
          nameNumber: 90,
          startNum: '',
          maskNumber: []
          },
        types: {
          named: true,
          masked: false,
          legal: false,
          voting: false
          },
        rules: ['111', '110', '101', '100', '011', '010', '001', '000'].reverse(),
        msg: ''
        }
    },
    methods: {
      save (event) {
        if (event && this.validateConfig()) {
          EventBus.$emit('NEW_CONFIG', this.config);
          this.$snotify.success('Zapisano. Wciśnij PLAY');
        }
      },
      validateConfig() {
        if(this.config.startNum.match(/^[0-1]+$/) || !(this.config.startNum.length > 0)) {
          return true;
        }
        this.$snotify.error('Nieprawidłowe wartości startowe');
        return false;
      },
      resetConfig () {
        Object.keys(this.types).forEach(key => this.types[key] = false);
      },
      saveType () {
        this.resetConfig();
        return true;
      },
      disableCheckbox(name) {
        if(name === 'automataMask000')
          return !(this.types.masked || this.types.voting);
        return this.types.named;
      },
      checkValue(set, arr) {
        if(set.isSuperset(arr)) {
          return set.difference(arr);
        }
        else {
          return set.union(arr);
        }
      },
      handleCheck(rule) {
        this.config.nameNumber = 0;
        if(this.types.legal) {
          let maskSet = new Set(this.config.maskNumber);
          let origRuleInd = this.rules.findIndex(el => el === rule),
            revRule = rule.split('').reverse().join(''),
            revRuleInd = this.rules.findIndex(el => el === revRule);
          if(origRuleInd !== revRuleInd) {
            maskSet = this.checkValue(maskSet.add(origRuleInd), new Set([origRuleInd, revRuleInd]));
          }
          this.config.maskNumber = [...maskSet];
        }
        else if(this.types.voting) {
          let maskSet = new Set(this.config.maskNumber);
          let ones = rule.split('0').join('').length;
          if(ones === 2) {
            maskSet = this.checkValue(maskSet.add(this.rules.findIndex(el => el === rule)), new Set([3,5,6]));
          }
          else if(ones === 1) {
            maskSet = this.checkValue(maskSet.add(this.rules.findIndex(el => el === rule)), new Set([1,2,4]));
          }
          this.config.maskNumber = [...maskSet];
        }
        for(let item of this.config.maskNumber) {
          this.config.nameNumber += Math.pow(2, parseInt(item));
        }
      },
      handleNum() {
        this.config.maskNumber = [];
        let bin = this.dec2bin(this.config.nameNumber).padStart(8, '0').split('');
        for(let key in bin)
          if(bin[key] === '1')
            this.config.maskNumber.push(key);
        console.log(this.config.maskNumber);
      },
      dec2bin(dec){
        return (dec >>> 0).toString(2);
      }
    }
  }

  Set.prototype.isSuperset = function(subset) {
    for (let elem of subset) {
      if (!this.has(elem)) {
        return false;
      }
    }
    return true;
  }

  Set.prototype.union = function(setB) {
    let union = new Set(this);
    for (let elem of setB) {
      union.add(elem);
    }
    return union;
  }

  Set.prototype.difference = function(setB) {
    let difference = new Set(this);
    for (let elem of setB) {
      difference.delete(elem);
    }
    return difference;
  }
</script>

<style>
  .sidebar {
    position: fixed;
    top: 48px;
    bottom: 0;
    left: 0;
    z-index: 100; /* Behind the navbar */
    padding: 0;
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
    text-align: center;
  }

  .sidebar-sticky {
    position: -webkit-sticky;
    position: sticky;
    height: calc(100vh - 48px);
    padding-top: .5rem;
    overflow-x: hidden;
    overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
  }

  .sidebar .nav-link {
    font-weight: 500;
    color: #333;
  }

  .sidebar .nav-link .feather {
    margin-right: 4px;
    color: #999;
  }

  .sidebar .nav-link.active {
    color: #007bff;
  }

  .sidebar .nav-link:hover .feather,
  .sidebar .nav-link.active .feather {
    color: inherit;
  }

  .sidebar-heading {
    font-size: .75rem;
    text-transform: uppercase;
  }
  .col-6 {
    text-align: center;
  }
  label, .table {
    margin-bottom: 0;
  }
  .msg {
    color: crimson;
  }
</style>
