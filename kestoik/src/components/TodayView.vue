<template>
    <div id="today" :class="{'has-selected-tab' : selected!=''}">
        <div class="day" v-if="day">
            <h2>{{ day.day }}</h2>
        </div>
        <div v-if="day" style="height: 100%; width: 100%; display: flex; flex-direction: column;">
            <div class="tabs">
                <div class="tab-smoother">
                    <div class="tab-smoother-inner-right" style="width: 10px;" v-show="selected=='logs'">
                    </div>
                    <div class="tab-smoother-filler" v-show="selected!='logs'"></div>
                </div>
                <div class="tab" :class="{ 'selected-tab' : selected=='logs' }">
                    <div class="tab-inner" @click="setTab('logs')">
                        Logs
                    </div>
                </div>
                <div class="tab-smoother">
                    <div class="tab-smoother-inner-left" v-show="selected=='logs'">
                    </div>
                    <div class="tab-smoother-inner-right" v-show="selected=='objetivos'">
                    </div>
                    <div class="tab-smoother-filler" v-show="selected=='reviews' || selected==''"></div>
                </div>
                <div class="tab" :class="{ 'selected-tab' : selected=='objetivos' }">
                    <div class="tab-inner" @click="setTab('objetivos')">
                        Objetivos
                    </div>
                </div>
                <div class="tab-smoother">
                    <div class="tab-smoother-inner-left" v-show="selected=='objetivos'">
                    </div>
                    <div class="tab-smoother-inner-right" v-show="selected=='reviews'">
                    </div>
                    <div class="tab-smoother-filler" v-show="selected=='logs' || selected==''"></div>
                </div>
                <div class="tab" :class="{ 'selected-tab' : selected=='reviews' }">
                    <div class="tab-inner" @click="setTab('reviews')">
                        Reviews
                    </div>
                </div>
                <div class="tab-smoother">
                    <div class="tab-smoother-inner-left" style="width: 10px" v-show="selected=='reviews'">
                    </div>
                    <div class="tab-smoother-filler" v-show="selected!='reviews'"></div>
                </div>
            </div>
            <div class="container">
                <div class="frame" v-show="selected=='logs'">
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
                                <v-btn color="success" icon tile :disabled="activity.completed" @click="completeActivity(activity)">
                                    <v-icon>
                                        mdi-check
                                    </v-icon>
                                </v-btn>
                                <span>{{ activity.start }} - </span>
                                <span v-if="activity.end"> {{ activity.end }}</span>
                                <input class="activity-input"
                                    v-model="activity.name"
                                    :disabled="activity.completed"
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
                <div class="frame" v-show="selected=='objetivos'">
                    <div class="d-flex align-center" style="height: 100%;">
                        <div class="objetives">
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
                            <br>
                            <div v-for="(objective, i)  in day.objectives" :key="i" @mousedown="setEditingObjective(objective)" class="objective">
                                {{ objective.name }}
                            </div>
                        </div>
                        <div class="objetive-details" v-if="editingObjective">
                            <input class="objective-title" v-model="editingObjective.name">
                            <br><br>
                            <h3>Description</h3>
                            <v-textarea 
                                class="objective-description" 
                                v-model="editingObjective.description"
                                :rows="2"
                                auto-grow
                                outlined
                            >
                            </v-textarea>
                            <h3>Tasks</h3>
                            <div class="tasks">
                                <v-text-field
                                    hide-details 
                                    solo 
                                    dense 
                                    outlined 
                                    flat 
                                    autofocus 
                                    @keydown.enter="createTask" 
                                    v-model="inputingTask"
                                    style="width: 50%; margin-left: 25%;"
                                >
                                </v-text-field>
                                <br>
                                <div v-for="(task, i) in editingObjective.tasks" :key="i" class="task">
                                    <span>{{task.name}}</span>
                                    <v-btn @click="deleteTask(i)" x-small dense icon>
                                        <v-icon>
                                            mdi-close
                                        </v-icon>
                                    </v-btn>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="frame" v-show="selected=='reviews'">
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
                            <div v-for="(task, j) in objective.tasks" :key="j" class="object-task-review">
                                <span>{{ task.name }}</span>
                                <v-spacer></v-spacer>
                                <div style="width: 120px; margin-left: 20px;">
                                    <v-slider v-model="task.completion" hide-details></v-slider>
                                </div>
                                <div class="d-flex">
                                    <v-btn color="success" x-small dense icon @click="task.completion=100">
                                        <v-icon>
                                            mdi-check
                                        </v-icon>
                                    </v-btn>
                                    <v-btn color="error" x-small dense icon @click="task.completion=0">
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
                            <v-progress-circular :value="todayScore" width="5" size="50" color="primary">
                                {{ todayScore }}
                            </v-progress-circular>
                        </div>
                        <br>
                        <div class="d-flex justify-center">
                            <v-btn color="primary" @click="endDay">
                                Finish Day
                            </v-btn>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex justify-center align-center" style="height: 100%" v-if="!day && !loading">
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
        this.tasks = []
    }
}
class Task {
    constructor(name) {
        this.name = name
        this.completion = 0
    }
}

