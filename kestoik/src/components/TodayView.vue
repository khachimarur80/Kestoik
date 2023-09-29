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
                        Logs
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
                        Objetivos
                    </div>
                </div>
                <div class="tab-smoother">
                    <div class="tab-smoother-inner-left" v-show="day.selected=='objetivos'">
                    </div>
                    <div class="tab-smoother-inner-right" v-show="day.selected=='horarios'">
                    </div>
                    <div class="tab-smoother-filler" v-show="day.selected=='logs' || day.selected=='' || day.selected=='reviews'"></div>
                </div>
                <div class="tab" :class="{ 'selected-tab' : day.selected=='horarios' }">
                    <div class="tab-inner" @click="setTab('horarios')">
                        Horarios
                    </div>
                </div>
                <div class="tab-smoother">
                    <div class="tab-smoother-inner-left" v-show="day.selected=='horarios'">
                    </div>
                    <div class="tab-smoother-inner-right" v-show="day.selected=='reviews'">
                    </div>
                    <div class="tab-smoother-filler" v-show="day.selected=='logs' || day.selected=='' || day.selected=='objetivos'"></div>
                </div>
                <div class="tab" :class="{ 'selected-tab' : day.selected=='reviews' }">
                    <div class="tab-inner" @click="setTab('reviews')">
                        Review
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
                    <div class="create-activity">
                        <div class="d-flex align-center">
                            <v-text-field 
                                hide-details 
                                solo 
                                dense 
                                outlined 
                                flat 
                                autofocus 
                                @keydown.enter="createActivity"
                                v-model="inputingActivity" 
                                id="createActivity">
                            </v-text-field>
                        </div>
                    </div>
                    <div class="d-flex" style="width: 100%; height: calc(100% - 40px)">
                        <div class="activities">
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
                                >
                                <span class="mr-1 ml-1">-</span>
                                <input v-if="activity.end"
                                    class="time-input"
                                    v-model="activity.end"
                                    type="time"
                                    hide-details="auto"
                                >
                                <input class="activity-input"
                                    v-model="activity.name"
                                >
                                <v-spacer></v-spacer>
                                <v-btn color="success" icon tile @click="editInfo(activity)" v-if="editActivityInfo==activity">
                                    <v-icon>
                                        mdi-file-document-check-outline
                                    </v-icon>
                                </v-btn>
                                <v-btn color="primary" icon tile @click="editInfo(activity)" v-else>
                                    <v-icon>
                                        mdi-comment-text-outline
                                    </v-icon>
                                </v-btn>
                            </div>
                        </div>
                        <div class="observations" v-if="editActivityInfo">
                            <v-textarea 
                                no-resize
                                auto-grow
                                v-model="editActivityInfo.observation"
                                dense
                                autofocus
                                @keydown.tab.prevent="insertTab"
                                :rows="2"
                                outlined
                            >

                            </v-textarea>
                        </div>
                    </div>
                </div>
                <div class="frame" v-show="day.selected=='objetivos'">
                    <div class="create-activity">
                        <div class="d-flex align-center">
                            <v-text-field
                                hide-details 
                                solo 
                                dense 
                                outlined 
                                flat 
                                autofocus 
                                @keydown.enter="createObjective" 
                                v-model="inputingObjective" 
                                id="createObjective">
                            </v-text-field>
                        </div>
                    </div>
                    <div class="d-flex" style="gap: 10px; height: 100%;">
                        <div class="objetives">
                            <v-card width="100%" height="100%" class="pa-2">
                                <div v-for="(objective, i)  in day.objectives" :key="i" @mousedown="setEditingObjective(objective)" class="objective text">
                                    {{ objective.name }}
                                </div>
                            </v-card>
                        </div>
                        <div class="objetive-details" v-if="editingObjective">
                            <v-card width="100%" height="100%" class="pa-2">
                                <div class="text-h4">
                                    <input style="outline: none;" v-model="editingObjective.name">
                                </div>
                                <div class="text-h6 mt-3 mb-3">Campaign</div>
                                <v-autocomplete :items="campaigns">
                                </v-autocomplete>
                                <div class="text-h6 mt-3 mb-3">Description</div>
                                <v-textarea 
                                    class="objective-description" 
                                    v-model="editingObjective.description"
                                    :rows="2"
                                    auto-grow
                                    outlined
                                >
                                </v-textarea>
                            </v-card>
                        </div>
                    </div>
                </div>
                <div class="frame" v-show="day.selected=='reviews'">
                    <div class="frame-section">
                        <h3>Objectives</h3>
                        <div v-for="(objective, i) in day.objectives" :key="i" class="frame-object">
                            <div class="object-review">
                                <span>{{ objective.name }}</span>
                                <v-spacer></v-spacer>
                                <div style="width: 120px; margin-left: 20px;">
                                    <v-slider v-model="objective.completion" hide-details></v-slider>
                                </div>
                                <div class="d-flex">
                                    <v-btn color="success" x-small dense icon @click="objective.completion=100">
                                        <v-icon>
                                            mdi-check
                                        </v-icon>
                                    </v-btn>
                                    <v-btn color="error" x-small dense icon @click="objective.completion=0">
                                        <v-icon>
                                            mdi-close
                                        </v-icon>
                                    </v-btn>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="frame-section">
                        <h3>Additional</h3>
                        <v-autocomplete 
                            v-model="selectedAdditional"
                            :items="day.activities"
                            auto-select-first
                            item-text="name"
                            @keydown.enter="addAdditional"
                            id="addAdditional"
                            style="width: 150px;"
                        ></v-autocomplete>
                        <br>
                        <div v-for="(activity, i) in day.additionals" :key="i" class="task">
                            <span>{{ activity }}</span>
                            <v-btn  x-small dense icon @click="removeAdditional(i)">
                                <v-icon>
                                    mdi-close
                                </v-icon>
                            </v-btn>
                        </div>
                    </div>
                    <div class="frame-section">
                        <h3>Evaluation</h3>
                        <br>
                        <v-textarea 
                            no-resize
                            auto-grow
                            v-model="day.evaluation"
                            dense
                            autofocus
                            @keydown.tab.prevent="insertTab"
                            :rows="2"
                            outlined
                        >

                        </v-textarea>
                        <div style="display: flex; justify-content: center; position:absolute; top: 20px; right: 20px;">
                            <v-progress-circular :value="todayScore" width="5" size="50" :color=scoreColor(todayScore)>
                                {{ todayScore }}
                            </v-progress-circular>
                        </div>
                        <br>
                        <div class="d-flex justify-center">
                            <v-btn color="primary" @click="endDay" outlined>
                                Finish Day
                            </v-btn>
                        </div>
                    </div>
                </div>
                <div class="frame" v-show="day.selected=='horarios'">
                    <div class="horarios d-flex">
                        <v-btn icon dense @click="newHorario">
                            <v-icon>
                                mdi-plus
                            </v-icon>
                        </v-btn>
                        <v-btn
                            v-for="(horario, i) in horarios" :key="i"
                            outlined
                            @click="inputingHorario=horario"
                            class="ml-1 mr-1"
                        >
                            {{ horario.name }}
                        </v-btn>
                    </div>
                    <div class="horario">
                        <div class="tareas" v-if="inputingHorario">
                            <div class="tarea" v-for="(tarea, i) in inputingHorario.tasks" :key="i">
                                <v-checkbox v-model="tarea.completed"
                                    dense
                                    hide-details
                                    :label="tarea.name"
                                >
                                </v-checkbox>
                            </div>
                        </div>
                        <div class="horario-editor" v-if="inputingHorario">
                            <v-card width="300" class="ma-3">
                                <v-card-title>
                                    <v-text-field
                                        dense
                                        hide-details
                                        v-model="inputingHorario.name"
                                    >
                                    </v-text-field>
                                </v-card-title>
                                <v-card-text>
                                    <h3>Description</h3>
                                    <v-textarea
                                        outlined
                                        dense
                                        hide-details
                                        no-resize
                                        :rows="2"
                                        v-model="inputingHorario.description"
                                        class="mb-2"
                                    >
                                    </v-textarea>
                                    <h3>Tasks</h3>
                                    <div class="d-flex align-center mt-2 mb-2" style="width: 50%;">
                                        <v-text-field 
                                            hide-details 
                                            solo 
                                            dense 
                                            outlined 
                                            flat 
                                            @keydown.enter="createHorarioTask"
                                            v-model="inputingTask" 
                                            >
                                        </v-text-field>
                                    </div>
                                    <div class="d-flex flex-wrap">
                                        <v-chip 
                                            v-for="(task, i) in inputingHorario.tasks" 
                                            :key="i"
                                            close
                                            label
                                            @click:close="removeTask(i)"
                                            class="ma-1"
                                        >{{ task.name }} </v-chip>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex justify-center align-center" style="height: 100%" v-if="!day.day && !loading">
            <v-btn color="primary" @click="startDay">Start day!</v-btn>
        </div>
    </div>
