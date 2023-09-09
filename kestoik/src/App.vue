<template>
  <v-app>
    <v-app-bar app flat>
      <div class="d-flex align-center">
        <v-img alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="./assets/logo.png"
          transition="scale-transition"
          width="40"
        />
      </div>
      <v-spacer></v-spacer>
      <div class="d-flex align-center justify-center">
          <v-btn-toggle dense v-model="view">
            <v-btn>Today</v-btn>
            <v-btn>Campaigns</v-btn>
            <v-btn>Progress</v-btn>
          </v-btn-toggle>
      </div>
      <v-spacer></v-spacer>
      <div class="d-flex align-center">
        <v-btn icon text @click="settings=true">
          <v-icon>mdi-cog-outline</v-icon>
        </v-btn>
        <v-dialog
          v-model="settings"
          fullscreen
          hide-overlay
        >
          <v-card tile>
            <v-btn @click="settings=false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card>
        </v-dialog>
      </div>
    </v-app-bar>

    <v-main>
      <TodayView v-if="view==0"></TodayView>
      <CampaignView v-if="view==1"></CampaignView>
      <DataView v-if="view==2"></DataView>
    </v-main>
  </v-app>
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
</style>