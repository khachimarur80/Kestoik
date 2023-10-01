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
                                id="createActivity"
                                placeholder="New log ..."
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
                                    <v-btn color="primary" icon tile @click="editInfo(activity)" v-if="editActivityInfo!=activity">
                                        <v-icon>
                                            mdi-comment-text-outline
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
                                    <v-spacer></v-spacer>
                                    <v-btn color="success" icon tile @click="editInfo(editActivityInfo)">
                                        <v-icon>
                                            mdi-file-document-check-outline
                                        </v-icon>
                                    </v-btn>
                                </div>
                                <div class="text-h6 ml-2">
                                    Description
                                </div>
                                <v-textarea 
                                    no-resize
                                    auto-grow
                                    v-model="editActivityInfo.observation"
                                    dense
                                    autofocus
                                    @keydown.tab.prevent="insertTab"
                                    :rows="1"
                                    outlined
                                    class="ma-2"
                                >

                                </v-textarea>
                            </v-card>
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
                                id="createObjective"
                                placeholder="New objective ..."
                                >
                            </v-text-field>
                        </div>
                    </div>
                    <div class="d-flex" style="width: 100%; height: calc(100% - 60px); gap: 10px;">
                        <div class="activities">
                            <v-card width="100%" style="min-height: 100%;" class="pa-2">
                                <div v-for="(objective, i)  in day.objectives" :key="i" @mousedown="setEditingObjective(objective)" class="objective text d-flex mb-2">
                                    {{ objective.name }}
                                    <v-spacer></v-spacer>
                                    <v-btn icon dense x-small color="error" @mousedown.stop @click="deleteObjective(i)">
                                        <v-icon>
                                            mdi-delete
                                        </v-icon>
                                    </v-btn>
                                </div>
                            </v-card>
                        </div>
                        <div class="observations" v-if="editingObjective">
                            <v-card width="100%" height="100%" class="pa-2">
                                <div class="text-h5">
                                    <input style="outline: none;" v-model="editingObjective.name">
                                </div>
                                <div class="text-h6 mt-3 mb-3">Campaigns</div>
                                <div class="d-flex align-center">
                                    <v-spacer></v-spacer>
                                    <v-combobox
                                        clearable
                                        hide-selected
                                        multiple
                                        small-chips
                                        :items="campaigns"
                                        item-text="name"
                                        v-model="editingObjective.campaigns"
                                    ></v-combobox>
                                    <v-spacer></v-spacer>
                                </div>
                                <div class="text-h6 mt-3 mb-3">Description</div>
                                <v-textarea 
                                    class="objective-description" 
                                    v-model="editingObjective.description"
                                    :rows="1"
                                    auto-grow
                                    outlined
                                >
                                </v-textarea>
                            </v-card>
                        </div>
                    </div>
                </div>
                <div class="frame" v-show="day.selected=='reviews'">
                    <v-card style="min-height: 100%" width="100%" class="pa-2">
                        <div class="activities">
                            <div class="frame-section">
                                    <div class="text-h6 mb-2">Objectives</div>
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
                                <div class="text-h6 mb-2">Evaluation</div>
                                <br>
                                <v-textarea 
                                    no-resize
                                    auto-grow
                                    v-model="day.evaluation"
                                    dense
                                    autofocus
                                    @keydown.tab.prevent="insertTab"
                                    :rows="1"
                                    outlined
                                >

                                </v-textarea>
                                <div style="display: flex; justify-content: center; position:absolute; top: 20px; right: 20px;">
                                    <v-progress-circular :value="todayScore" width="5" size="50" :color=scoreColor(todayScore)>
                                        {{ scoreLetter(todayScore) }}
                                    </v-progress-circular>
                                </div>
                                <br>
                                <div class="d-flex justify-center">
                                    <v-btn color="primary" @click="endDay" outlined>
                                        Finish Day
                                    </v-btn>
                                </div>
                            </div>
                            <br>
                        </div>
                    </v-card>
                </div>
                <!--<div class="frame" v-show="day.selected=='horarios'">
                    <div class="horarios d-flex">
                        <v-btn icon dense @click="newHorario">
                            <v-icon>
                                mdi-plus
                            </v-icon>
                        </v-btn>
                        <v-btn
                            v-for="(horario, i) in horarios" :key="i"
                            outlined
                            @click="setInputingHorario(horario)"
                            class="ml-1 mr-1"
                        >
                            {{ horario.name }}
                        </v-btn>
                    </div>
                    <div class="horario" style="gap: 20px;" v-if="inputingHorario">
                        <div class="tareas">
                            <v-card width="100%" height="100%" class="pa-2">
                                <div class="tarea" v-for="(tarea, i) in inputingHorario.tasks" :key="i">
                                    <v-checkbox v-model="tarea.completed"
                                        dense
                                        hide-details
                                        :label="tarea.name"
                                    >
                                    </v-checkbox>
                                </div>
                            </v-card>
                        </div>
                        <div class="horario-editor">
                            <v-card width="100%" height="100%" class="pa-2">
                                <div class="text-h5 pb-2">
                                    <input style="outline: none;"
                                        dense
                                        hide-details
                                        v-model="inputingHorario.name"
                                    >
                                </div>
                                <div class="text-h6 pb-2">Description</div>
                                <v-textarea
                                    outlined
                                    dense
                                    hide-details
                                    no-resize
                                    :rows="1"
                                    v-model="inputingHorario.description"
                                    class="mb-2"
                                ></v-textarea>
                                <div class="text-h6 pb-2">Tasks</div>
                                <div class="d-flex mt-2 mb-2">
                                    <v-spacer></v-spacer>
                                    <v-text-field 
                                        hide-details 
                                        solo 
                                        dense 
                                        outlined 
                                        flat 
                                        @keydown.enter="createHorarioTask"
                                        v-model="inputingTask"
                                        placeholder="New task ..."
                                        >
                                    </v-text-field>
                                    <v-spacer></v-spacer>
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
                            </v-card>
                        </div>
                    </div>
                </div>-->
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
    this.id = Math.floor(Math.random()*100000)
    this.day = new Date().toLocaleDateString()
    this.activities = []
    this.additionals = []
    this.evaluation = ''
    this.objectives = []
    this.score = 0
    this.finalized = false
    this.selected = ''
    this.horario = null
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
        //this.task = null
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
    }),
    methods: {
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
            this.saveData = false
        }
    },
    computed: {
        todayScore() {
            const objectives = this.day.objectives;
            const n = objectives.length + 3;

            if (objectives.length === 0) {
            return 0;
            }

            const totalScore = objectives.reduce((sum, objective) => sum + objective.completion, 0);
            const averageScore = totalScore / objectives.length;
            const radius = averageScore / 100;

            const logN = Math.log(n) / Math.log(10);

            const score = (((n * Math.pow(radius, 2) * Math.sin((2 * Math.PI) / n)) / 2) / (Math.PI * 1)) * 100 * logN;

            return parseInt(Math.min(Math.max(score, 0), 100));
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
        setInterval(()=>{
            if (this.saveData) {
                this.saveDayData()
            }
        }, 200)
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
    gap: 20px;
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
.activities {
    flex: 1;
    height: 100%;
    overflow: scroll;
}
.observations {
    flex: 1;
    height: 100%;
    overflow: scroll;
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
.horario {
    width: 100%;
    flex: 1;
    display: flex;
}
.tareas {
    height: 100%;
    flex: 1;
}
.horario-editor {
    height: 100%;
    flex: 1;
}
.tarea {
    width: 100%;
    display: flex;
    align-items: center;
}
</style>
  