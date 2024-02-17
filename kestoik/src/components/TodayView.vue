<template>
    <div id="today" :class="{'has-selected-tab' : day.selected!=''}">
        <div class="day" v-if="day.day">
            <h2>{{ day.day }}</h2>
        </div>
        <div v-if="day.day" style="height: 100%; width: 100%; display: flex; flex-direction: column;">
            <div class="tabs">
                <div class="tab-smoother">
                    <div class="tab-smoother-inner-right" style="width: 10px;" v-show="day.selected=='logs'">
                    </div>
                    <div class="tab-smoother-filler" v-show="day.selected!='logs'"></div>
                </div>
                <div class="tab" :class="{ 'selected-tab' : day.selected=='logs' }">
                    <div class="tab-inner" @click="setTab('logs')">
                        {{ $t('message.logs') }}
                    </div>
                </div>
                <div class="tab-smoother">
                    <div class="tab-smoother-inner-left" v-show="day.selected=='logs'">
                    </div>
                    <div class="tab-smoother-inner-right" v-show="day.selected=='objetivos'">
                    </div>
                    <div class="tab-smoother-filler" v-show="day.selected=='reviews' || day.selected=='' || day.selected=='horarios'"></div>
                </div>
                <div class="tab" :class="{ 'selected-tab' : day.selected=='objetivos' }">
                    <div class="tab-inner" @click="setTab('objetivos')">
                        {{ $t('message.objectives') }}
                    </div>
                </div>
                <div class="tab-smoother">
                    <div class="tab-smoother-inner-left" v-show="day.selected=='objetivos'">
                    </div>
                    <div class="tab-smoother-inner-right" v-show="day.selected=='horarios'">
                    </div>
                    <div class="tab-smoother-filler" v-show="day.selected=='logs' || day.selected=='' || day.selected=='reviews'"></div>
                </div>
                <!--<div class="tab" :class="{ 'selected-tab' : day.selected=='horarios' }">
                    <div class="tab-inner" @click="setTab('horarios')">
                        Horarios
                    </div>
                </div>-->
                <div class="tab-smoother">
                    <div class="tab-smoother-inner-left" v-show="day.selected=='horarios'">
                    </div>
                    <div class="tab-smoother-inner-right" v-show="day.selected=='reviews'">
                    </div>
                    <div class="tab-smoother-filler" v-show="day.selected=='logs' || day.selected=='' || day.selected=='objetivos'"></div>
                </div>
                <div class="tab" :class="{ 'selected-tab' : day.selected=='reviews' }">
                    <div class="tab-inner" @click="setTab('reviews')">
                        {{ $t('message.review') }}
                    </div>
                </div>
                <div class="tab-smoother">
                    <div class="tab-smoother-inner-left" style="width: 10px" v-show="day.selected=='reviews'">
                    </div>
                    <div class="tab-smoother-filler" v-show="day.selected!='reviews'"></div>
                </div>
            </div>
            <div class="container">
                <div class="frame" v-show="day.selected=='logs'">
                    <div id="logs-menu" class="d-flex">
                        <div class="d-flex" id="logs-list" @wheel="scrollHorizontal">
                            <v-btn elevation="0" solo v-for="(activity, i) in availableActivities" :key="i" @click="addLogFromActivity(activity)">
                                {{ activity.name }}
                            </v-btn>
                        </div>
                    </div>
                    <v-divider class="mx-n3"></v-divider>
                    <div class="create-activity">
                        <div class="d-flex align-center">
                            <v-text-field 
                                hide-details 
                                dense 
                                outlined 
                                text 
                                autofocus 
                                @keydown.enter="createActivity"
                                v-model="inputingActivity" 
                                id="createActivity"
                                :placeholder="$t('message.newLog') + ' ...'"
                                >
                            </v-text-field>
                        </div>
                    </div>
                    <div class="d-flex" style="width: 100%; height: calc(100% - 60px); gap: 10px;">
                        <div class="activities">
                            <v-card width="100%" style="min-height: 100%;" class="pa-2">
                                <div v-for="(activity, i) in day.activities" :key="i" class="activity d-flex align-center">
                                    <v-btn color="secondary" icon @click="completeActivity(activity)" v-if="!activity.completed">
                                        <v-icon>
                                            mdi-circle-outline
                                        </v-icon>
                                    </v-btn>
                                    <v-btn color="success" icon @click="completeActivity(activity)" v-else>
                                        <v-icon>
                                            mdi-circle
                                        </v-icon>
                                    </v-btn>
                                    <input class="time-input"
                                        v-model="activity.start"
                                        type="time"
                                        hide-details="auto"
                                        @input="calculateLogDuration(activity)"
                                    >
                                    <span class="mr-1 ml-1">-</span>
                                    <input v-if="activity.end"
                                        class="time-input"
                                        v-model="activity.end"
                                        type="time"
                                        hide-details="auto"
                                        @input="calculateLogDuration(activity)"
                                    >
                                    <span class="text-body-1 ml-4" style="user-select: none;" @click="editInfo(activity)"
                                    >{{ activity.name }}</span>
                                    <v-spacer></v-spacer>
                                    <v-btn color="error" icon dense x-small @click="removeActivity(i)" class="mr-2">
                                        <v-icon>
                                            mdi-delete
                                        </v-icon>
                                    </v-btn>
                                </div>
                            </v-card>
                        </div>
                        <div class="observations" v-if="editActivityInfo">
                            <v-card width="100%" class="pa-2" style="min-height: 100%;">
                                <div style="width: 100%;" class="d-flex mb-2">
                                    <div class="text-h5 ml-2">
                                        <input style="outline: none" v-model="editActivityInfo.name">
                                    </div>
                                </div>
                                <div class="text-h6 ml-2">
                                    {{ $t('message.description') }}
                                </div>
                                <v-textarea 
                                    no-resize
                                    auto-grow
                                    v-model="editActivityInfo.observation"
                                    dense
                                    autofocus
                                    @keydown.tab.prevent="insertTab"
                                    :rows="3"
                                    outlined
                                    class="ma-2"
                                >

                                </v-textarea>
                            </v-card>
                        </div>
                    </div>
                </div>
                <div class="frame" v-show="day.selected=='objetivos'">
                    <!--<div id="schedules-menu" class="d-flex">
                        <v-btn icon text color="primary">
                            <v-icon>
                                mdi-plus
                            </v-icon>
                        </v-btn>
                        <div class="d-flex" id="schedules-list" @wheel="scrollHorizontal">
                            <v-btn text elevation="0">
                                Schedule 1
                            </v-btn>
                        </div>
                    </div>-->
                    <div class="d-flex" style="flex: 1; overflow: hidden;">
                        <div id="objectives">
                            <div class="create-activity">
                                <div class="d-flex align-center">
                                    <v-text-field
                                        hide-details 
                                        solo 
                                        dense 
                                        outlined 
                                        text
                                        flat
                                        autofocus 
                                        @keydown.enter="createObjective" 
                                        v-model="inputingObjective" 
                                        id="createObjective"
                                        :placeholder="$t('message.newObjective') + ' ...'"
                                        >
                                    </v-text-field>
                                </div>
                            </div>
                            <div class="pa-2 mt-1" style="width: 100%; height: calc(100% - 40px);">
                                <v-card width="100%" height="100%" class="pa-4 overflow-auto">
                                    <div v-for="(objective, i)  in day.objectives" :key="i" @mousedown="setEditingObjective(objective)" class="objective text d-flex mb-2 align-center">
                                        {{ objective.name }}
                                        <v-spacer></v-spacer>
                                        {{ objective.duration }} {{ $t('message.min') }} 
                                        <v-btn icon dense x-small class="ml-2" color="error" @mousedown.stop @click="deleteObjective(i)">
                                            <v-icon>
                                                mdi-delete
                                            </v-icon>
                                        </v-btn>
                                    </div>
                                </v-card>
                            </div>
                        </div>
                        <div id="objectives-configuration">
                            <div class="observations pa-2 mt-1" v-if="editingObjective">
                                <div style="height: 40px" class="text-h5 text-center">
                                    {{ $t('message.objective') }}
                                </div>
                                <v-card width="100%" height="100%" class="overflow-auto" style="height: calc(100% - 40px)">
                                    <v-card-title>
                                        <div class="text-h5">
                                            <input style="outline: none;" v-model="editingObjective.name">
                                        </div>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-divider class="mb-4"></v-divider>
                                        <div class="body-1 pr-3 mb-1">
                                           {{ $t('message.campaigns') }}
                                        </div>
                                        <v-combobox
                                            text
                                            clearable
                                            hide-selected
                                            multiple
                                            hide-details
                                            dense
                                            solo
                                            small-chips
                                            :items="campaigns"
                                            item-text="name"
                                            v-model="editingObjective.campaigns"
                                        ></v-combobox>
                                        <v-divider class="my-4"></v-divider>
                                        <div class="d-flex align-center my-1">
                                            <div class="body-1 pr-3">
                                               {{ $t('message.totalTime') }}
                                            </div>
                                            <v-spacer></v-spacer>
                                            <div class="body-1 pr-3">
                                                {{ editingObjective.duration }} {{ $t('message.min') }}
                                            </div>
                                        </div>
                                        <v-divider class="my-4"></v-divider>
                                        <div class="d-flex align-center">
                                            <v-btn text icon color="primary" dense @click="addActivity">
                                                <v-icon>
                                                    mdi-plus
                                                </v-icon>
                                            </v-btn>
                                            <div class="body-1 pr-3 ml-1">
                                                {{ $t('message.activities') }}
                                            </div>
                                        </div>
                                        <div v-for="(activity, i) in editingObjective.activities" :key="i" class="mx-2 my-1">
                                            <div class="d-flex align-center">
                                                <v-btn icon dense text color="error" x-small @click="removeObjectiveActivity(i)">
                                                    <v-icon>
                                                        mdi-close
                                                    </v-icon>
                                                </v-btn>
                                                <v-text-field dense hide-details solo v-model="activity.name" class="text-body-1 mx-2"></v-text-field>
                                                <v-text-field class="time-input"
                                                    v-model="activity.duration"
                                                    type="number"
                                                    hide-details
                                                    dense
                                                    style="max-width: 68px;"
                                                    solo
                                                    @input="totalObjectiveTime"
                                                ></v-text-field>
                                            </div>
                                        </div>

                                        <v-divider class="my-4"></v-divider>
                                        <div class="text-body-1 pr-3 mb-1">
                                           {{ $t('message.description') }}
                                        </div>
                                        <v-textarea 
                                            class="objective-description" 
                                            v-model="editingObjective.description"
                                            :rows="3"
                                            auto-grow
                                            outlined
                                        >
                                        </v-textarea>
                                    </v-card-text>
                                </v-card>
                            </div>
                            <div class="observations pa-2 mt-1" v-else>
                                <div style="height: 40px" class="text-h5 text-center">
                                    {{ $t('message.configuration') }}
                                </div>
                                <v-card width="100%" height="100%" class="overflow-auto" style="height: calc(100% - 40px)">
                                    <v-card-text>
                                        <div class="d-flex align-center my-1">
                                            <div class="body-1 pr-3">
                                                {{ $t('message.availableTime') }} :
                                            </div>
                                            <v-spacer></v-spacer>
                                            <div class="body-1 pr-3">
                                                {{ availableTime }} {{ $t('message.min') }}
                                            </div>
                                        </div>
                                        <div class="d-flex align-center my-1">
                                            <div class="body-1 pr-3">
                                                {{ $t('message.usedTime') }} :
                                            </div>
                                            <v-spacer></v-spacer>
                                            <div class="body-1 pr-3">
                                                {{ usedTime }} {{ $t('message.min') }}
                                            </div>
                                        </div>
                                        <div class="d-flex align-center my-1">
                                            <div class="body-1 pr-3">
                                                {{ $t('message.bedTime') }} :
                                            </div>
                                            <v-spacer></v-spacer>
                                            <v-text-field class="time-input"
                                                v-model="day.bedTime"
                                                type="time"
                                                hide-details
                                                dense
                                                style="max-width: 120px;"
                                                outlined
                                                @change="calculateAvailableTime"
                                            ></v-text-field>
                                        </div>
                                        <!--<div class="d-flex align-center my-1">
                                            <div class="body-1 pr-3">
                                                {{ $t('message.errorMargin') }} :
                                            </div>
                                             <v-spacer></v-spacer>
                                            <v-text-field class="time-input"
                                                v-model="errorMargin"
                                                type="number"
                                                hide-details
                                                dense
                                                :suffix="$t('message.min')"
                                                style="max-width: 120px;"
                                                outlined
                                                @change="calculateAvailableTime"
                                            ></v-text-field>
                                        </div>-->
                                    </v-card-text>
                                </v-card>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="frame" v-show="day.selected=='reviews'">
                    <v-card height="100%" width="100%" class="pa-2 overflow-auto">
                        <v-card-text>
                            <div class="text-h4 my-5">
                                {{ $t('message.objectives') }}
                            </div>
                            <div v-for="(objective, i) in day.objectives" :key="i" class="my-2">
                                <v-divider></v-divider>
                                <div class="d-flex">
                                    <div class="text-h5 mt-2">
                                        {{ objective.name }}
                                    </div>
                                </div>
                                <v-list>
                                    <!--<v-list-item>
                                         <v-row>
                                            <v-col cols="3" class="d-flex justify-center">
                                                {{ getActivities(objective).length }} / {{ objective.activities.length }}
                                            </v-col>
                                            <v-col cols="2" class="d-flex justify-center">
                                                {{ objective.realDuration }}/{{ objective.duration }}
                                            </v-col>
                                            <v-col cols="3" class="d-flex justify-center">
                                                {{ objective.satisfaction }}
                                            </v-col>
                                            <v-col cols="4" class="d-flex justify-center">
                                                {{ objective.performance }}
                                            </v-col>
                                        </v-row>
                                    </v-list-item>-->
                                    <v-list-item class="mb-1">
                                        <v-row>
                                            <v-col cols="3" class="d-flex justify-center">
                                                {{ $t('message.activity') }}
                                            </v-col>
                                            <v-col cols="2" class="d-flex justify-center">
                                                {{ $t('message.accuracy') }}
                                            </v-col>
                                            <v-col cols="3" class="d-flex justify-center">
                                                {{ $t('message.satisfaction') }}
                                            </v-col>
                                            <v-col cols="4" class="d-flex justify-center">
                                                {{ $t('message.performance') }}
                                            </v-col>
                                        </v-row>
                                    </v-list-item>
                                    <v-list-item v-for="(activity, i) in getActivities(objective)" :key="i" class="my-n3">
                                        <v-row>
                                            <v-col cols="3" class="d-flex justify-center">
                                                <div class="text-body-1">
                                                    {{ activity.name }}
                                                </div>
                                            </v-col>
                                            <v-col cols="2" class="d-flex justify-center">
                                                <div class="text-body-1">
                                                    {{ activity.realDuration }}  / {{ activity.duration }}
                                                </div>
                                            </v-col>
                                            <v-col cols="3" class="d-flex justify-center">
                                                <v-btn icon small @click="activity.satisfaction=0; objectiveStats(objective)">
                                                    <v-icon color="error" v-if="activity.satisfaction==0">
                                                        mdi-emoticon-frown
                                                    </v-icon>
                                                    <v-icon color="error" v-else>
                                                        mdi-emoticon-frown-outline
                                                    </v-icon>
                                                </v-btn>
                                                <v-btn icon small @click="activity.satisfaction=1; objectiveStats(objective)">
                                                    <v-icon color="orange" v-if="activity.satisfaction==1">
                                                        mdi-emoticon-confused
                                                    </v-icon>
                                                    <v-icon color="orange" v-else>
                                                        mdi-emoticon-confused-outline
                                                    </v-icon>
                                                </v-btn>
                                                <v-btn icon small @click="activity.satisfaction=2; objectiveStats(objective)">
                                                    <v-icon color="amber" v-if="activity.satisfaction==2">
                                                        mdi-emoticon-neutral
                                                    </v-icon>
                                                    <v-icon color="amber" v-else>
                                                        mdi-emoticon-neutral-outline
                                                    </v-icon>
                                                </v-btn>
                                                <v-btn icon small @click="activity.satisfaction=3; objectiveStats(objective)">
                                                    <v-icon color="success" v-if="activity.satisfaction==3">
                                                        mdi-emoticon-happy
                                                    </v-icon>
                                                    <v-icon color="success" v-else>
                                                        mdi-emoticon-happy-outline
                                                    </v-icon>
                                                </v-btn>
                                                <v-btn icon small @click="activity.satisfaction=4; objectiveStats(objective)">
                                                    <v-icon color="primary" v-if="activity.satisfaction==4">
                                                        mdi-emoticon-excited
                                                    </v-icon>
                                                    <v-icon color="primary" v-else>
                                                        mdi-emoticon-excited-outline
                                                    </v-icon>
                                                </v-btn>
                                            </v-col>
                                            <v-col cols="4" class="d-flex justify-center align-center">
                                                <v-slider hide-details v-model="activity.performance" :color="performanceColor(activity.performance)" inverse-label :label="activity.performance + '%'" @input="objectiveStats(objective)">
                                                </v-slider>
                                            </v-col>
                                        </v-row>
                                    </v-list-item>
                                </v-list>

                                <div class="text-subtitle-1 my-2">
                                    {{ $t('message.observations') }}
                                </div>
                                <v-textarea 
                                    no-resize
                                    auto-grow
                                    v-model="objective.observations"
                                    dense
                                    @keydown.tab.prevent="insertTab"
                                    :rows="3"
                                    outlined
                                ></v-textarea>
                            </div>
                            <v-divider></v-divider>
                        </v-card-text>
                        <v-card-text>
                            <div class="text-h4 my-5">{{ $t('message.evaluation') }}</div>
                            <v-textarea 
                                no-resize
                                auto-grow
                                v-model="day.evaluation"
                                dense
                                @keydown.tab.prevent="insertTab"
                                :rows="5"
                                outlined
                            >

                            </v-textarea>
                            <div style="display: flex; justify-content: center; align-items: center; position:absolute; top: 30px; right: 30px; gap: 20px">
                                <v-progress-circular :value="todayScore[1]" width="3" size="40" :color=scoreColor(todayScore[1])>
                                    {{ scoreLetter(todayScore[1]) }}
                                </v-progress-circular>
                                <v-progress-circular :value="todayScore[2]" width="3" size="40" :color=scoreColor(todayScore[2])>
                                    {{ scoreLetter(todayScore[2]) }}
                                </v-progress-circular>
                                <v-progress-circular :value="todayScore[3]" width="3" size="40" :color=scoreColor(todayScore[3])>
                                    {{ scoreLetter(todayScore[3]) }}
                                </v-progress-circular>
                                <v-progress-circular :value="todayScore[0]" width="3" size="50" :color=scoreColor(todayScore[0])>
                                    {{ scoreLetter(todayScore[0]) }}
                                </v-progress-circular>
                            </div>
                            <br>
                            <div class="d-flex justify-center">
                                <v-btn color="primary" @click="endDay" outlined>
                                    {{ $t('message.finishDay') }}
                                </v-btn>
                            </div>
                        </v-card-text>
                    </v-card>
                </div>
            </div>
        </div>
        <div class="d-flex justify-center align-center" style="height: 100%" v-if="!day.day && !loading">
            <v-btn color="primary" @click="startDay">{{ $t('message.startDay') }}!</v-btn>
        </div>
    </div>
