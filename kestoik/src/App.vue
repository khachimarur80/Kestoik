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
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon dense x-small style="self-align: flex-end;" @click="download" class="mr-1" v-bind="attrs" v-on="on">
                <v-icon>
                  mdi-earth
                </v-icon>
              </v-btn>
            </template>
            <div class="pt-2 d-flex flex-column">
              <button @click="$i18n.locale='es'" v-if="$i18n.locale!='es'">
                <span class="fi fi-es"></span>
              </button>
              <button @click="$i18n.locale='en'" v-if="$i18n.locale!='en'">
                <span class="fi fi-gb"></span>
              </button>
              <button @click="$i18n.locale='ja'" v-if="$i18n.locale!='ja'">
                <span class="fi fi-jp"></span>
              </button>
            </div>
          </v-menu>
          <v-btn icon dense x-small style="self-align: flex-end;" @click="toggleTheme" class="mr-1">
            <v-icon>{{ darkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
          </v-btn>
          <!--
          <v-btn icon dense x-small style="self-align: flex-end;" @click="download" class="mr-2">
            <v-icon>
              mdi-download
            </v-icon>
          </v-btn>
          <v-btn icon dense x-small style="self-align: flex-end;" @click="settings" class="ml-1">
            <v-icon>
              mdi-cog-outline
            </v-icon>
          </v-btn>-->
        </div>
        <div class="d-flex align-center justify-center mt-9">
            <v-btn-toggle dense v-model="view">
              <v-btn>{{ $t('message.today') }}</v-btn>
              <v-btn>{{ $t('message.campaigns') }}</v-btn>
              <v-btn>{{ $t('message.progress') }}</v-btn>
            </v-btn-toggle>
        </div>
        <TodayView ref="todayChild" v-if="view==0"></TodayView>
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
    getActivities(objective, day) {
      let availableActivities = []

      objective.activities.forEach(
          activity => availableActivities.push(activity.name)
      )

      let registeredActivities = []

      day.activities.forEach(
          activity => { registeredActivities.push(activity) }
      )
      
      let result = registeredActivities.filter(activity => availableActivities.includes(activity.name))
      let notCompleted = objective.activities.filter(activity => !result.map(obj => obj.name).includes(activity.name))
      notCompleted.forEach(activity => {activity.performace = 0; activity.satisfaction = 0})

      return result.concat(notCompleted)
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
          md.push('---\n')
          const formattedObjective = this.capitalize(objective.name);
          md.push('###'+formattedObjective+'\n')
          md.push('Campaigns : '+objective.campaigns.map(obj => obj.name).join(', ')+'\n')
          md.push('| Activity | Accuracy | Satisfaction | Performance');
          md.push('| --- | --- |');

          let activities = this.getActivities(objective, message)
          
          activities.forEach((activity) => {
            md.push(`| ${activity.name} | ${activity.realDuration}/${activity.duration} | ${(activity.satisfaction + 1)*20} % | ${activity.performace} % |`)
          })
          md.push('| --- | --- |');
          md.push(`\nDescription : ${objective.description}`);
          md.push(`\nObservations : ${objective.observations}\n`);
        });
      }
      md.push('## Review')
      md.push(this.capitalize(message.evaluation))
      md.push('### Score : ' + message.score+'%')
      md.push('---')
      //window.electronAPI.saveDayFile(md)
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
  height: 0px;
  width: 0px;
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