<template>
    <v-dialog persistent max-width="400px" v-model="modalState">
        <v-card color="secondary">
            <v-card-title class="fifth--text">Удалить задание?</v-card-title>
            <v-card-text class="py-0 modalCardBody"
                >Вы действительно хотите удалить это задание?</v-card-text
            >
            <v-card-actions class="actionsRow">
                <v-btn outlined color="primary" @click="processAnswer(true)"
                    >Да</v-btn
                >
                <v-btn outlined color="primary" @click="processAnswer(false)"
                    >Нет</v-btn
                >
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
    name: "AppDeleteModal",
    computed: {
        ...mapGetters(["showDeleteModal"]),
        modalState: {
            get() {
                return this.showDeleteModal
            },
            set() {
                this.closeDeleteModal()
            },
        },
    },
    methods: {
        ...mapActions(["closeDeleteModal", "deleteTask"]),
        processAnswer(answer) {
            if (answer === true) this.deleteTask()
            this.closeDeleteModal()
        },
    },
}
</script>

<style lang="scss" scoped>
.modalCardBody {
    font-size: 1rem;
}

.actionsRow {
    display: flex;
    justify-content: flex-end;
}
</style>