</template>
  
<script>

class Day {
  constructor() {
    this.id = Math.floor(Math.random()*100000)
    this.day = new Date().toLocaleDateString()
    this.start = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    this.bedTime = "23:00"
    this.activities = []
    this.additionals = []
    this.evaluation = ''
    this.objectives = []
    this.score = 0
    this.finalized = false
    this.selected = ''
    this.satisfactionScore = 0
    this.performanceScore = 0
    this.accuracyScore = 0
  }
}

class Activity {
    constructor(name) {
        this.id = Math.floor(Math.random()*100000)
        this.name = name
        this.start = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        this.end = null
        this.completed = false
        this.observation = ''
        this.objective = null
        this.campaign = null
        this.task = null
        this.satisfaction = 2
        this.performace = 50
        this.duration = 0
        this.realDuration = 0
    }
}
class Objective {
    constructor(name) {
        this.id = Math.floor(Math.random()*100000)
        this.name = name
        this.campaign = null
        this.completion = 0
        this.description = ''
        this.campaigns = []
        this.activities = []
        this.duration = 0
        this.realDuration = 0
        this.satisfaction = 0
        this.performance = 0
        this.observations = ''
    }
}
class Horario {
    constructor() {
        this.id = Math.floor(Math.random()*100000)
        this.name = 'Horario'
        this.tasks = []
        this.description = ''
    }
}
class Task {
    constructor(name) {
        this.id = Math.floor(Math.random()*100000)
        this.name = name
        this.completed = false
        this.horario = null
        this.campaign = null
    }
}

