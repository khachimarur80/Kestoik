<template>
    <div id="campaigns">
        <div class="container">
            <div class="frame">
                <div class="create-campaign">
                    <div class="create-activity">
                        <div class="d-flex align-center">
                            <v-text-field 
                                hide-details 
                                solo 
                                dense 
                                outlined 
                                flat 
                                autofocus 
                                @keydown.enter="createCampaign"
                                v-model="inputingCampaign" 
                                id="createActivity">
                            </v-text-field>
                        </div>
                    </div>
                </div>
                <p v-for="(campaign, i) in campaigns" :key="i">{{ campaign.name }} <v-btn icon small @click="removeCampaign(i)"><v-icon>mdi-close</v-icon></v-btn></p>
            </div>
        </div>
    </div>
</template>
  
<script>

class Campaign {
    constructor(name) {
        this.name = name
        this.start = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        this.end = null
    }
}

export default {
    name: 'CampaignView',

    data: () => ({
        inputingCampaign: '',
        campaigns: [],
    }),
    methods: {
        createCampaign() {
            if (this.inputingCampaign) {
                let campaign = new Campaign(this.inputingCampaign)
                this.inputingCampaign = ''
                this.campaigns.push(campaign)
            }
        },
        removeCampaign(i) {
            this.campaigns.splice(i, 1)
        },
        saveCampaignsData() {
            window.electronAPI.saveCampaigns(this.campaigns)
        },
    },
    async created() {
        const message = await new Promise(resolve => {
            window.electronAPI.getCampaigns()
            window.electronAPI.response('get-campaigns-response', resolve)
        })

        if (message) {
            this.campaigns = message
        }
    },
    watch: {
        campaigns: {
            deep: true,
            handler() {
                this.saveCampaignsData()
            }
        },
    }
};

</script>

<style scoped>
    #campaigns {
        height: calc(100vh - 72px);
        width: 100h;
        overflow: hidden;
        padding: 20px;
    }
    #campaigns input {
        color: #fff !important;
    }
    .container {
        height: calc(100% - 26px);
        margin-top: 26px;
        flex: 1;
        border: 1px solid #888;
        border-radius: 10px;
        position: relative;
        z-index: 1;
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
    .create-campaign {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 25%;
    }
</style>