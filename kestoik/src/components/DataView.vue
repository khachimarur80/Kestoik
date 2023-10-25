<template>
    <div id="progress">
        <div class="container">
            <div class="text-h4 mb-3">{{ $t('message.score') }}</div>
            <div style="width:100%" class="d-flex pa-3 align-center flex-column">
                <div style="width: 100%">
                    <v-divider></v-divider>
                </div>
                <div class="graph-display mb-3">
                    <v-sparkline
                        :value="values"
                        :smooth="radius || false"
                        :padding="padding"
                        :line-width="width"
                        :stroke-linecap="lineCap"
                        :gradient="gradient"
                        :gradient-direction="gradientDirection"
                    ></v-sparkline>
                </div>
                <div style="width: 100%">
                    <v-divider></v-divider>
                </div>
                <div class="days-display mt-10">
                    <v-card v-for="(day, i) in days" :key="i">
                        <v-card-title>
                            {{ day.day }}
                        </v-card-title>
                        <v-card-text class="d-flex justify-center align-center">
                             <v-progress-circular :value="day.score" width="3" size="50" :color="scoreColor(day.score)">
                                {{ scoreLetter(day.score) }}
                            </v-progress-circular>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-dialog>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        outlined
                                        color="primary"
                                        v-bind="attrs"
                                        v-on="on"
                                        @click="viewingDay=day"
                                    >{{ $t('message.view') }}</v-btn>
                                </template>
                                <template v-slot:default="dialog">
                                    <v-card>
                                        <v-card-title>
                                            <div class="text-h4">{{ day.day }}</div>
                                            <v-spacer></v-spacer>
                                            <v-progress-circular :value="day.accuracyScore" width="3" size="40" :color="scoreColor(day.accuracyScore)" class="mx-1">
                                                {{ scoreLetter(day.accuracyScore) }}
                                            </v-progress-circular>
                                             <v-progress-circular :value="day.satisfactionScore" width="3" size="40" :color="scoreColor(day.satisfactionScore)" class="mx-1">
                                                {{ scoreLetter(day.satisfactionScore) }}
                                            </v-progress-circular>
                                             <v-progress-circular :value="day.performanceScore" width="3" size="40" :color="scoreColor(day.performanceScore)" class="mx-1">
                                                {{ scoreLetter(day.performanceScore) }}
                                            </v-progress-circular>
                                            <v-progress-circular :value="day.score" width="3" size="50" :color=scoreColor(day.score) class="mx-1">
                                                {{ scoreLetter(day.score) }}
                                            </v-progress-circular>
                                        </v-card-title>
                                        <v-card-text>
                                            <div class="text-h5 pt-5 pb-5">{{ $t('message.logs') }}</div>
                                            <table class="query-list-table">
                                                <colgroup>
                                                <col>
                                                <col>
                                                <col>
                                                </colgroup>
                                                <thead>
                                                <tr>
                                                    <th>{{ $t('message.activity') }}</th>
                                                    <th>{{ $t('message.start') }}</th>
                                                    <th>{{ $t('message.end') }}</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(activity, i) in day.activities" :key="i">
                                                        <td>{{ activity.name }}</td>
                                                        <td>{{ activity.start }}</td>
                                                        <td>{{ activity.end }}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div class="text-h5 pt-5 pb-5">{{ $t('message.workedCampaigns') }}</div>
                                            <div class="text">{{ workedCampaigns }}</div>
                                            <div class="text-h5 pt-5 pb-5">{{ $t('message.objectives') }}</div>
                                            <div v-for="(objective, i) in day.objectives" :key="i">
                                                <v-divider></v-divider>
                                                <div class="text-h6">
                                                    {{ objective.name }}
                                                </div>
                                                <div class="text-subtitle-1  my-2">
                                                    {{ $t('message.campaigns') }}: {{ campaignsList(objective.campaigns) }}
                                                </div>
                                                <table class="query-list-table">
                                                    <colgroup>
                                                        <col>
                                                        <col>
                                                        <col>
                                                    </colgroup>
                                                    <thead>
                                                    <tr>
                                                        <th>{{ $t('message.activity') }}</th>
                                                        <th>{{ $t('message.accuracy') }}</th>
                                                        <th>{{ $t('message.satisfaction') }}</th>
                                                        <th>{{ $t('message.performance') }}</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(activity, i) in day.activities" :key="i">
                                                            <td>{{ activity.name }}</td>
                                                            <td>{{ activity.realDuration }}/{{ activity.duration }}</td>
                                                            <td>{{ (1 + activity.satisfaction)*20 }} %</td>
                                                            <td>{{ activity.performance }} %</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div class="text-subtitle-1 mt-2">
                                                    {{ $t('message.description') }}:
                                                </div>
                                                <div class="text-body-1">
                                                    {{ objective.description }}
                                                </div>
                                                <div class="text-subtitle-1 mt-2">
                                                    {{ $t('message.observations') }}:
                                                </div>
                                                <div class="text-body-1">
                                                    {{ objective.observations }}
                                                </div>
                                            </div>
                                            <div class="text-h5 pt-5 pb-5" v-if="day.additionals.length">Aditional</div>
                                            <div class="text" v-for="(additional, i) in day.additionals" :key="i">{{ additional }}</div>
                                            <div class="text-h5 pt-5 pb-5">{{ $t('message.evaluation') }}</div>
                                            <div class="text">{{ day.evaluation }}</div>
                                        </v-card-text>
                                        <v-card-actions class="justify-end">
                                            <v-btn
                                                text
                                                @click="dialog.value = false; viewingDay=null"
                                            >{{ $t('message.close') }}</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </template>
                            </v-dialog>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>

