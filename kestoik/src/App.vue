<template>
  <div style="height: 100vh; width: 100h;">
    <v-app >
      <div class="titlebar">
        <v-btn icon x-small dense class="mlr-2" @click="closeWindow()">
          <v-icon small>
            mdi-close
          </v-icon>
        </v-btn>
        <v-btn icon x-small dense class="mlr-2" @click="minimizeWindow()">
          <v-icon small>
            mdi-minus
          </v-icon>
        </v-btn>
        <v-btn icon x-small dense class="mlr-2" @click="expandWindow()">
          <v-icon small>
            mdi-arrow-expand
          </v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn icon text dense x-small style="self-align: flex-end;" @click="download">
          <v-icon>
            mdi-download
          </v-icon>
        </v-btn>
      </div>
      <div class="d-flex align-center justify-center mt-9">
          <v-btn-toggle dense v-model="view">
            <v-btn>Today</v-btn>
            <v-btn>Campaigns</v-btn>
            <v-btn>Progress</v-btn>
          </v-btn-toggle>
      </div>
      <TodayView ref="todayChild" v-if="view==0" @download="download"></TodayView>
      <CampaignView v-if="view==1"></CampaignView>
      <DataView v-if="view==2"></DataView>
    </v-app>
  </div>
</template>

<script>
import TodayView from './components/TodayView.vue'
import CampaignView from './components/CampaignView.vue'
import DataView from './components/DataView.vue'

export default {
  name: 'App',

  components: {
    TodayView,
    CampaignView,
    DataView
  },

  data: () => ({
    view: 0,
    settings: false,
  }),
  methods: {
    closeWindow() {
      window.electronAPI.closeWindow()
    },
    minimizeWindow() {
      window.electronAPI. minimizeWindow()
    },
    expandWindow() {
      window.electronAPI.expandWindow()
    },
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    async download() {
      const message = await new Promise(resolve => {
        window.electronAPI.getToday()
        window.electronAPI.response('get-today-response', resolve)
      })
      const md = []
      md.push('# ' + message.day)
      md.push('---')
      md.push('## Logs')
      message.activities.forEach(activity => {
        md.push(this.capitalize(activity.name) + '[' + activity.start + '-' + activity.end + ']')
        md.push('\t'+activity.observation)
      })
      md.push('## Objetivos')
      message.objectives.forEach(objective => {
        md.push(objective.name + ' : ' + objective.completion+'%')
        md.push(objective.description)
      })
      md.push('## Review')
      md.push(this.capitalize(message.evaluation))
      md.push('### Score : ' + message.score+'%')
      md.push('---')
      window.electronAPI.saveDayFile(md)
    }
  },
  created() {
    setTimeout(()=>{
      document.addEventListener('keydown', this.$refs.todayChild.combinations);
    },500)
  }
};
</script>

<style>
::-webkit-scrollbar {
  display: none;
}
#dashboard {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.titlebar {
  -webkit-app-region: drag;
  height: 30px;
  width: 100%;
  padding: 5px;
  display: flex;
  position: fixed;
  background: #191919;
  z-index: 10;
}
</style>