export default {
    name: 'TodayView',

    data: () => ({
        selected: '',
        inputingActivity: '',
        editActivityInfo: null,
        inputingObjective: '',
        editingObjective: null,
        inputingTask: '',
        selectedAdditional: null,
        day: null,
        loading: true,
    }),
    methods: {
        removeAdditional(i) {
            this.day.additionals.splice(i, 1)
        },
        combinations(event) {
            if (event.metaKey && event.key=='1') {
                this.selected = 'logs'
            }
            else if (event.metaKey && event.key=='2') {
                this.selected = 'objetivos'
            }
            else if (event.metaKey && event.key=='3') {
                this.selected = 'reviews'
            }
        },
        addAdditional() {
            if (this.selectedAdditional) {
                if (!this.day.additionals.includes(this.selectedAdditional)) {
                    this.day.additionals.push(this.selectedAdditional)
                }
                this.selectedAdditional = null
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
            if (tab==this.selected) {
                this.selected = ''
            }
            else {
                this.selected = tab
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
            activity.completed = true
            activity.end = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            document.getElementById('createActivity').focus()
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
        createTask() {
            let task = new Task(this.inputingTask)
            this.editingObjective.tasks.push(task)
            this.inputingTask = ''
        },
        deleteTask(i) {
            this.editingObjective.tasks.splice(i, 1)
        },
        async startDay() {
            let day = new Day()
            this.day = day
        },
        endDay() {
            this.day.score = this.todayScore
            this.$emit('download')
            this.day.finalized = true
        },
        saveDayData() {
            this.day.score = this.todayScore
            window.electronAPI.saveToday(this.day)
        }
    },
    computed: {
        todayScore() {
            let score = 0;
            for (let i=0; i<this.day.objectives.length; i++) {
                if (this.day.objectives[i].tasks.length) {
                    let total = 0;
                    for (let j=0; j<this.day.objectives[i].tasks.length; j++) {
                        total += this.day.objectives[i].tasks[j].completion
                    }
                    score += total/this.day.objectives[i].tasks.length
                }
                else {
                    score += this.day.objectives[i].completion
                }
            }
            if (this.day.objectives.length) {
                return parseInt(score/this.day.objectives.length)
            }
            else {
                return 0
            }
        },
    },
    async created() {
        const message = await new Promise(resolve => {
            window.electronAPI.getToday()
            window.electronAPI.response('get-today-response', resolve)
        })

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
    height: 100%;
    width: 100%;
    padding: 20px;
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
    border: 1px solid #aaa;
    border-color: #fff;
    border-bottom: 1px solid #ddd;
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
    background: rgba(0,0,0,.15);
}
.selected-tab  {
    border-top-color: #aaa;
    border-left-color: #aaa;
    border-right-color: #aaa;
    border-bottom: 1px solid #fff;
}
.tab-smoother {
    border: 1px solid #fff;
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
    background: #fff;
}
.tab-smoother-inner-left {
    height: 10px;
    width: 10px;
    background: #fff;
    border: 1px solid #aaa;
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
    background: #fff;
    border: 1px solid #aaa;
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
    background: #fff;
    border-bottom: 1px solid #ddd;
    border-right: none;
    transform: translateX(-2px);
    position: absolute;
    left: 0px;
}
.tab-smoother-inner {
    height: 10px;
    width: 10px;
    background: #fff;
    border: 1px solid #aaa;
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
}
.container {
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 10px;
    position: relative;
    z-index: 1;
}
.has-selected-tab .container{
    border-color: #aaa;
}
.has-selected-tab .tab:not(.selected-tab) {
    border-bottom-color: #aaa;
}
.has-selected-tab .tab-smoother-filler {
    border-color: #aaa;
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
    border-left: 1px solid #aaa;
    outline: none;
}
.objective-title {
    font-weight: bolder;
    font-size: 24px;
    text-align: center;
    width: 100%;
}
.objetives {
    width: 100%;
    height: 100%;
}
.objetive-details {
    width: 100%;
    height: 100%;
    border-left: 1px solid #aaa;
    padding: 20px;
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
    border-left: 1px solid #aaa;
}
.object-task-review {
    margin-left: 60px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-left: 1px solid #aaa;
}
</style>
  