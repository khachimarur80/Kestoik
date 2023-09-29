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
                <div class="d-flex" style="gap: 10px; height: 100%;">
                    <div class="campaigns">
                        <v-card width="100%" height="100%" class="pa-2">
                            <div v-for="(campaign, i)  in campaigns" :key="i" @mousedown="setEditingCampaign(campaign)" class="campaign text">
                                {{ campaign.name }}
                            </div>
                        </v-card>
                    </div>
                    <div class="campaign-details" v-if="editingCampaign">
                        <v-card width="100%" height="100%" class="pa-2">
                            <div class="text-h4">
                                <input style="outline: none;" v-model="editingCampaign.name">
                            </div>
                            <div class="text-h6 mt-3 mb-3">Description</div>
                            <v-textarea 
                                class="campaign-description" 
                                v-model="editingCampaign.description"
                                :rows="2"
                                auto-grow
                                outlined
                            >
                            </v-textarea>
                        </v-card>
                    </div>
                </div>
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
        editingCampaign: null,
    }),
    methods: {
        setEditingCampaign(campaign) {
            if (this.editingCampaign == campaign) {
                this.editingCampaign = null
            }
            else {
                this.editingCampaign = campaign
            }
        },
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
    .campaigns {
        flex: 1;
        height: 100%;
    }
    .campaign-details {
        flex: 1;
        height: 100%;
    }
</style>