export default {
    name: 'TodayView',

    data: () => ({
        inputingActivity: '',
        editActivityInfo: null,
        inputingObjective: '',
        editingObjective: null,
        inputingTask: '',
        selectedAdditional: null,
        day: [],
        loading: true,
        inputingHorario: null,
        horarios: [],
        saveData: false,

        errorMargin: 0,
        availableTime: 0,
    }),
    methods: {
        objectiveStats(objective) {
            let availableActivities = []

            objective.activities.forEach(
                activity => availableActivities.push(activity.name)
            )

            let registeredActivities = []

            this.day.activities.forEach(
                activity => { if (activity.end) {registeredActivities.push(activity)} }
            )
            
            let result = registeredActivities.filter(activity => availableActivities.includes(activity.name))

            let realDuration = 0
            result.forEach(activity => realDuration += activity.realDuration)
            objective.realDuration = realDuration

            let satisfaction = 0
            result.forEach(activity => satisfaction += activity.satisfaction)
            objective.satisfaction = parseInt(satisfaction/result.length)

            let performance = 0
            result.forEach(activity => performance += activity.performance)
            objective.performance = parseInt(performance/result.length)
        },
        getActivities(objective) {
            let availableActivities = []

            objective.activities.forEach(
                activity => availableActivities.push(activity.name)
            )

            let registeredActivities = []

            this.day.activities.forEach(
                activity => { if (activity.end) {registeredActivities.push(activity)} }
            )
            
            let result = registeredActivities.filter(activity => availableActivities.includes(activity.name))

            let realDuration = 0
            result.forEach(activity => realDuration += activity.realDuration)
            objective.realDuration = realDuration

            let satisfaction = 0
            result.forEach(activity => satisfaction += activity.satisfaction)
            objective.satisfaction = parseInt(satisfaction/result.length)

            let performance = 0
            result.forEach(activity => performance += activity.performance)
            objective.performance = parseInt(performance/result.length)

            return result
        },
        removeObjectiveActivity(i) {
            this.editingObjective.activities.splice(i, 1)
            this.totalObjectiveTime()
        },
        removeActivity(i) {
            this.day.activities.splice(i, 1)
        },
        totalObjectiveTime() {
            let totalTime = 0
            this.editingObjective.activities.forEach(
                activity => totalTime += parseInt(activity.duration)
            )
            this.editingObjective.duration = totalTime
        },
        addActivity() {
            let activity = new Activity(this.editingObjective.name)
            activity.duration = 45
            activity.start = null

            this.editingObjective.activities.push(
                activity
            )
            this.totalObjectiveTime()
        },
        scrollHorizontal(event) {
            const scrollAmount = event.deltaY * 3;
            document.getElementById('logs-list').scrollLeft += scrollAmount;
            event.preventDefault();
        },
        deleteObjective(i) {
            this.day.objectives.splice(i,1)
        },
        setInputingHorario(horario) {
            if (this.inputingHorario) {
                this.inputingHorario = null
            }
            else {
                this.inputingHorario = horario
            }
        },
        removeTask(i) {
            this.inputingHorario.tasks.splice(i, 1)
        },
        createHorarioTask() {
            let task = new Task(this.inputingTask)
            this.inputingHorario.tasks.push(task)
            this.inputingTask = ''
        },
        saveHorario() {

        },
        newHorario() {
            let horario = new Horario
            this.horarios.push(horario)
            this.inputingHorario = horario
        },
        removeAdditional(i) {
            this.day.additionals.splice(i, 1)
        },
        combinations(event) {
            if (event.metaKey && event.key=='1') {
                this.day.selected = 'logs'
            }
            else if (event.metaKey && event.key=='2') {
                this.day.selected = 'objetivos'
            }
            else if (event.metaKey && event.key=='3') {
                this.day.selected = 'reviews'
            }
        },
        addAdditional() {
            if (this.day.selectedAdditional) {
                if (!this.day.additionals.includes(this.day.selectedAdditional)) {
                    this.day.additionals.push(this.day.selectedAdditional)
                }
                this.day.selectedAdditional = null
                document.getElementById('addAdditional').blur()
            }
        },
        insertTab(e) {
            if (e.key === "Tab") {
                e.preventDefault();
                const textarea = e.target;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const textBeforeCursor = this.editActivityInfo.observation.substring(0, start);
                const textAfterCursor = this.editActivityInfo.observation.substring(end);
                this.editActivityInfo.observation = textBeforeCursor + "    " + textAfterCursor;
                textarea.selectionStart = textarea.selectionEnd = start + 1;
            }
        },
        setTab(tab) {
            if (tab==this.day.selected) {
                this.day.selected = ''
            }
            else {
                this.day.selected = tab
            }
        },
        editInfo(activity) {
            if (this.editActivityInfo==activity) {
                this.editActivityInfo = null
            }
            else {
                this.editActivityInfo = activity
            }
        },
        addLogFromActivity(activity) {
            const clonedActivity = { ...activity };

            clonedActivity.start = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            this.day.activities.push(clonedActivity)
        },
        createActivity() {
            let activity = new Activity(this.inputingActivity)
            this.inputingActivity = ''
            this.day.activities.push(activity)
        },
        calculateLogDuration(activity) {
            if (activity.end) {
                activity.realDuration = parseInt(activity.end.split(':')[0]*60)+parseInt(activity.end.split(':')[1])-(parseInt(activity.start.split(':')[0]*60)+parseInt(activity.start.split(':')[1]))
            }
        },
        completeActivity(activity) {
            if (activity.completed) {
                activity.completed = false
                activity.end = ''
            }
            else {
                activity.completed = true
                activity.end = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                document.getElementById('createActivity').focus()
                this.calculateLogDuration(activity)
            }
        },
        completeObjective(objective) {
            objective.completed = true
            document.getElementById('createObjective').focus()
        },
        createObjective() {
            let objective = new Objective(this.inputingObjective)
            this.inputingObjective = ''
            this.day.objectives.push(objective)
        },
        setEditingObjective(objective) {
            if (this.editingObjective == objective) {
                this.editingObjective = null
            }
            else {
                this.editingObjective = objective
            }
        },
        async startDay() {
            let day = new Day()
            this.day = day
        },
        endDay() {
            this.day.finalized = true
        },
        saveDayData() {
            this.$emit('download')
            this.day.score = this.todayScore[0]
            this.day.accuracyScore = this.todayScore[1]
            this.day.satisfactionScore = this.todayScore[2]
            this.day.performanceScore = this.todayScore[3]

            window.electronAPI.saveToday(this.day)
            this.saveData = false
        },
        calculateAvailableTime() {
            if (this.day.bedTime) {
                let bedtimeMinutes = parseInt(this.day.bedTime.split(':')[0]) * 60 + parseInt(this.day.bedTime.split(':')[1]);

                let errorMarginMinutes = parseInt(this.errorMargin);

                let now = new Date();
                let currentMinutes = now.getHours() * 60 + now.getMinutes();

                const remainingMinutes = bedtimeMinutes - currentMinutes + errorMarginMinutes;

                this.availableTime = remainingMinutes
            }
        },
    },
    computed: {
        usedTime() {
            let total = 0;
            for (let i=0; i<this.day.objectives.length; i++) {
                total += this.day.objectives[i].duration
            }
            return total;
        },
        availableActivities() {
            let availableActivities = []
            let registeredActivities = []

            this.day.activities.forEach(
                activity => registeredActivities.push(activity.name)
            )

            this.day.objectives.forEach(
                objective => availableActivities.push(...objective.activities)
            )

            return availableActivities.filter(activity => !registeredActivities.includes(activity.name))
        },
        todayScore() {
            let objectives = this.day.objectives

            let totalTime = (parseInt(this.day.bedTime.split(':')[0])*60+parseInt(this.day.bedTime.split(':')[1])) - (parseInt(this.day.start.split(':')[0])*60+parseInt(this.day.start.split(':')[1]))

            let performanceScore = 0
            objectives.forEach(activity => performanceScore += activity.performance*activity.realDuration)
            performanceScore /= totalTime

            let satisfactionScore = 0

            if (objectives.length) {
                objectives.forEach(activity => satisfactionScore += (activity.satisfaction+1)*20)
                satisfactionScore /= objectives.length
            }

            let accuracyScore = 0

            if (objectives.length) {
                for (let i=0; i<objectives.length; i++) {
                    let activities = this.getActivities(objectives[i])
                    let accuracy = 0

                    activities.forEach(activity => accuracy += Math.abs((activity.realDuration-parseInt(activity.duration))/parseInt(activity.duration))*100)

                    accuracy /= activities.length

                    accuracyScore += accuracy
                }
                accuracyScore /= objectives.length
                accuracyScore = Math.max(100 - accuracyScore, 0)
            }

            let totalScore = (accuracyScore + performanceScore + satisfactionScore)/3

            return [
                isNaN(totalScore) ? 0 : totalScore,
                isNaN(accuracyScore) ? 0 : accuracyScore,
                isNaN(satisfactionScore) ? 0 : satisfactionScore,
                isNaN(performanceScore) ? 0 : performanceScore
            ]
        },
        performanceColor() {
            return (performace) => {
                if (performace<=20) {
                    return  'error'
                }
                else if (performace<=40) {
                    return  'orange'
                }
                else if (performace<=60) {
                    return  'amber'
                }
                else if (performace<=80) {
                    return  'success'
                }
            }
        },
        scoreLetter() {
            return (score) => {
              if (score < 0 || score > 100) {
                return "Invalid Score";
              }

              if (score >= 92) {
                return "S+";
              } else if (score >= 86) {
                return "S";
              } else if (score >= 80) {
                return "S-";
              } else if (score >= 74) {
                return "A+";
              } else if (score >= 68) {
                return "A";
              } else if (score >= 62) {
                return "A-";
              } else if (score >= 56) {
                return "B+";
              } else if (score >= 50) {
                return "B";
              } else if (score >= 43) {
                return "B-";
              } else if (score >= 36) {
                return "C+";
              } else if (score >= 29) {
                return "C";
              } else if (score >= 21) {
                return "C-";
              } else if (score >= 13) {
                return "D+";
              } else if (score >= 5) {
                return "D";
              } else {
                return "D-";
              }
            }
        },
        scoreColor() {
            return (score) => {
                if (score<=33) {return 'red'}
                else if (score<=66) {return 'amber'}
                else if (score<=100) {return 'success'}
                else {return 'primary'}
            }
        }
    },
    async created() {
        const message = await new Promise(resolve => {
            window.electronAPI.getToday()
            window.electronAPI.response('get-today-response', resolve)
        })

        const campaigns = await new Promise(resolve => {
            window.electronAPI.getCampaigns()
            window.electronAPI.response('get-campaigns-response', resolve)
        })

        this.campaigns = campaigns

        if (message) {
            const dayInstance = new Day();
            for (const key of Object.keys(message)) {
                dayInstance[key] = message[key];
            }
            this.day = dayInstance
        }
        else {
            this.loading = false
        }
        this.saveData = false
    },
    mounted() {
        this.calculateAvailableTime()

        setInterval(()=>{
            if (this.saveData) {
                this.saveDayData()
            }
        }, 200)

        setInterval(()=>{
            this.calculateAvailableTime()
        }, 1000*60)
    },
    watch: {
        day: {
            deep: true,
            handler() {
                this.saveData = true
            }
        },
    }
};

