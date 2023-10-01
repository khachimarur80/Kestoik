<template>
  <div style="height: 100vh; width: 100h;">
    <v-app>
      <div style="height: 100vh; width: 100h;" id="main">
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
          <v-btn icon dense x-small style="self-align: flex-end;" @click="toggleTheme" class="mr-1">
            <v-icon>{{ darkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
          </v-btn>
          <v-btn icon dense x-small style="self-align: flex-end;" @click="download" class="mr-2">
            <v-icon>
              mdi-download
            </v-icon>
          </v-btn>
          <!--<v-btn icon dense x-small style="self-align: flex-end;" @click="settings" class="ml-1">
            <v-icon>
              mdi-cog-outline
            </v-icon>
          </v-btn>-->
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
      </div>
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
    darkTheme: true,
  }),
  methods: {
    toggleTheme() {
      this.darkTheme = !this.darkTheme
      if (this.darkTheme) {
        window.localStorage.setItem('theme', 'dark')
      }
      else {
        window.localStorage.setItem('theme', 'light')
      }
      this.$vuetify.theme.dark = this.darkTheme
      const theme = this.darkTheme ? 'dark' : 'light';
      const themeColors = this.$vuetify.theme.themes[theme];
      const propertyMap = {
        '--primary': 'primary',
        '--secondary': 'secondary',
        '--background': 'background',
        '--background-alt': 'backgroundAlt',
        '--background-dark': 'backgroundDark',
        '--text-primary': 'textPrimary',
        '--text-secondary': 'textSecondary',
        '--text-inverse': 'textInverse',
        '--border': 'border',
        '--border-accent': 'borderAccent',
        '--error': 'error',
        '--success': 'success',
        '--link-primary': 'linkPrimary',
        '--link-secondary': 'linkSecondary',
        '--neutral-light': 'neutralLight',
        '--neutral-dark': 'neutralDark',
      };
      for (const [property, colorName] of Object.entries(propertyMap)) {
        document.documentElement.style.setProperty(property, themeColors[colorName]);
      }

    },
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
      md.push('## Logs\n')
      if (message.activities.length) {
        message.activities.forEach((activity) => {
          const formattedActivity = this.capitalize(activity.name);
          const formattedStart = activity.start;
          const formattedEnd = activity.end;
          md.push('| Activity | Start | End |');
          md.push('| --- | --- | --- |');
          md.push(`| ${formattedActivity} | ${formattedStart} | ${formattedEnd} |`);
          md.push('| --- | --- | --- |');
          md.push(`\nObservation : ${activity.observation}\n`); // Add observation in a new row
        });
      }
      md.push('## Worked Campaigns')

      let campaigns = []

      for (let i = 0; i < message.objectives.length; i++) {
          for (let j = 0; j < message.objectives[i].campaigns.length; j++) {
              campaigns.push(message.objectives[i].campaigns[j].name)
          }
      }

      campaigns = Array.from(new Set(campaigns));

      md.push(campaigns.join(', '))

      md.push('## Objetivos\n')
      if (message.activities.length) {
        message.objectives.forEach((objective) => {

          const formattedObjective = this.capitalize(objective.name);
          const formattedCompletion = objective.completion+'%';
          md.push('| Objective | Completion |');
          md.push('| --- | --- |');
          md.push(`| ${formattedObjective} | ${formattedCompletion}`);
          md.push('| --- | --- |');
          md.push(`\nDescription : ${objective.description}\n`); // Add observation in a new row
        });
      }
      md.push('## Review')
      md.push(this.capitalize(message.evaluation))
      md.push('### Score : ' + message.score+'%')
      md.push('---')
      window.electronAPI.saveDayFile(md)
    }
  },
  mounted() {
    if (window.localStorage.getItem('theme')) {
      this.darkTheme = window.localStorage.getItem('theme')=='dark'
      this.$vuetify.theme.dark = this.darkTheme
    }
    else {
      this.darkTheme = true
      window.localStorage.setItem('theme', 'dark')
    }
    this.$nextTick(() => {
      const theme = this.darkTheme ? 'dark' : 'light';
      const themeColors = this.$vuetify.theme.themes[theme];
      const propertyMap = {
        '--primary': 'primary',
        '--secondary': 'secondary',
        '--background': 'background',
        '--background-alt': 'backgroundAlt',
        '--background-dark': 'backgroundDark',
        '--text-primary': 'textPrimary',
        '--text-secondary': 'textSecondary',
        '--text-inverse': 'textInverse',
        '--border': 'border',
        '--border-accent': 'borderAccent',
        '--error': 'error',
        '--success': 'success',
        '--link-primary': 'linkPrimary',
        '--link-secondary': 'linkSecondary',
        '--neutral-light': 'neutralLight',
        '--neutral-dark': 'neutralDark',
      };
      for (const [property, colorName] of Object.entries(propertyMap)) {
        document.documentElement.style.setProperty(property, themeColors[colorName]);
      }
      document.documentElement.addEventListener('keydown', this.$refs.todayChild.combinations);
    })
  },
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
  background: var(--background-alt);
  z-index: 10;
}
</style>