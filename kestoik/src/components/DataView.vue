<template>
    <div id="progress">
        <div class="container">
            <h2>Puntuación</h2>
            <div class="graph-display">
                <v-sparkline
                    :value="values"
                    :smooth="radius || false"
                    :padding="padding"
                    :line-width="width"
                    :stroke-linecap="lineCap"
                    :gradient-direction="gradientDirection"
                ></v-sparkline>
            </div>
            <div class="days-display">
                <v-card v-for="(day, i) in days" :key="i">
                    <v-card-title>
                        {{ day.day }}
                    </v-card-title>
                    <v-card-text class="d-flex justify-center align-center">
                        <v-progress-circular :value="day.score" width="5" size="50" :color="scoreColor(day.score)">
                            {{ day.score }}
                        </v-progress-circular>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn v-bind="props" color="primary" outlined>View
                            <v-dialog
                                activator="parent"
                                width="auto"
                            >
                                <v-card>
                                    <v-card-text>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-btn color="primary" block @click="dialog = false">Close Dialog</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-btn>
                    </v-card-actions>
                </v-card>
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

    return diffDays
}

export default {
    name: 'DataView',

    data: () => ({
        width: 1,
        radius: 0,
        padding: 8,
        lineCap: 'round',
        values: [],
        gradientDirection: 'top',
        days: [],
    }),

    computed: {
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
            window.electronAPI.getDays()
            window.electronAPI.response('get-days-response', resolve)
        })
        this.days = message
        if (message) {
            this.values.push(message[0].score)
            for (let i=1; i<message.length; i++) {
                this.values.push(message[i].score)
                for (let j=0; j<daysDiff(message[i].day, message[i-1].day); j++) {
                    this.values.push(0)
                }
            }
        }
    },
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
        align-items: center;
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
</style>
  