</template>
  
<script>

class Day {
  constructor() {
    this.day = new Date().toLocaleDateString()
    this.activities = []
    this.additionals = []
    this.evaluation = ''
    this.objectives = []
    this.score = 0
    this.finalized = false
    this.selected = ''
  }
}

class Activity {
    constructor(name) {
        this.name = name
        this.start = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        this.end = null
        this.completed = false
        this.observation = ''
        this.objective = null
    }
}
class Objective {
    constructor(name) {
        this.name = name
        this.campaign = null
        this.completion = 0
        this.description = ''
        this.campaign = null
        this.task = null
    }
}
class Horario {
    constructor() {
        this.name = 'Horario'
        this.tasks = []
        this.description = ''
    }
}
class Task {
    constructor(name) {
        this.name = name
        this.completed = false
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
    }),
    methods: {
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
        createActivity() {
            let activity = new Activity(this.inputingActivity)
            this.inputingActivity = ''
            this.day.activities.push(activity)
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
            this.day.score = this.todayScore
            window.electronAPI.saveToday(this.day)
        }
    },
    computed: {
        todayScore() {
            let score = 0;
            for (let i=0; i<this.day.objectives.length; i++) {
                score += this.day.objectives[i].completion
            }
            if (this.day.objectives.length) {
                return parseInt(score/this.day.objectives.length)
            }
            else {
                return 0
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

        console.log(campaigns)

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
    },
    watch: {
        day: {
            deep: true,
            handler() {
                this.saveDayData()
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
    color: #fff !important;
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
    border: 1px solid #fff;
    border-color: rgb(19,19,19);
    border-bottom: 1px solid #888;
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
    border-top-color: #fff;
    border-left-color: #fff;
    border-right-color: #fff;
    border-bottom: 1px solid rgb(19,19,19);
}
.tab-smoother {
    border: 1px solid rgb(19,19,19);
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
    background: rgb(19,19,19);
}
.tab-smoother-inner-left {
    height: 10px;
    width: 10px;
    background: rgb(19,19,19);
    border: 1px solid #fff;
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
    background: rgb(19,19,19);
    border: 1px solid #fff;
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
    background: rgb(19,19,19);
    border-bottom: 1px solid #888;
    border-right: none;
    transform: translateX(-2px);
    position: absolute;
    left: 0px;
}
.tab-smoother-inner {
    height: 10px;
    width: 10px;
    background: rgb(19,19,19);
    border: 1px solid #fff;
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
    gap: 20px;
    overflow: scroll;
}
.container {
    height: 100px;
    flex: 1;
    border: 1px solid #888;
    border-radius: 10px;
    position: relative;
    z-index: 1;
}
.has-selected-tab .container{
    border-color: #fff;
}
.has-selected-tab .tab:not(.selected-tab) {
    border-bottom-color: #fff;
}
.has-selected-tab .tab-smoother-filler {
    border-color: #fff;
}
.create-activity {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 25%;
}
.activities {
    flex: 1;
    height: 100%;
    overflow: scroll;
}
.observations {
    width: 250px;
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
    border-left: 1px solid #fff;
    outline: none;
}
.time-input {
    padding: 0px;
    margin: 0px;
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
    border-left: 1px solid #fff;
}
.object-task-review {
    margin-left: 60px;
    padding-left: 10px;
    width: calc(100% - 60px);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-left: 1px solid #fff;
}
input[type="time"]::-webkit-calendar-picker-indicator {
    display: none;
}
.horario {
    width: 100%;
    flex: 1;
    display: flex;
}
.tareas {
    height: 100%;
    flex: 1;
}
.tarea {
    width: 100%;
    display: flex;
    align-items: center;
}
</style>
  