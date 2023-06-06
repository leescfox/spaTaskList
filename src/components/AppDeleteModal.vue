<template>
    <v-dialog persistent max-width="400px" v-model="modalState">
        <v-card>
            <v-card-title>Удалить задание?</v-card-title>
            <v-card-text class="py-0 modalCardBody"
                >Вы действительно хотите удалить это задание?</v-card-text
            >
            <v-card-actions class="rowContainer actionsRow">
                <v-btn
                    outlined
                    color="green darken-1"
                    @click="processAnswer(true)"
                    >Да</v-btn
                >
                <v-btn
                    outlined
                    color="red darken-2"
                    @click="processAnswer(false)"
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

<style lang="scss" scoped></style>