function daysDiff(day1, day2) {
    let date1 = day1;
    date1 = new Date(date1.split('/')[2],date1.split('/')[1]-1,date1.split('/')[0]);
    let date2 = day2
    date2 = new Date(date2.split('/')[2],date2.split('/')[1]-1,date2.split('/')[0]);
    var timeDiff = Math.abs(date1.getTime() - date2.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return diffDays - 1
}

export default {
    name: 'DataView',

    data: () => ({
        width: 1,
        radius: 0,
        padding: 8,
        lineCap: 'round',
        values: [],
        gradient: [],
        gradientDirection: 'left',
        days: [],
        viewingDay: null,
    }),

    computed: {
        scoreColor() {
            return (score) => {
                if (score<=33) {return 'red'}
                else if (score<=66) {return 'amber'}
                else if (score<=100) {return 'success'}
                else {return 'primary'}
            }
        },
        campaignsList() {
            return (list) => {
                let campaigns = []
                for (let i=0; i<list.length; i++) {
                    campaigns.push(list[i].name)
                }
                return campaigns.join(', ')
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
        workedCampaigns() {
            let campaigns = []
            if (this.viewingDay) {
                for (let i = 0; i < this.viewingDay.objectives.length; i++) {
                    for (let j = 0; j < this.viewingDay.objectives[i].campaigns.length; j++) {
                        campaigns.push(this.viewingDay.objectives[i].campaigns[j].name)
                    }
                }

                campaigns = Array.from(new Set(campaigns));

                return campaigns.join(', ')
            }
            return ''
        }
    },
    async created() {
        const message = await new Promise(resolve => {
            window.electronAPI.getDays()
            window.electronAPI.response('get-days-response', resolve)
        })
        this.days = message
        if (message) {
            this.values.push(message[0].score)
            if (message[0].score<=33) {this.gradient.push('#FF5252')}
            else if (message[0].score<=66) {this.gradient.push('#FFC107')}
            else if (message[0].score<=100) {this.gradient.push('#4CAF50')}
            else {this.gradient.push('#2196F3')}
            for (let i=1; i<message.length; i++) {
                this.values.push(message[i].score)
                if (message[i].score<=33) {this.gradient.push('#FF5252')}
                else if (message[i].score<=66) {this.gradient.push('#FFC107')}
                else if (message[i].score<=100) {this.gradient.push('#4CAF50')}
                else {this.gradient.push('#2196F3')}

                for (let j=0; j<daysDiff(message[i].day, message[i-1].day); j++) {
                    this.values.push(0)
                }
            }
        }
    }
};

</script>

<style scoped>
    #progress {
        height: calc(100vh - 72px);
        width: 100h;
        overflow: hidden;
        padding: 20px;
    }
    .container {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        overflow: scroll;
    }
    .graph-display {
        width: 80%;
    }
    .days-display {
        width: 100%;
        display: flex;
        gap: 10px;
        margin: 10px;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }
    .query-list-table {
        width: 100%;
        table-layout: fixed;
    }
    table {
        border-collapse: collapse;
    }
    .query-list-table td, .query-list-table th {
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: fit-content !important;
    }
    table, th, td {
        border: 1px solid var(--text-secondary);
        text-align: center;
        vertical-align: middle;
        padding: 8px;
    }
</style>
  