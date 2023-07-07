<template>
    <v-dialog persistent max-width="400px" v-model="modalState">
        <v-card color="secondary">
            <v-card-title class="fifth--text"> Удалить задание? </v-card-title>
            <v-card-text class="py-0 modal-card-body">
                Вы действительно хотите удалить это задание?
            </v-card-text>
            <v-card-actions class="actions-row">
                <v-btn outlined color="primary" @click="processAnswer(true)">
                    Да
                </v-btn>
                <v-btn outlined color="primary" @click="processAnswer(false)">
                    Нет
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import { mapActions, mapState } from "vuex"

    export default {
        name: "AppDeleteModal",
        computed: {
            ...mapState(["showDeleteModal"]),
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
                if (answer) this.deleteTask()
                this.closeDeleteModal()
            },
        },
    }
</script>

<style lang="scss" scoped>
    .modal-card-body {
        font-size: 1rem;
    }

    .actions-row {
        display: flex;
        justify-content: flex-end;
    }
</style>