</script>

<style scoped>

#today {
    height: calc(100vh - 72px);
    width: 100h;
    overflow: hidden;
    padding: 20px;
}
#today input {
    color: var(--text-primary);
}
.day {
    position: absolute;
    top: -30px;
    -webkit-app-region: drag;
    width: 80px;
    left: calc(50% - 60px);
    user-select: none;
}
.column {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.tabs {
    display: flex;
    width: 100%;
    height: fit-content;
    justify-content: center;
    transform: translateY(1px);
    z-index: 3;
}
.tab {
    text-align: center;
    user-select: none;
    width: 20%;
    border: 1px solid var(--background-dark);
    border-color: var(--background);
    border-bottom: 1px solid var(--background-alt);
    border-radius: 5px 5px 0px 0px;
    padding-top: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 2px;
}
.tab-inner {
    border-radius: 3px;
    margin-left: 2px;
    margin-right: 2px;
    padding-top: 1px;
    padding-bottom: 1px;
    height: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.tab-inner:hover {
    background: rgba(255,255,255,.15);
}
.selected-tab  {
    border-top-color: var(--background-dark);
    border-left-color: var(--background-dark);
    border-right-color: var(--background-dark);
    border-bottom: 1px solid var(--background);
}
.tab-smoother {
    border: 1px solid var(--background);
    height: 10px;
    width: 8px;
    align-self: flex-end;
    transform: translateY(-1px);
    display: flex;
    position: relative;
}
.tab-smoother:before {
    content: '';
    height: 10px;
    width: 10px;
    position: absolute;
    transform: translateX(-2px);
    background: var(--background);
}
.tab-smoother-inner-left {
    height: 10px;
    width: 10px;
    background: var(--background);
    border: 1px solid var(--background-dark);
    border-top: none;
    border-radius: 0px 0px 0px 3px;
    border-right: none;
    transform: translateX(-2px);
    position: absolute;
    left: 0px;
}
.tab-smoother-inner-right {
    height: 10px;
    width: 10px;
    background: var(--background);
    border: 1px solid var(--background-dark);
    border-top: none;
    border-left: none;
    border-radius: 0px 0px 3px 0px;
    transform: translateX(-2px);
    position: absolute;
    right: -4px;
}
.tab-smoother-filler {
    height: 10px;
    width: 10px;
    background: var(--background);
    border-bottom: 1px solid var(--background-alt);
    border-right: none;
    transform: translateX(-2px);
    position: absolute;
    left: 0px;
}
.tab-smoother-inner {
    height: 10px;
    width: 10px;
    background: var(--background);
    border: 1px solid var(--background-dark);
    border-top: none;
    border-radius: 0px 0px 3px 3px;
    transform: translateX(-2px);
}
.frame {
    width: 100%;
    height: 100%;
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: scroll;
}
.container {
    height: 100px;
    flex: 1;
    border: 1px solid var(--background-alt);
    border-radius: 10px;
    position: relative;
    z-index: 1;
}
.has-selected-tab .container{
    border-color: var(--background-dark);
}
.has-selected-tab .tab:not(.selected-tab) {
    border-bottom-color: var(--background-dark);
}
.has-selected-tab .tab-smoother-filler {
    border-color: var(--background-dark);
}
.create-activity {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 25%;
}
.observations {
    flex: 1;
    height: 100%;
}
.activities {
    flex: 1;
    height: 100%;
}

.activity {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.activity-input {
    padding: 0px;
    margin-left: 15px;
    padding-left: 5px;
    border-left: 1px solid var(--background-dark);
    outline: none;
    width: 100%;
}
.time-input {
    padding: 0px;
    margin: 0px;
    min-width: 45px !important;
    outline: none;
}
.objetives {
    flex: 1;
    height: 100%;
}
.objetive-details {
    flex: 1;
    height: 100%;
}
.objective {
    user-select: none;
}
.tasks {
    display: flex;
    flex-direction: column;
}
.task {
    display: flex;
    justify-content: center;
    align-items: center;
}
.frame-section {
    width: 80%;
    margin-left: 10%;
}
.frame-object {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}
.object-review {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 10px;
}
.object-task-review {
    margin-left: 60px;
    padding-left: 10px;
    width: calc(100% - 60px);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-left: 1px solid var(--background-dark);
}
input[type="time"]::-webkit-calendar-picker-indicator {
    display: none;
}
#logs-menu {
    height: 40px;
    border-radius: 10px;
    width: calc(100% + 40px);
    margin-top: -20px;
    margin-left: -20px;
    margin-right: -20px;
    margin-bottom: 0px;
}
#logs-list {
    flex: 1;
    overflow-x: scroll;
    padding-left: 10px;
    padding-right: 10px;
    gap: 10px;
    scroll-behavior: smooth;
}

#schedules-menu {
    height: 40px;
    border-radius: 10px;
    width: calc(100% + 40px);
    margin-top: -20px;
    margin-left: -20px;
    margin-right: -20px;
    margin-bottom: 0px;
}
#schedules-list {
    flex: 1;
    overflow-x: scroll;
    padding-left: 10px;
    padding-right: 10px;
    gap: 10px;
    scroll-behavior: smooth;
}

.scrollbar-x::-webkit-scrollbar {
    height: 3px;
}
.scrollbar-x::-webkit-scrollbar-track {
    background: var(--background-alt);
}
.scrollbar-x::-webkit-scrollbar-thumb {
    background: var(--border);
}
.scrollbar-x::-webkit-scrollbar-thumb:hover {
    background: var(--border-accent);
}

#objectives {
    width: 50%;
    height: 100%;
}
#objectives-configuration {
    width: 50%;
    height: 100%;
}

</style>
  